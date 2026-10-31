import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '../../generated/prisma/index.js';
import { envError, isProduction } from '../config/env.js';

if (process.env.VERCEL && !process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
  const generatedDir = dirname(fileURLToPath(new URL('../../generated/prisma/index.js', import.meta.url)));
  const engine = join(generatedDir, 'libquery_engine-rhel-openssl-3.0.x.so.node');
  if (existsSync(engine)) process.env.PRISMA_QUERY_ENGINE_LIBRARY = engine;
}

function unavailable(message: string): PrismaClient {
  return new Proxy({} as PrismaClient, {
    get(_target, property) {
      if (property === 'then') return undefined;
      throw new Error(message);
    },
  });
}

function createClient() {
  if (envError) return unavailable(envError);
  try {
    return new PrismaClient({ log: isProduction ? ['error'] : ['warn', 'error'] });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database client failed to start';
    console.error(message);
    return unavailable(message);
  }
}

export const prisma = createClient();

export { Prisma } from '../../generated/prisma/index.js';
export type * from '../../generated/prisma/index.js';
