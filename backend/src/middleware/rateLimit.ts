import rateLimit, { type Options } from 'express-rate-limit';
import { isTest } from '../config/env.js';

const handler: Options['handler'] = (req, res) => {
  res.status(429).json({
    error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.', requestId: req.id },
  });
};

const make = (windowMs: number, limit: number) =>
  rateLimit({ windowMs, limit, standardHeaders: 'draft-8', legacyHeaders: false, handler, skip: () => isTest });

/** Broad protection for the whole API. */
export const globalLimiter = make(15 * 60_000, 600);
/** Login, password reset and registration. */
export const authLimiter = make(15 * 60_000, 20);
/** Public form submissions (applications, contact, partnership inquiries). */
export const formLimiter = make(10 * 60_000, 10);
