import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

const VALID_ID = /^[A-Za-z0-9._-]{8,64}$/;

/** Accepts a well-formed upstream X-Request-Id (e.g. from a load balancer) or generates one. */
export function requestId(req: Request, res: Response, next: NextFunction) {
  const incoming = req.get('x-request-id');
  req.id = incoming && VALID_ID.test(incoming) ? incoming : randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
}
