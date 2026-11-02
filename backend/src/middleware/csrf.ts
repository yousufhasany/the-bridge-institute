import type { NextFunction, Request, Response } from 'express';
import { allowedOrigins, env, isProduction } from '../config/env.js';
import { randomToken, safeEqual } from '../utils/crypto.js';
import { ApiError } from '../utils/http.js';

export const CSRF_COOKIE = 'bi_csrf';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/** Prefer Origin; fall back to Referer so cross-site POSTs cannot skip the allow-list. */
function requestOrigin(req: Request): string | null {
  const origin = req.get('origin');
  if (origin) return origin;
  const referer = req.get('referer');
  if (!referer) return null;
  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

/**
 * Double-submit CSRF protection. GET /auth/csrf stores a random token in an HTTP-only
 * cookie and returns it in the body; the SPA echoes it in the X-CSRF-Token header.
 * A cross-site attacker can neither read the body nor set the header.
 */
export function issueCsrfToken(req: Request, res: Response) {
  const existing = req.cookies?.[CSRF_COOKIE];
  const token = typeof existing === 'string' && existing.length >= 32 ? existing : randomToken(24);
  res.cookie(CSRF_COOKIE, token, {
    httpOnly: true,
    secure: isProduction || env.COOKIE_SAMESITE === 'none',
    sameSite: env.COOKIE_SAMESITE,
    path: '/',
  });
  return token;
}

export function csrfProtection(req: Request, _res: Response, next: NextFunction) {
  if (SAFE_METHODS.has(req.method)) return next();

  const origin = requestOrigin(req);
  if (origin && !allowedOrigins.includes(origin)) throw new ApiError(403, 'CSRF_ORIGIN', 'Origin not allowed');
  if (!origin) throw new ApiError(403, 'CSRF_ORIGIN', 'Origin not allowed');

  const cookie = req.cookies?.[CSRF_COOKIE];
  const header = req.get('x-csrf-token');
  if (typeof cookie !== 'string' || !header || !safeEqual(cookie, header)) {
    throw new ApiError(403, 'CSRF_INVALID', 'Invalid or missing CSRF token');
  }
  next();
}
