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

let express;
try {
  express = require('express');
} catch (error) {
  report(error && error.stack ? error.stack : error);
}

if (express) {
  try {
    const fs = require('fs');
    const path = require('path');
    const engine = path.join(__dirname, 'query-engine', 'libquery_engine-rhel-openssl-3.0.x.so.node');
    if (process.platform === 'linux' && !process.env.PRISMA_QUERY_ENGINE_LIBRARY && fs.existsSync(engine)) {
      process.env.PRISMA_QUERY_ENGINE_LIBRARY = engine;
    }
    const loaded = require('./api.cjs');
    const app = loaded && loaded.default ? loaded.default : loaded;
    if (typeof app !== 'function') throw new Error('API export was ' + typeof app);
    module.exports = app;
  } catch (error) {
    report(error && error.stack ? error.stack : error);
  }
}
