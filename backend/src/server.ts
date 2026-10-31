import express, { type Express } from 'express';

function bootErrorApp(message: string): Express {
  const app = express();
  app.disable('x-powered-by');
  app.use((_req, res) => {
    res.status(500).json({
      data: { status: 'degraded', database: 'unreachable' },
      error: { code: 'BOOT', message: message.slice(0, 500) },
    });
  });
  return app;
}

const app: Express = await (async () => {
  try {
    const loaded = await import('./app.js');
    return loaded.default as Express;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'API failed to start';
    console.error(message);
    return bootErrorApp(message);
  }
})();

export default app;

if (!process.env.VERCEL) {
  const { env } = await import('./config/env.js');
  const { logger } = await import('./lib/logger.js');
  const { prisma } = await import('./lib/prisma.js');
  const server = app.listen(env.PORT, () => {
    logger.info(`The Bridge Institute API listening on http://localhost:${env.PORT}/api/v1`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}
