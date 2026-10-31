import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  WEB_ORIGIN: z.string().default('http://localhost:5173'),
  APP_URL: z.string().url().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),
  SESSION_TTL_HOURS: z.coerce.number().positive().default(72),
  COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  /** Number of reverse proxies in front of the API (needed for correct client IPs and rate limits). */
  TRUST_PROXY: z.coerce.number().int().min(0).max(5).default(0),
  STORAGE_URL: z.string().optional().default(''),
  STORAGE_SERVICE_KEY: z.string().optional().default(''),
  STORAGE_PUBLIC_BUCKET: z.string().default('public-media'),
  STORAGE_PRIVATE_BUCKET: z.string().default('private-files'),
  EMAIL_PROVIDER_API_KEY: z.string().optional().default(''),
  EMAIL_FROM: z.string().optional().default(''),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  console.error(`Invalid backend environment configuration:\n${issues}`);
  process.exit(1);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
export const allowedOrigins = env.WEB_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
export const storageConfigured = Boolean(env.STORAGE_URL && env.STORAGE_SERVICE_KEY);
