import { execSync } from 'node:child_process';
import { PrismaClient } from '../generated/prisma/index.js';

/**
 * Prepares the dedicated test database: applies pending migrations, empties every table
 * and seeds reference data (roles, permissions, courses, settings). Refuses to touch a
 * database whose name does not contain "test" to protect development and production data.
 */
export default async function setup() {
  const url = process.env.TEST_DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5433/bridge_test';
  const dbName = new URL(url).pathname.replace('/', '');
  if (!/test/i.test(dbName)) {
    throw new Error(`Refusing to run tests against "${dbName}". TEST_DATABASE_URL must point to a test database.`);
  }
  const env = { ...process.env, DATABASE_URL: url, DIRECT_URL: url };
  execSync('npx prisma migrate deploy', { env, stdio: 'pipe' });

  const prisma = new PrismaClient({ datasourceUrl: url });
  try {
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'`;
    if (tables.length) {
      await prisma.$executeRawUnsafe(`TRUNCATE ${tables.map((t) => `"public"."${t.tablename}"`).join(', ')} CASCADE`);
    }
  } finally {
    await prisma.$disconnect();
  }
  execSync('npx tsx ../database/prisma/seed.ts', { env, stdio: 'pipe' });
}
