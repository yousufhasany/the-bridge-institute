const express = require('express');

function failureApp(error) {
  const message = error && (error.stack || error.message) ? error.stack || error.message : String(error);
  const detail = message.replace(/postgres(?:ql)?:\/\/\S+/gi, 'postgresql://redacted').slice(0, 800);
  const app = express();
  app.use((_req, res) => {
    res.status(500).json({ data: { status: 'boot-failed', detail } });
  });
  return app;
}

let app;
try {
  const fs = require('fs');
  const path = require('path');
  const engine = path.join(__dirname, 'query-engine', 'libquery_engine-rhel-openssl-3.0.x.so.node');
  if (process.platform === 'linux' && !process.env.PRISMA_QUERY_ENGINE_LIBRARY && fs.existsSync(engine)) {
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = engine;
  }
  const loaded = require('./api.cjs');
  app = loaded && loaded.default ? loaded.default : loaded;
  if (typeof app !== 'function') throw new Error('API export was ' + typeof app);
} catch (error) {
  app = failureApp(error);
}

module.exports = app;
