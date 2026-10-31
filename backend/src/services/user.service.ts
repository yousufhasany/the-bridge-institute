import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import type { AuthUser } from '../types/auth.js';
import { createPasswordToken } from './auth.service.js';
import { sendEmail } from './email.service.js';

/** Shape returned by GET /auth/me. Contains no secrets. */
export async function buildMe(auth: AuthUser) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: auth.id },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      preferredLocale: true,
      studentProfile: { select: { id: true, studentCode: true, status: true } },
      alumniProfile: { select: { id: true, slug: true, verificationStatus: true } },
      alumniRequests: { select: { id: true, status: true, createdAt: true }, orderBy: { createdAt: 'desc' }, take: 1 },
    },
  });
  const { alumniRequests, ...rest } = user;
  return {
    ...rest,
    roles: auth.roles,
    permissions: [...auth.permissions].sort(),
    latestAlumniRequest: alumniRequests[0] ?? null,
  };
}

/**
 * Issues an invitation (set-password) link. The link is emailed when delivery succeeds.
 * If delivery does not succeed, the link is returned so an administrator can share it.
 */
export async function inviteUser(userId: string, emailAddress: string, fullName: string) {
  const token = await createPasswordToken(userId, 'invite', 72);
  const link = `${env.APP_URL.replace(/\/+$/, '')}/reset-password?token=${encodeURIComponent(token)}&invite=1`;
  const sent = await sendEmail({
    to: emailAddress,
    subject: 'Your account at The Bridge Institute',
    text: `Hello ${fullName},\n\nAn account has been created for you at The Bridge Institute. Set your password using this link (valid for 72 hours):\n\n${link}\n\nIf you were not expecting this message you can ignore it.`,
  });
  return { emailSent: sent, inviteUrl: sent ? null : link };
}

export async function assignRole(userId: string, roleKey: string) {
  const role = await prisma.role.findUniqueOrThrow({ where: { key: roleKey } });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId, roleId: role.id } },
    update: {},
    create: { userId, roleId: role.id },
  });
}
