import { build } from 'esbuild';

// Vercel loads /var/task/app.js with the CommonJS loader, which rejects `import`.
// A .mjs entry is always an ES module, so the function can start.
await build({
  entryPoints: ['src/server.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  outfile: 'app.mjs',
  packages: 'external',
  logLevel: 'info',
  banner: {
    js: "import { createRequire } from 'node:module';\nimport { dirname } from 'node:path';\nimport { fileURLToPath } from 'node:url';\nconst require = createRequire(import.meta.url);\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = dirname(__filename);\n",
  },
});
