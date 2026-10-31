# Database operations

Schema, migrations and seed for The Bridge Institute. See [docs/DATABASE.md](../docs/DATABASE.md) for the data model.

```
database/prisma/
├── schema.prisma          # single source of truth for the schema
├── migrations/            # committed SQL migrations (apply in order)
│   └── 20261026104641_init/migration.sql
└── seed.ts                # idempotent reference data
```

All commands run from the repository root and read `backend/.env`.

## Connection strings

| Variable | Used by | Supabase value |
| --- | --- | --- |
| `DATABASE_URL` | Application runtime | Pooled connection (Supavisor, transaction mode, port **6543**) with `?pgbouncer=true&connection_limit=5` |
| `DIRECT_URL` | Prisma Migrate | Direct or session-mode connection (port **5432**) |

Local development (`npm run db:local`): both are `postgresql://postgres:postgres@localhost:5433/bridge_dev`.

## Everyday commands

| Command | When |
| --- | --- |
| `npm run db:generate` | After changing `schema.prisma` or after a fresh clone |
| `npm run db:migrate` | **Development only.** Creates a new migration from schema changes and applies it |
| `npm run db:deploy` | Staging/production. Applies committed migrations; never generates or resets |
| `npm run db:seed` | Seed or top up reference data (safe to re-run) |
| `npm run db:studio` | Inspect data locally |

### Changing the schema

1. Edit `schema.prisma`.
2. `npm run db:migrate -- --name short_description` against a development database.
3. Review the generated SQL in `migrations/<timestamp>_short_description/migration.sql`. Make destructive changes (dropping or renaming columns) in two steps with a data migration in between.
4. Commit the schema and migration together.
5. Deploy with `npm run db:deploy` (see [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md)).

### Never do automatically

- Do not run `prisma migrate reset`, `prisma db push --force-reset` or drop tables against shared, staging or production databases. Reset only your own local database, manually, after confirming the target.
- Do not run `db:migrate` (`migrate dev`) against production; it may prompt to reset.
- Do not point the seed or tests at production.

## Test database

Backend tests (`npm run test:backend`) use `TEST_DATABASE_URL`, defaulting to `postgresql://postgres:postgres@localhost:5433/bridge_test` (created by `npm run db:local`).

Before the suite runs, `backend/tests/globalSetup.ts`:

1. Refuses to continue unless the database name contains `test`.
2. Applies migrations with `prisma migrate deploy`.
3. Empties all application tables with `TRUNCATE … CASCADE` (the migrations table is kept).
4. Seeds reference data.

To use another server, create a dedicated database whose name contains `test` and set `TEST_DATABASE_URL` before running the tests.

## First Super Admin

```bash
npm run admin:create -- --email you@example.org --name "Your Name"
```

On Windows PowerShell, run `npx tsx --env-file-if-exists=.env src/scripts/create-super-admin.ts --email ... --name "..."` from `backend/` instead (PowerShell's `npm` shim drops `--` and splits quoted names).

Requires the seed to have run (it needs the `SUPER_ADMIN` role). The password is entered at a hidden prompt (or via `SUPER_ADMIN_PASSWORD` for that one command). Re-running for the same email resets that account's password and reactivates it.

## Backups and restore

- **Supabase**: enable daily backups (and Point-in-Time Recovery on paid plans) under *Database → Backups*. Test a restore into a separate project before launch.
- **Logical backup** (any PostgreSQL), using the direct connection:

  ```bash
  pg_dump "$DIRECT_URL" --format=custom --no-owner --file=bridge-$(date +%F).dump
  ```

- **Restore** into an empty database:

  ```bash
  pg_restore --no-owner --dbname "$TARGET_DIRECT_URL" bridge-YYYY-MM-DD.dump
  ```

- Take a backup immediately before every production migration. Store dumps encrypted; they contain personal data.
- Files in Supabase Storage are not included in database backups; back up buckets separately.
