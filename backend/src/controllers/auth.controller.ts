import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { SESSION_COOKIE, currentUser, sessionCookieOptions } from '../middleware/auth.js';
import { issueCsrfToken } from '../middleware/csrf.js';
import { audit } from '../services/audit.service.js';
import {
  consumePasswordToken,
  createPasswordToken,
  createSession,
  hashPassword,
  resolveSession,
  revokeSession,
  verifyCredentials,
} from '../services/auth.service.js';
import { sendEmail } from '../services/email.service.js';
import { buildMe } from '../services/user.service.js';
import { ApiError, body, ok } from '../utils/http.js';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  updateMeSchema,
} from '../validators/auth.validators.js';

async function startSession(req: Request, res: Response, userId: string) {
  const { token } = await createSession(userId, { ip: req.ip, userAgent: req.get('user-agent') });
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions());
  const auth = await resolveSession(token);
  req.auth = auth ?? undefined;
  return auth!;
}

export function csrf(req: Request, res: Response) {
  ok(res, { csrfToken: issueCsrfToken(req, res) });
}

export async function login(req: Request, res: Response) {
  const input = body(req, loginSchema);
  const user = await verifyCredentials(input.email, input.password);
  // Rotate any previous session presented by this browser.
  if (req.auth) await revokeSession(req.auth.sessionId);
  const auth = await startSession(req, res, user.id);
  await audit(req, { action: 'auth.login', entityType: 'User', entityId: user.id });
  ok(res, await buildMe(auth));
}

export async function logout(req: Request, res: Response) {
  if (req.auth) {
    await revokeSession(req.auth.sessionId);
    await audit(req, { action: 'auth.logout', entityType: 'User', entityId: req.auth.id });
  }
  const options: Partial<ReturnType<typeof sessionCookieOptions>> = sessionCookieOptions();
  delete options.maxAge;
  res.clearCookie(SESSION_COOKIE, options);
  ok(res, { loggedOut: true });
}

export async function me(req: Request, res: Response) {
  // A cached signed-in response must not be reused after the session cookie is gone.
  res.set('Cache-Control', 'private, no-store');
  if (!req.auth) return ok(res, null);
  ok(res, await buildMe(req.auth));
}

/** Public self-registration is disabled; administrators create accounts in Admin → Users. */
export function register(_req: Request, _res: Response) {
  throw ApiError.forbidden('Public registration is disabled. Contact The Bridge Institute for an account.');
}

/** Always responds identically so the endpoint cannot be used to discover accounts. */
export async function forgotPassword(req: Request, res: Response) {
  const input = body(req, forgotPasswordSchema);
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (user && user.isActive) {
    const token = await createPasswordToken(user.id, 'reset', 1);
    const link = `${env.APP_URL.replace(/\/+$/, '')}/reset-password?token=${encodeURIComponent(token)}`;
    await sendEmail({
      to: user.email,
      subject: 'Reset your password - The Bridge Institute',
      text: `Hello ${user.fullName},\n\nUse this link to reset your password (valid for 1 hour):\n\n${link}\n\nIf you did not request this, you can ignore this email.`,
    });
    await audit(req, { action: 'auth.password_reset_requested', entityType: 'User', entityId: user.id });
  }
  ok(res, { message: 'If an account exists for this email, a reset link has been sent.' });
}

export async function resetPassword(req: Request, res: Response) {
  const input = body(req, resetPasswordSchema);
  const userId = await consumePasswordToken(input.token, input.password);
  await audit(req, { action: 'auth.password_reset', entityType: 'User', entityId: userId });
  ok(res, { reset: true });
}

export async function changePassword(req: Request, res: Response) {
  const auth = currentUser(req);
  const input = body(req, changePasswordSchema);
  const user = await prisma.user.findUniqueOrThrow({ where: { id: auth.id } });
  if (!user.passwordHash || !(await bcrypt.compare(input.currentPassword, user.passwordHash))) {
    throw new ApiError(400, 'INVALID_PASSWORD', 'Current password is incorrect');
  }
  await prisma.$transaction([
    prisma.user.update({ where: { id: auth.id }, data: { passwordHash: await hashPassword(input.newPassword) } }),
    // Sign out every other device.
    prisma.session.updateMany({
      where: { userId: auth.id, revokedAt: null, NOT: { id: auth.sessionId } },
      data: { revokedAt: new Date() },
    }),
  ]);
  await audit(req, { action: 'auth.password_changed', entityType: 'User', entityId: auth.id });
  ok(res, { changed: true });
}

export async function updateMe(req: Request, res: Response) {
  const auth = currentUser(req);
  const input = body(req, updateMeSchema);
  await prisma.user.update({ where: { id: auth.id }, data: input });
  ok(res, await buildMe(auth));
}
