import './prisma-engine.js';
import { PrismaClient } from '../../generated/prisma/index.js';
import { envError, isProduction } from '../config/env.js';

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
