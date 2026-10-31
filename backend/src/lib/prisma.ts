import { PrismaClient } from '../../generated/prisma/index.js';
import { isProduction } from '../config/env.js';

export const prisma = new PrismaClient({
  log: isProduction ? ['error'] : ['warn', 'error'],
});

export { Prisma } from '../../generated/prisma/index.js';
export type * from '../../generated/prisma/index.js';
