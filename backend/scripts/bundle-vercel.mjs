import { build } from 'esbuild';

// One CommonJS file with npm dependencies inlined. Vercel’s file tracer was
// leaving cookie-parser (and would leave the next package) out of the function.
// pino is not imported: bundling it looks for thread-stream’s lib/worker.js.
await build({
  entryPoints: ['src/boot.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  outfile: 'src/api.cjs',
  logLevel: 'info',
  footer: {
    js: 'module.exports = module.exports.default ?? module.exports;\n',
  },
});
