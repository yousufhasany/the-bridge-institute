import { build } from 'esbuild';

// Vercel loads the entry with the CommonJS loader. The small app.cjs wrapper
// requires this bundle and turns a startup crash into a JSON response.
await build({
  entryPoints: ['src/server.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  outfile: 'api.cjs',
  packages: 'external',
  logLevel: 'info',
  footer: {
    js: 'module.exports = module.exports.default ?? module.exports;\n',
  },
});
