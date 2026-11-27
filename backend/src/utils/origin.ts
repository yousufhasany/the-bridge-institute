import type { Request } from 'express';
import { allowedOrigins, isProduction } from '../config/env.js';

/**
 * Browser requests are allowed when the origin is configured, or when it is the
 * same host the visitor called. The Host header is set by the browser from the
 * request URL, so a page on another site cannot make the two match.
 */
export function isAllowedOrigin(origin: string | null | undefined, req: Request): boolean {
  if (!origin) return false;
  if (allowedOrigins.includes(origin)) return true;

  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  if (url.origin !== origin || url.username || url.password) return false;
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

  const requestHost = req.get('host')?.split(',')[0]?.trim().toLowerCase();
  if (!requestHost || url.host.toLowerCase() !== requestHost) return false;

  const forwardedProto = req.get('x-forwarded-proto')?.split(',')[0]?.trim().toLowerCase();
  if ((isProduction || req.secure || forwardedProto === 'https') && url.protocol !== 'https:') return false;
  return true;
}
