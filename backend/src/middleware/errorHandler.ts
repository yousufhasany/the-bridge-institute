import type { ErrorRequestHandler, RequestHandler } from 'express';
import { MulterError } from 'multer';
import { isProduction } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { Prisma } from '../lib/prisma.js';
import { ApiError } from '../utils/http.js';

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found', requestId: req.id } });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let error: ApiError;

  if (err instanceof ApiError) {
    error = err;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') error = ApiError.conflict('A record with these details already exists', 'DUPLICATE');
    else if (err.code === 'P2025') error = ApiError.notFound();
    else if (err.code === 'P2003') error = ApiError.conflict('This record is referenced by other records', 'IN_USE');
    else error = new ApiError(500, 'INTERNAL_ERROR', 'An unexpected error occurred');
  } else if (err instanceof MulterError) {
    error = ApiError.badRequest(err.code === 'LIMIT_FILE_SIZE' ? 'File is too large' : 'Invalid upload');
  } else if (err?.type === 'entity.parse.failed') {
    error = ApiError.badRequest('Malformed JSON body');
  } else if (err?.type === 'entity.too.large') {
    error = new ApiError(413, 'PAYLOAD_TOO_LARGE', 'Request body is too large');
  } else {
    error = new ApiError(500, 'INTERNAL_ERROR', 'An unexpected error occurred');
  }

  if (error.status >= 500) logger.error({ err, requestId: req.id }, 'Unhandled error');

  res.status(error.status).json({
    error: {
      code: error.code,
      message: error.message,
      ...(error.details !== undefined ? { details: error.details } : {}),
      requestId: req.id,
      ...(!isProduction && error.status >= 500 && err instanceof Error ? { debug: err.message } : {}),
    },
  });
};
