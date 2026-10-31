import type { Request, Response } from 'express';
import { ALL_PERMISSIONS } from '../config/permissions.js';
import { prisma, Prisma } from '../lib/prisma.js';
import { currentUser } from '../middleware/auth.js';
import { audit } from '../services/audit.service.js';
import { revokeAllSessions } from '../services/auth.service.js';
import { inviteUser } from '../services/user.service.js';
import { ApiError, body, created, idParam, noContent, ok, orderBy, pageArgs, pageMeta, paginationSchema, parse } from '../utils/http.js';
import {
  createRoleSchema,
  createUserSchema,
  rolePermissionsSchema,
  updateUserSchema,
  userFilterSchema,
} from '../validators/admin.validators.js';

const userSelect = {
  id: true,
  email: true,
  fullName: true,
  phone: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  roles: { select: { role: { select: { key: true, name: true } } } },
} satisfies Prisma.UserSelect;

const shapeUser = (u: Prisma.UserGetPayload<{ select: typeof userSelect }>) => ({
  ...u,
  roles: u.roles.map((r) => r.role),
});

/** Only a Super Admin may grant or remove the Super Admin role. */
async function resolveRoles(req: Request, roleKeys: string[]) {
  const roles = await prisma.role.findMany({ where: { key: { in: roleKeys } } });
  if (roles.length !== new Set(roleKeys).size) throw ApiError.badRequest('One or more roles do not exist');
  if (roleKeys.includes('SUPER_ADMIN') && !currentUser(req).roles.includes('SUPER_ADMIN')) {
    throw ApiError.forbidden('Only a Super Admin can grant the Super Admin role');
  }
  return roles;
}

export async function listUsers(req: Request, res: Response) {
  const p = parse(paginationSchema, req.query);
  const f = parse(userFilterSchema, req.query);
  const where: Prisma.UserWhereInput = {
    ...(f.role ? { roles: { some: { role: { key: f.role } } } } : {}),
    ...(f.isActive ? { isActive: f.isActive === 'true' } : {}),
    ...(p.q
      ? { OR: [{ fullName: { contains: p.q, mode: 'insensitive' } }, { email: { contains: p.q, mode: 'insensitive' } }] }
      : {}),
  };
  const [items, total] = await Promise.all([
    prisma.user.findMany({ where, select: userSelect, orderBy: orderBy(p, ['createdAt', 'fullName', 'email', 'lastLoginAt']), ...pageArgs(p) }),
    prisma.user.count({ where }),
  ]);
  ok(res, items.map(shapeUser), pageMeta(p, total));
}

export async function getUser(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: idParam(req) }, select: userSelect });
  if (!user) throw ApiError.notFound();
  ok(res, shapeUser(user));
}

export async function createUser(req: Request, res: Response) {
  const input = body(req, createUserSchema);
  const roles = await resolveRoles(req, input.roleKeys);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      fullName: input.fullName,
      phone: input.phone,
      roles: { create: roles.map((r) => ({ roleId: r.id })) },
    },
    select: userSelect,
  });
  const invite = await inviteUser(user.id, user.email, user.fullName);
  await audit(req, { action: 'user.create', entityType: 'User', entityId: user.id, metadata: { roles: input.roleKeys } });
  created(res, { user: shapeUser(user), ...invite });
}

export async function updateUser(req: Request, res: Response) {
  const id = idParam(req);
  const actor = currentUser(req);
  const input = body(req, updateUserSchema);
  const target = await prisma.user.findUnique({ where: { id }, include: { roles: { include: { role: true } } } });
  if (!target) throw ApiError.notFound();

  const targetIsSuper = target.roles.some((r) => r.role.key === 'SUPER_ADMIN');
  if (targetIsSuper && !actor.roles.includes('SUPER_ADMIN')) throw ApiError.forbidden('Only a Super Admin can modify a Super Admin');
  if (id === actor.id && input.isActive === false) throw ApiError.badRequest('You cannot deactivate your own account');
  if (id === actor.id && input.roleKeys && targetIsSuper && !input.roleKeys.includes('SUPER_ADMIN')) {
    throw ApiError.badRequest('You cannot remove your own Super Admin role');
  }

  const { roleKeys, ...fields } = input;
  await prisma.$transaction(async (tx) => {
    if (Object.keys(fields).length) await tx.user.update({ where: { id }, data: fields });
    if (roleKeys) {
      const roles = await resolveRoles(req, roleKeys);
      if (targetIsSuper && !roleKeys.includes('SUPER_ADMIN') && !actor.roles.includes('SUPER_ADMIN')) throw ApiError.forbidden();
      await tx.userRole.deleteMany({ where: { userId: id } });
      await tx.userRole.createMany({ data: roles.map((r) => ({ userId: id, roleId: r.id })) });
    }
    if (input.isActive === false) {
      await tx.session.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
    }
    await audit(req, { action: 'user.update', entityType: 'User', entityId: id, metadata: { fields: Object.keys(input), roles: roleKeys } }, tx);
  });
  const user = await prisma.user.findUniqueOrThrow({ where: { id }, select: userSelect });
  ok(res, shapeUser(user));
}

