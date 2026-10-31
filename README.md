# The Bridge Institute — Website and Management Platform

Bilingual (English / Bangla) public website, student portal, alumni portal and administration platform for **The Bridge Institute under the University of Integrated Thought (UIT)**. Public content, colours and structure follow the institute brochure (`Brochure.jpeg`, `Brochure1.jpeg`).

| Folder | Contents |
| --- | --- |
| `frontend/` | React 19 + Vite + TypeScript + Tailwind CSS 4 single-page app (public site, portals, admin) |
| `backend/` | Node.js + Express 5 + TypeScript REST API (`/api/v1`) |
| `database/prisma/` | Prisma schema, SQL migrations and the reference-data seed |
| `docs/` | Architecture, database, API, security and deployment guides |
| `scripts/local-db.mjs` | Optional throwaway local PostgreSQL for development and tests |

Further reading: [Architecture](docs/ARCHITECTURE.md) · [Database](docs/DATABASE.md) · [API](docs/API.md) · [Security](docs/SECURITY.md) · [Deployment](docs/DEPLOYMENT.md) · [Database operations](database/README.md)

## Requirements

- Node.js 20.19 or newer (22 LTS recommended) and npm 10+
- PostgreSQL 15+ — a Supabase project in production, or the bundled local server for development

## 1. Install

```bash
npm run install:all
```

This installs the root tools (Prisma CLI, `concurrently`, local PostgreSQL), then `backend/` and `frontend/`. The backend `postinstall` step generates the Prisma client into `backend/generated/prisma`.

## 2. Configure environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env`:

- `DATABASE_URL` / `DIRECT_URL` — see [Database setup](#3-database-setup).
- `SESSION_SECRET` — at least 32 random characters:
  `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- `WEB_ORIGIN` / `APP_URL` — the frontend origin (default `http://localhost:5173`).
- Storage and email are optional. Without them, uploads return `STORAGE_NOT_CONFIGURED` and invitation / password-reset links are shown to administrators (and printed to the dev console) instead of being emailed.

`frontend/.env` holds **public** values only (`VITE_API_BASE_URL`, `VITE_SITE_URL`). Everything prefixed with `VITE_` ends up in the browser bundle, so never put secrets there. Existing `.env` files are never overwritten by any script in this repository.

## 3. Database setup

**Option A — local development database (no Supabase needed)**

```bash
npm run db:local        # keep this terminal open; PostgreSQL 17 on port 5433
```

It creates `bridge_dev` and `bridge_test`. Use in `backend/.env`:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/bridge_dev
DIRECT_URL=postgresql://postgres:postgres@localhost:5433/bridge_dev
```

**Option B — Supabase.** Follow [Supabase configuration](docs/DEPLOYMENT.md#supabase-configuration). Use the pooled connection (port 6543, `?pgbouncer=true`) for `DATABASE_URL` and the direct/session connection (port 5432) for `DIRECT_URL`.

Then apply migrations and seed reference data:

```bash
npm run db:migrate      # development: applies migrations (prisma migrate dev)
npm run db:seed         # roles, permissions, 5 brochure courses, settings, FAQs
```

In staging/production use `npm run db:deploy` instead of `db:migrate`. The seed is idempotent and never overwrites content edited in the admin panel. It does **not** create any user, student, alumni record or testimonial.

## 4. Create the first Super Admin

```bash
npm run admin:create -- --email you@example.org --name "Your Name"
```

On Windows PowerShell, `npm` drops a bare `--` and splits quoted names, so run the script directly from `backend/` instead:

```powershell
npx tsx --env-file-if-exists=.env src/scripts/create-super-admin.ts --email you@example.org --name "Your Name"
```

You are prompted for the password twice (hidden input). For non-interactive environments, set `SUPER_ADMIN_PASSWORD` for that single command only. The password is never accepted as a command-line argument, never logged and never stored in the repository. Further staff accounts are created from **Admin → Users** by invitation; invited users set their own password.

## 5. Run

```bash
npm run dev             # backend (http://localhost:5000) and frontend (http://localhost:5173) together
npm run dev:backend     # API only
npm run dev:frontend    # web app only
```

Health check: `GET http://localhost:5000/api/v1/health`.

## 6. Quality checks

```bash
npm run typecheck       # backend + frontend
npm run lint            # backend + frontend
npm test                # backend (needs the test database) + frontend
npm run build           # compiles backend to backend/dist and frontend to frontend/dist
```

Backend tests run against `TEST_DATABASE_URL` (default `postgresql://postgres:postgres@localhost:5433/bridge_test`, i.e. `npm run db:local`). The test setup refuses any database whose name does not contain `test`; see [database/README.md](database/README.md#test-database).

## Root scripts

| Script | Purpose |
| --- | --- |
| `install:all` | Install root, backend and frontend dependencies |
| `dev`, `dev:backend`, `dev:frontend` | Development servers |
| `db:local` | Start the local development/test PostgreSQL |
| `db:generate` | Regenerate the Prisma client |
| `db:migrate` | Create/apply migrations in development (`prisma migrate dev`) |
| `db:deploy` | Apply committed migrations (staging/production) |
| `db:seed` | Seed reference data (idempotent) |
| `db:studio` | Prisma Studio |
| `admin:create` | Create or reset the first Super Admin securely |
| `typecheck`, `lint`, `test`, `test:backend`, `test:frontend` | Quality checks |
| `build`, `build:backend`, `build:frontend` | Production builds |

## Content that still needs institute confirmation

The site ships with brochure content only. These items are deliberately left empty, hidden or neutral until the institute confirms them (all editable in **Admin → Settings** or **Admin → Website content**):

- Destinations of the four brochure QR codes and the Facebook page URL (QR codes are hidden until a confirmed `https://` link is entered).
- Phone number, office address, admission and partnership email addresses (only the brochure email `thebridgeinstitute2026@gmail.com` is pre-filled).
- Course durations, fees, schedules and certification providers (courses show "To be announced").
- Whether a six-month training programme exists and how it relates to the four-year roadmap (hidden until confirmed).
- Year titles in the roadmap, wording of the final pathway step ("Careers"), eligibility wording, and the course name "Basic Python Programming" (brochure: "Basic Programming").
- Production domain for `frontend/public/sitemap.xml`, `robots.txt` and `VITE_SITE_URL`.
- Privacy policy and terms of use (a neutral baseline text is included; it must be reviewed by the institute, ideally with legal advice, before launch).

The platform never displays invented statistics, testimonials, alumni outcomes, partnerships, accreditation or employment guarantees.
