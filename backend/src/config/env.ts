import { z } from 'zod';

function deploymentOrigins() {
  const hosts = [process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL].filter(
    (host): host is string => Boolean(host),
  );
  return [...new Set(hosts.map((host) => `https://${host}`))];
}

if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

const origins = deploymentOrigins();
const localOrigin = (value: string | undefined) =>
  !value || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(value);

if (origins.length > 0) {
  const primary =
    process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : origins[0];
  // A copied local .env must not keep the live site locked to localhost.
  if (localOrigin(process.env.WEB_ORIGIN)) process.env.WEB_ORIGIN = origins.join(',');
  if (localOrigin(process.env.APP_URL)) process.env.APP_URL = primary;
  if (!process.env.TRUST_PROXY || process.env.TRUST_PROXY === '0') process.env.TRUST_PROXY = '1';
}

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

/** Missing keys are named here. Values are never included. */
export const envError = parsed.success
  ? null
  : parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');

const fallback = {
  NODE_ENV: 'production' as const,
  PORT: '5000',
  WEB_ORIGIN: 'http://localhost:5173',
  APP_URL: 'http://localhost:5173',
  DATABASE_URL: 'postgresql://invalid:invalid@127.0.0.1:5432/invalid',
  SESSION_SECRET: 'x'.repeat(32),
  SESSION_TTL_HOURS: '72',
  COOKIE_SAMESITE: 'lax' as const,
  TRUST_PROXY: '1',
  LOG_LEVEL: 'silent' as const,
};

// Do not call process.exit. On Vercel that becomes a blank FUNCTION_INVOCATION_FAILED page.
export const env = parsed.success ? parsed.data : schema.parse(fallback);
export const isProduction = env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
export const allowedOrigins = [
  ...new Set([...env.WEB_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean), ...deploymentOrigins()]),
];
export const storageConfigured = Boolean(env.STORAGE_URL && env.STORAGE_SERVICE_KEY);
