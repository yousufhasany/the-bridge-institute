import type { Request } from 'express';
import { logger } from '../lib/logger.js';
import { prisma, Prisma } from '../lib/prisma.js';

type Tx = Prisma.TransactionClient;

export interface AuditEntry {
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}

/** Records a sensitive change. Never pass passwords, tokens or other secrets in metadata. */
export async function audit(req: Request, entry: AuditEntry, tx: Tx = prisma) {
  try {
    await tx.auditLog.create({
      data: {
        actorId: req.auth?.id ?? null,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId ?? null,
        metadata: (entry.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
        ipAddress: req.ip?.slice(0, 64),
      },
    });
  } catch (error) {
    if (tx !== prisma) throw error;
    logger.error({ err: error, action: entry.action }, 'Failed to write audit log');
  }
}