export async function deleteUser(req: Request, res: Response) {
  const id = idParam(req);
  const actor = currentUser(req);
  if (id === actor.id) throw ApiError.badRequest('You cannot delete your own account');

  const target = await prisma.user.findUnique({
    where: { id },
    include: {
      roles: { include: { role: true } },
      studentProfile: { select: { enrollments: { select: { id: true } } } },
    },
  });
  if (!target) throw ApiError.notFound();

  const targetIsSuper = target.roles.some((r) => r.role.key === 'SUPER_ADMIN');
  if (targetIsSuper && !actor.roles.includes('SUPER_ADMIN')) {
    throw ApiError.forbidden('Only a Super Admin can delete a Super Admin');
  }
  if (targetIsSuper) {
    const otherSupers = await prisma.user.count({
      where: { id: { not: id }, roles: { some: { role: { key: 'SUPER_ADMIN' } } } },
    });
    if (otherSupers === 0) throw ApiError.badRequest('The last Super Admin account cannot be deleted');
  }

  const enrollmentIds = target.studentProfile?.enrollments.map((e) => e.id) ?? [];
  await prisma.$transaction(async (tx) => {
    if (enrollmentIds.length) {
      await tx.certificate.deleteMany({ where: { enrollmentId: { in: enrollmentIds } } });
      await tx.enrollment.deleteMany({ where: { id: { in: enrollmentIds } } });
    }
    await tx.user.delete({ where: { id } });
    await audit(req, { action: 'user.delete', entityType: 'User', entityId: id, metadata: { email: target.email, fullName: target.fullName } }, tx);
  });
  noContent(res);
}

export async function revokeUserSessions(req: Request, res: Response) {
  const id = idParam(req);
  await revokeAllSessions(id);
  await audit(req, { action: 'user.sessions_revoked', entityType: 'User', entityId: id });
  noContent(res);
}

export async function resendInvite(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: idParam(req) } });
  if (!user) throw ApiError.notFound();
  const invite = await inviteUser(user.id, user.email, user.fullName);
  await audit(req, { action: 'user.invite_sent', entityType: 'User', entityId: user.id });
  ok(res, invite);
}

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------
export async function listRoles(_req: Request, res: Response) {
  const roles = await prisma.role.findMany({
    orderBy: { createdAt: 'asc' },
    include: { permissions: { include: { permission: true } }, _count: { select: { users: true } } },
  });
  ok(
    res,
    roles.map((r) => ({
      id: r.id,
      key: r.key,
      name: r.name,
      description: r.description,
      isSystem: r.isSystem,
      userCount: r._count.users,
      permissions: r.permissions.map((p) => p.permission.key).sort(),
    })),
  );
}

export async function listPermissions(_req: Request, res: Response) {
  ok(res, await prisma.permission.findMany({ orderBy: { key: 'asc' } }));
}

async function permissionIds(keys: string[]) {
  const unknown = keys.filter((k) => !(ALL_PERMISSIONS as string[]).includes(k));
  if (unknown.length) throw ApiError.badRequest(`Unknown permissions: ${unknown.join(', ')}`);
  const rows = await prisma.permission.findMany({ where: { key: { in: keys } } });
  return rows.map((r) => r.id);
}

export async function createRole(req: Request, res: Response) {
  const input = body(req, createRoleSchema);
  const ids = await permissionIds(input.permissions);
  const role = await prisma.role.create({
    data: {
      key: input.key,
      name: input.name,
      description: input.description,
      isSystem: false,
      permissions: { create: ids.map((permissionId) => ({ permissionId })) },
    },
  });
  await audit(req, { action: 'role.create', entityType: 'Role', entityId: role.id, metadata: { permissions: input.permissions } });
  created(res, role);
}

export async function setRolePermissions(req: Request, res: Response) {
  const id = idParam(req);
  const input = body(req, rolePermissionsSchema);
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) throw ApiError.notFound();
  if (role.key === 'SUPER_ADMIN') throw ApiError.badRequest('Super Admin permissions cannot be changed');
  const ids = await permissionIds(input.permissions);
  await prisma.$transaction(async (tx) => {
    await tx.rolePermission.deleteMany({ where: { roleId: id } });
    await tx.rolePermission.createMany({ data: ids.map((permissionId) => ({ roleId: id, permissionId })) });
    await audit(req, { action: 'role.permissions_update', entityType: 'Role', entityId: id, metadata: { permissions: input.permissions } }, tx);
  });
  ok(res, { id, permissions: input.permissions });
}

export async function deleteRole(req: Request, res: Response) {
  const id = idParam(req);
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) throw ApiError.notFound();
  if (role.isSystem) throw ApiError.badRequest('System roles cannot be deleted');
  await prisma.role.delete({ where: { id } });
  await audit(req, { action: 'role.delete', entityType: 'Role', entityId: id });
  noContent(res);
}
