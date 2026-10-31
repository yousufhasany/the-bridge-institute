import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { env } from '../config/env.js';

export const randomToken = (bytes = 32) => randomBytes(bytes).toString('base64url');

/** Tokens are stored only as keyed hashes so a database leak does not expose live sessions. */
export const hashToken = (token: string) => createHmac('sha256', env.SESSION_SECRET).update(token).digest('hex');

export function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function referenceCode(prefix: string, length = 8) {
  const bytes = randomBytes(length);
  let out = '';
  for (const b of bytes) out += REF_ALPHABET[b % REF_ALPHABET.length];
  return `${prefix}-${new Date().getUTCFullYear()}-${out}`;
}
