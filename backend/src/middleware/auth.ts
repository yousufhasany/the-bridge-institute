import type { NextFunction, Request, Response } from 'express';
import { env, isProduction } from '../config/env.js';
import type { PermissionKey } from '../config/permissions.js';
import { resolveSession } from '../services/auth.service.js';
import { ApiError } from '../utils/http.js';

export const SESSION_COOKIE = 'bi_session';

export const sessionCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction || env.COOKIE_SAMESITE === 'none',
  sameSite: env.COOKIE_SAMESITE,
  path: '/',
  maxAge: env.SESSION_TTL_HOURS * 3600_000,
});

/** Resolves the session cookie (if any) into req.auth. Never rejects on its own. */
export async function loadSession(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (typeof token === 'string' && token.length > 0 && token.length < 200) {
    req.auth = (await resolveSession(token)) ?? undefined;
  }
  next();
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!req.auth) throw ApiError.unauthorized();
  next();
}

export const hasPermission = (req: Request, permission: PermissionKey) => Boolean(req.auth?.permissions.has(permission));

/** Requires the user to hold at least one of the given permissions. */
export const requirePermission =
  (...permissions: PermissionKey[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) throw ApiError.unauthorized();
    if (!permissions.some((p) => req.auth!.permissions.has(p))) throw ApiError.forbidden();
    next();
  };

export function currentUser(req: Request) {
  if (!req.auth) throw ApiError.unauthorized();
  return req.auth;
}
