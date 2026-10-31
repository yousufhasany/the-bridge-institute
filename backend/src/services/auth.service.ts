import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import type { AuthUser } from '../types/auth.js';
import { hashToken, randomToken } from '../utils/crypto.js';
import { ApiError } from '../utils/http.js';

const BCRYPT_ROUNDS = 12;
// Pre-computed hash used to keep login timing similar for unknown emails.
const DUMMY_HASH = bcrypt.hashSync('timing-equaliser-not-a-password', BCRYPT_ROUNDS);

export const hashPassword = (password: string) => bcrypt.hash(password, BCRYPT_ROUNDS);

export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !user.passwordHash || !valid || !user.isActive) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }
  return user;
}

export async function createSession(userId: string, meta: { ip?: string; userAgent?: string }) {
  const token = randomToken(32);
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_HOURS * 3600_000);
  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
      ipAddress: meta.ip?.slice(0, 64),
      userAgent: meta.userAgent?.slice(0, 300),
    },
  });
  await prisma.user.update({ where: { id: userId }, data: { lastLoginAt: new Date() } });
  return { token, expiresAt };
}

export async function resolveSession(token: string): Promise<AuthUser | null> {
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: {
      user: {
        include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } },
      },
    },
  });
  if (!session || session.revokedAt || session.expiresAt < new Date() || !session.user.isActive) return null;

  // Refresh last-seen at most once per 5 minutes to limit write load.
  if (Date.now() - session.lastSeenAt.getTime() > 5 * 60_000) {
    await prisma.session.update({ where: { id: session.id }, data: { lastSeenAt: new Date() } });
  }

  const permissions = new Set<string>();
  for (const ur of session.user.roles) for (const rp of ur.role.permissions) permissions.add(rp.permission.key);

  return {
    id: session.user.id,
    sessionId: session.id,
    email: session.user.email,
    fullName: session.user.fullName,
    roles: session.user.roles.map((r) => r.role.key),
    permissions,
  };
}

export const revokeSession = (sessionId: string) =>
  prisma.session.update({ where: { id: sessionId }, data: { revokedAt: new Date() } });

export const revokeAllSessions = (userId: string) =>
  prisma.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });

/** Creates a single-use token for password reset or account invitation. Returns the raw token once. */
export async function createPasswordToken(userId: string, purpose: 'reset' | 'invite', ttlHours: number) {
  const token = randomToken(32);
  await prisma.passwordResetToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  });
  await prisma.passwordResetToken.create({
    data: { userId, purpose, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + ttlHours * 3600_000) },
  });
  return token;
}

export async function consumePasswordToken(token: string, newPassword: string) {
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    throw new ApiError(400, 'INVALID_TOKEN', 'This link is invalid or has expired');
  }
  const passwordHash = await hashPassword(newPassword);
  await prisma.$transaction([
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.session.updateMany({ where: { userId: record.userId, revokedAt: null }, data: { revokedAt: new Date() } }),
  ]);
  return record.userId;
}

export const passwordSchemaRules = { min: 10, max: 128 };
