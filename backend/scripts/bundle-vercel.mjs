import { build } from 'esbuild';

// Vercel loads the API file with the CommonJS loader. A .cjs bundle keeps
// `import` out of that file, and Node still treats .cjs as CommonJS.
await build({
  entryPoints: ['src/server.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  outfile: 'app.cjs',
  packages: 'external',
  logLevel: 'info',
  footer: {
    js: 'module.exports = module.exports.default ?? module.exports;\n',
  },
});
