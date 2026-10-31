import { execSync } from 'node:child_process';

// `prisma generate` reads the schema's env() declarations but does not connect.
// A placeholder lets the Vercel install succeed before runtime secrets are present.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://user:pass@127.0.0.1:5432/bridge?schema=public';
}
if (!process.env.DIRECT_URL) process.env.DIRECT_URL = process.env.DATABASE_URL;

execSync('prisma generate', { stdio: 'inherit', env: process.env });
