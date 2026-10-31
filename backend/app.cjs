const fs = require('fs');
const path = require('path');

const engine = path.join(__dirname, 'query-engine', 'libquery_engine-rhel-openssl-3.0.x.so.node');
if (process.platform === 'linux' && !process.env.PRISMA_QUERY_ENGINE_LIBRARY && fs.existsSync(engine)) {
  process.env.PRISMA_QUERY_ENGINE_LIBRARY = engine;
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function bootError(error) {
  const message = error && error.stack ? error.stack : String(error);
  const detail = message.replace(/postgres(?:ql)?:\/\/\S+/gi, 'postgresql://redacted').slice(0, 800);
  return function app(_req, res) {
    send(res, 500, { data: { status: 'boot-failed', detail } });
  };
}

let app;
try {
  const loaded = require('./api.cjs');
  app = loaded && loaded.default ? loaded.default : loaded;
  if (typeof app !== 'function') throw new Error('API export was ' + typeof app);
} catch (error) {
  app = bootError(error);
}

module.exports = app;
