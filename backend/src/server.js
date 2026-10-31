const fs = require('fs');
const path = require('path');

// Vercel runs this file. It must not require npm packages: the file tracer
// omits them, which is why cookie-parser crashed every /api/v1 request.
// Dependencies live inside ./api.cjs. This file only points Prisma at the
// Linux query engine, then loads that bundle.

const engineName = 'libquery_engine-rhel-openssl-3.0.x.so.node';
const engineCandidates = [
  path.join(__dirname, '..', 'query-engine', engineName),
  path.join(__dirname, 'query-engine', engineName),
  path.join(process.cwd(), 'query-engine', engineName),
  path.join(process.cwd(), 'backend', 'query-engine', engineName),
  path.join('/var/task', 'query-engine', engineName),
];

if (process.platform === 'linux' && !process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
  const found = engineCandidates.find((file) => {
    try {
      return fs.existsSync(file);
    } catch {
      return false;
    }
  });
  if (found) process.env.PRISMA_QUERY_ENGINE_LIBRARY = found;
}

function report(detail) {
  module.exports = function app(_req, res) {
    const body = JSON.stringify({
      data: {
        status: 'boot-failed',
        detail: String(detail).replace(/postgres(?:ql)?:\/\/\S+/gi, 'postgresql://redacted').slice(0, 800),
      },
    });
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(body);
  };
}

try {
  const loaded = require('./api.cjs');
  const app = typeof loaded === 'function' ? loaded : loaded && loaded.default;
  if (typeof app !== 'function') throw new Error('API export was ' + typeof app);
  module.exports = app;
} catch (error) {
  report(error && error.stack ? error.stack : error);
}
