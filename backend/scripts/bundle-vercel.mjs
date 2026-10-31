import { build } from 'esbuild';

// Vercel runs /var/task/app.js with the CommonJS loader. A bundled .cjs entry
// keeps `import` out of that file so the function can start.
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
