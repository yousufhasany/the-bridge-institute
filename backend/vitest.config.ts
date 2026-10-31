import { defineConfig } from 'vitest/config';

const testDatabaseUrl = process.env.TEST_DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5433/bridge_test';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    globalSetup: ['tests/globalSetup.ts'],
    // All suites share one database, so files run one after another.
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 120_000,
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: testDatabaseUrl,
      DIRECT_URL: testDatabaseUrl,
      SESSION_SECRET: 'test-only-secret-value-that-is-long-enough-1234567890',
      WEB_ORIGIN: 'http://localhost:5173',
      APP_URL: 'http://localhost:5173',
      LOG_LEVEL: 'silent',
      STORAGE_URL: '',
      STORAGE_SERVICE_KEY: '',
      EMAIL_PROVIDER_API_KEY: '',
    },
  },
});
