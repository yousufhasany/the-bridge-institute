import type { Request, Response } from 'express';
import { z } from 'zod';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }

  static badRequest(message = 'Bad request', details?: unknown) {
    return new ApiError(400, 'BAD_REQUEST', message, details);
  }
  static unauthorized(message = 'Authentication required') {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }
  static forbidden(message = 'You do not have permission to perform this action') {
    return new ApiError(403, 'FORBIDDEN', message);
  }
  static notFound(message = 'Resource not found') {
    return new ApiError(404, 'NOT_FOUND', message);
  }
  static conflict(message = 'Conflict', code = 'CONFLICT') {
    return new ApiError(409, code, message);
  }
  static unavailable(message = 'Service unavailable', code = 'SERVICE_UNAVAILABLE') {
    return new ApiError(503, code, message);
  }
}

export function ok<T>(res: Response, data: T, meta?: Record<string, unknown>, status = 200) {
  return res.status(status).json(meta ? { data, meta } : { data });
}

export function created<T>(res: Response, data: T) {
  return ok(res, data, undefined, 201);
}

export function noContent(res: Response) {
  return res.status(204).end();
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
export function parse<T extends z.ZodTypeAny>(schema: T, input: unknown): z.infer<T> {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new ApiError(
      422,
      'VALIDATION_ERROR',
      'Validation failed',
      result.error.issues.map((i) => ({ path: i.path.join('.'), code: i.code, message: i.message })),
    );
  }
  return result.data;
}

export const body = <T extends z.ZodTypeAny>(req: Request, schema: T) => parse(schema, req.body ?? {});
export const query = <T extends z.ZodTypeAny>(req: Request, schema: T) => parse(schema, req.query ?? {});

export const uuidParam = z.object({ id: z.string().uuid() });
export const idParam = (req: Request) => {
  const result = uuidParam.safeParse(req.params);
  if (!result.success) throw ApiError.notFound();
  return result.data.id;
};

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().max(200).optional(),
  sort: z.string().max(50).optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});
export type Pagination = z.infer<typeof paginationSchema>;

export function pageArgs(p: Pagination) {
  return { skip: (p.page - 1) * p.pageSize, take: p.pageSize };
}

export function pageMeta(p: Pagination, total: number) {
  return { page: p.page, pageSize: p.pageSize, total, totalPages: Math.max(1, Math.ceil(total / p.pageSize)) };
}

/** Only whitelisted fields may be used for sorting. */
export function orderBy(p: Pagination, allowed: readonly string[], fallback = 'createdAt') {
  const field = p.sort && allowed.includes(p.sort) ? p.sort : fallback;
  return { [field]: p.order };
}

// ---------------------------------------------------------------------------
// Common field schemas
// ---------------------------------------------------------------------------
export const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null));

export const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .nullable()
  .refine((v) => !v || /^https?:\/\//i.test(v), 'Must be an http(s) URL')
  .transform((v) => (v ? v : null));

export const email = z.string().trim().toLowerCase().email().max(254);
