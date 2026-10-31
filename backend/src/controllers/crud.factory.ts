import { Router, type Request, type RequestHandler } from 'express';
import { z } from 'zod';
import type { PermissionKey } from '../config/permissions.js';
import { requirePermission } from '../middleware/auth.js';
import { audit } from '../services/audit.service.js';
import { ApiError, body, created, idParam, noContent, ok, orderBy, pageArgs, pageMeta, paginationSchema, parse } from '../utils/http.js';

/** The subset of a Prisma model delegate used by the factory. */
export interface Delegate {
  findMany(args: unknown): Promise<unknown[]>;
  findUnique(args: unknown): Promise<unknown>;
  count(args: unknown): Promise<number>;
  create(args: unknown): Promise<{ id: string }>;
  update(args: unknown): Promise<{ id: string }>;
  delete(args: unknown): Promise<unknown>;
}

export interface CrudOptions {
  delegate: Delegate;
  entity: string;
  permission: PermissionKey;
  createSchema: z.ZodTypeAny;
  updateSchema: z.ZodTypeAny;
  /** Text columns searched with `q` (case-insensitive contains). */
  searchFields?: string[];
  /** Columns that may be used for `sort`. */
  sortable: string[];
  defaultSort?: string;
  defaultOrder?: 'asc' | 'desc';
  /** Additional whitelisted query filters mapped to a Prisma `where` fragment. */
  filterSchema?: z.ZodTypeAny;
  filters?: (parsed: Record<string, unknown>) => Record<string, unknown>;
  include?: Record<string, unknown>;
  /** Hook to transform validated input (e.g. generate slugs, stamp timestamps). */
  prepare?: (data: Record<string, unknown>, req: Request, mode: 'create' | 'update') => Record<string, unknown> | Promise<Record<string, unknown>>;
  allowDelete?: boolean;
}

/**
 * Builds a paginated, validated, audited CRUD router for simple admin resources.
 * Only fields declared in the Zod schemas are ever written (no mass assignment).
 */
export function crudRouter(options: CrudOptions) {
  const router = Router();
  const guard = requirePermission(options.permission);
  const { delegate } = options;

  const list: RequestHandler = async (req, res) => {
    const pagination = parse(paginationSchema, req.query);
    const extra = options.filterSchema ? (parse(options.filterSchema, req.query) as Record<string, unknown>) : {};
    const where: Record<string, unknown> = { ...(options.filters?.(extra) ?? {}) };
    if (pagination.q && options.searchFields?.length) {
      where.OR = options.searchFields.map((f) => ({ [f]: { contains: pagination.q, mode: 'insensitive' } }));
    }
    const order = req.query.order ? pagination.order : options.defaultOrder ?? pagination.order;
    const sort = orderBy({ ...pagination, order }, options.sortable, options.defaultSort ?? 'createdAt');
    const [items, total] = await Promise.all([
      delegate.findMany({ where, orderBy: sort, include: options.include, ...pageArgs(pagination) }),
      delegate.count({ where }),
    ]);
    ok(res, items, pageMeta(pagination, total));
  };

  const get: RequestHandler = async (req, res) => {
    const item = await delegate.findUnique({ where: { id: idParam(req) }, include: options.include });
    if (!item) throw ApiError.notFound();
    ok(res, item);
  };

  const create: RequestHandler = async (req, res) => {
    let data = body(req, options.createSchema) as Record<string, unknown>;
    if (options.prepare) data = await options.prepare(data, req, 'create');
    const item = await delegate.create({ data, include: options.include });
    await audit(req, { action: `${options.entity}.create`, entityType: options.entity, entityId: item.id });
    created(res, item);
  };

  const update: RequestHandler = async (req, res) => {
    const id = idParam(req);
    let data = body(req, options.updateSchema) as Record<string, unknown>;
    if (Object.keys(data).length === 0) throw ApiError.badRequest('No changes supplied');
    if (options.prepare) data = await options.prepare(data, req, 'update');
    const item = await delegate.update({ where: { id }, data, include: options.include });
    await audit(req, { action: `${options.entity}.update`, entityType: options.entity, entityId: id, metadata: { fields: Object.keys(data) } });
    ok(res, item);
  };

  const remove: RequestHandler = async (req, res) => {
    const id = idParam(req);
    await delegate.delete({ where: { id } });
    await audit(req, { action: `${options.entity}.delete`, entityType: options.entity, entityId: id });
    noContent(res);
  };

  router.get('/', guard, list);
  router.get('/:id', guard, get);
  router.post('/', guard, create);
  router.patch('/:id', guard, update);
  if (options.allowDelete !== false) router.delete('/:id', guard, remove);
  return router;
}
