import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __ON_VERCEL__: JSON.stringify(process.env.VERCEL === '1'),
  },
  server: { port: 5173, strictPort: true },
  preview: { port: 4173 },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/](react|react-dom|react-router|scheduler)[\\/]/.test(id)) return 'react';
          if (/[\\/](i18next|react-i18next)[\\/]/.test(id)) return 'i18n';
          return undefined;
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    css: false,
  },
});
