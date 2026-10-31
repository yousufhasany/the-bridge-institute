import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { allowedOrigins, env, envError } from './config/env.js';
import { logger } from './lib/logger.js';
import { loadSession } from './middleware/auth.js';
import { csrfProtection } from './middleware/csrf.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { globalLimiter } from './middleware/rateLimit.js';
import { requestId } from './middleware/requestId.js';
import { apiRouter } from './routes/index.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', env.TRUST_PROXY);

  app.use(requestId);
  app.use((req, res, next) => {
    const started = Date.now();
    res.on('finish', () => {
      const fields = { id: req.id, method: req.method, url: req.originalUrl, statusCode: res.statusCode, ms: Date.now() - started };
      if (res.statusCode >= 500) logger.error(fields, 'request');
      else if (res.statusCode >= 400) logger.warn(fields, 'request');
      else logger.info(fields, 'request');
    });
    next();
  });
  app.use(
    helmet({
      // The API only serves JSON; a locked-down CSP is safe.
      contentSecurityPolicy: { directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] } },
      crossOriginResourcePolicy: { policy: 'same-site' },
    }),
  );
  app.use(
    cors({
      origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'X-Request-Id'],
      maxAge: 600,
    }),
  );
  app.use(express.json({ limit: '200kb' }));
  app.use(express.urlencoded({ extended: false, limit: '50kb' }));
  app.use(cookieParser());

  app.use('/api/v1', globalLimiter, loadSession, csrfProtection, apiRouter);
  app.get('/', (_req, res) => res.json({ data: { name: 'The Bridge Institute API', docs: '/api/v1/health' } }));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

function configurationErrorApp(message: string) {
  const app = express();
  app.disable('x-powered-by');
  app.use((_req, res) => {
    res.status(500).json({
      data: { status: 'degraded', database: 'unreachable' },
      error: { code: 'CONFIG', message },
    });
  });
  return app;
}

export default envError ? configurationErrorApp(envError) : createApp();
