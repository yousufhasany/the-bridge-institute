import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { platform } from 'node:os';

/** Point Prisma at the query engine before the generated client loads. */
const engineName =
  platform() === 'win32'
    ? 'query_engine-windows.dll.node'
    : platform() === 'darwin'
      ? 'libquery_engine-darwin-arm64.dylib.node'
      : 'libquery_engine-rhel-openssl-3.0.x.so.node';

const directories = [
  join(process.cwd(), 'generated/prisma'),
  join(process.cwd(), 'backend/generated/prisma'),
];

if (!process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
  for (const directory of directories) {
    const engine = join(directory, engineName);
    if (existsSync(engine)) {
      process.env.PRISMA_QUERY_ENGINE_LIBRARY = engine;
      break;
    }
  }
}
