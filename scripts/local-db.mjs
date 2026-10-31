// Starts a throwaway local PostgreSQL 17 server for development and automated tests
// when a Supabase project is not available. Not for production use.
import EmbeddedPostgres from 'embedded-postgres';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const port = Number(process.env.LOCAL_DB_PORT ?? 5433);
const dataDir = resolve(process.cwd(), '.local-db', 'data');
const databases = ['bridge_dev', 'bridge_test'];

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: 'postgres',
  password: 'postgres',
  port,
  persistent: true,
  initdbFlags: ['--encoding=UTF8', '--locale=C'],
});

const isNew = !existsSync(dataDir);
if (isNew) {
  console.log(`[local-db] Initialising cluster in ${dataDir}`);
  await pg.initialise();
}
await pg.start();

for (const name of databases) {
  try {
    await pg.createDatabase(name);
    console.log(`[local-db] Created database ${name}`);
  } catch {
    // already exists
  }
}

console.log(`[local-db] PostgreSQL running on port ${port}`);
console.log(`[local-db] Dev:  postgresql://postgres:postgres@localhost:${port}/bridge_dev`);
console.log(`[local-db] Test: postgresql://postgres:postgres@localhost:${port}/bridge_test`);
console.log('[local-db] Press Ctrl+C to stop.');

const stop = async () => {
  console.log('\n[local-db] Stopping...');
  await pg.stop();
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
setInterval(() => {}, 1 << 30);
