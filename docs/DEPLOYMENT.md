# Deployment

The platform deploys as three pieces:

1. **Database** — Supabase PostgreSQL (plus Supabase Storage for files).
2. **API** — the Node.js backend on any host that runs a long-lived Node process (a VM, Render, Railway, Fly.io, a container platform, …).
3. **Web app** — the static frontend build on any static host or CDN with single-page-app fallback (Netlify, Vercel, Cloudflare Pages, Firebase Hosting, Nginx, …).

Recommended domains: `www.<domain>` (frontend) and `api.<domain>` (backend). Being on the same site keeps `SameSite=Lax` cookies working.

## Supabase configuration

1. Create a project in the region closest to users (e.g. Singapore or Mumbai for Bangladesh).
2. **Database → Connect**:
   - *Transaction pooler* (port **6543**) → `DATABASE_URL`, append `?pgbouncer=true&connection_limit=5`.
   - *Session pooler* or *Direct connection* (port **5432**) → `DIRECT_URL` (used only by migrations).
   - URL-encode special characters in the database password.
3. **Storage → New bucket**:
   - `public-media` — **Public** bucket (alumni photos, story and CMS images).
   - `private-files` — **Private** bucket (learning materials). Do not add public policies.
   - The backend uploads with the service-role key, so no anonymous upload policy is needed on either bucket.
4. **Project Settings → API**: copy the project URL to `STORAGE_URL` and the `service_role` key to `STORAGE_SERVICE_KEY` (backend only — never in the frontend).
5. **Database → Backups**: confirm daily backups; enable Point-in-Time Recovery if available.
6. Supabase Auth and the auto-generated Data API are **not** used. In *API settings*, you can remove `public` from exposed schemas so the tables are not reachable through PostgREST; the app connects only through Prisma.

## Backend

Environment variables (see `backend/.env.example`):

| Variable | Production value |
| --- | --- |
| `NODE_ENV` | `production` |
| `PORT` | Port provided by the host (default 5000) |
| `WEB_ORIGIN` | `https://www.<domain>` (comma-separate several origins) |
| `APP_URL` | `https://www.<domain>` (used in emailed links) |
| `DATABASE_URL`, `DIRECT_URL` | From Supabase (above) |
| `SESSION_SECRET` | 48+ random bytes, unique per environment |
| `SESSION_TTL_HOURS` | `72` (or shorter) |
| `COOKIE_SAMESITE` | `lax` for same-site domains; `none` only for cross-site (HTTPS required) |
| `TRUST_PROXY` | Number of proxies/load balancers in front of the API (usually `1`) |
| `STORAGE_URL`, `STORAGE_SERVICE_KEY`, `STORAGE_PUBLIC_BUCKET`, `STORAGE_PRIVATE_BUCKET` | Supabase Storage |
| `EMAIL_PROVIDER_API_KEY`, `EMAIL_FROM` | Resend API key and a verified sender, e.g. `The Bridge Institute <no-reply@<domain>>` |
| `LOG_LEVEL` | `info` |

Build and start:

```bash
npm ci --prefix backend          # postinstall generates the Prisma client
npm run build --prefix backend   # outputs backend/dist
npm run start --prefix backend   # node dist/server.js
```

The Prisma schema is in `database/prisma`, so deploy the whole repository (not only `backend/`). Use `GET /api/v1/health` as the health check; it returns 503 if the database is unreachable.

## Database migrations

Run migrations as a separate, manual (or explicitly approved CI) step before starting a new backend version:

```bash
# 1. Back up first (see database/README.md)
pg_dump "$DIRECT_URL" --format=custom --no-owner --file=pre-deploy.dump
# 2. Apply committed migrations only
npm run db:deploy
# 3. First deployment only: reference data and the first administrator
npm run db:seed
npm run admin:create -- --email admin@<domain> --name "Full Name"
```

`db:deploy` never resets data. Do not run `db:migrate` (`prisma migrate dev`), `migrate reset` or `db push` against production, and do not run migrations automatically on application start.

## Frontend

Environment (build time, public values only):

```
VITE_API_BASE_URL=https://api.<domain>/api/v1
VITE_SITE_URL=https://www.<domain>
```

Build:

```bash
npm ci --prefix frontend
npm run build --prefix frontend   # outputs frontend/dist
```

Host `frontend/dist` with a fallback of every unknown path to `index.html` (single-page app). The repository root `vercel.json` already does this for Vercel. Other hosts:

- **Netlify**: `_redirects` → `/*  /index.html  200`
- **Firebase Hosting**: `"rewrites": [{ "source": "**", "destination": "/index.html" }]`
- **Nginx**: `try_files $uri /index.html;`

### Vercel (frontend only)

Import the GitHub repository in Vercel and leave the root directory as the repository root. `vercel.json` installs and builds only `frontend/`, publishes `frontend/dist`, and rewrites unknown paths to `index.html`.

In **Project → Settings → Environment Variables**, set these public build values and nothing else:

| Name | Example |
| --- | --- |
| `VITE_API_BASE_URL` | `https://api.<domain>/api/v1` |
| `VITE_SITE_URL` | `https://www.<domain>` |

The Vercel build fails if `VITE_API_BASE_URL` is missing, so a deploy cannot silently call `localhost`. Do **not** add `DATABASE_URL`, `DIRECT_URL`, `SESSION_SECRET`, `STORAGE_SERVICE_KEY`, or `EMAIL_PROVIDER_API_KEY` to Vercel. Those belong only on the API host. `VITE_` variables are embedded in the browser bundle.

Use one site for the pages (`www.<domain>`) and the API (`api.<domain>`) so session cookies keep working with `COOKIE_SAMESITE=lax`. A `*.vercel.app` address and an API on a different site are cross-site; sign-in cookies will not be stored unless `COOKIE_SAMESITE=none` and both sides use HTTPS.

The Express API is a long-lived Node process. Deploy it with the backend steps above (Render, Railway, Fly.io, or a VM), not as this Vercel project. Point `WEB_ORIGIN` and `APP_URL` at the Vercel domain, including the `https://<project>.vercel.app` preview origin only if you intentionally want that host to call the API.

Cache `assets/*` (hashed file names) for a long time and `index.html` for a short time.

Before the first production build, replace `https://example.org` with the real domain in `frontend/public/sitemap.xml` and on the `Sitemap:` line of `frontend/public/robots.txt`.

Recommended security headers on the static host:

```
Content-Security-Policy: default-src 'self'; img-src 'self' data: https://<project>.supabase.co; connect-src 'self' https://api.<domain>; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Post-deployment checks

- [ ] `https://api.<domain>/api/v1/health` returns `{"status":"ok","database":"ok"}`.
- [ ] The home page loads in English and Bangla; language choice persists.
- [ ] Sign in as the Super Admin; the admin dashboard loads.
- [ ] Submit a test application, contact message and partnership inquiry; they appear in the admin panel. Delete the test records afterwards.
- [ ] Invite a staff user; the email arrives and the link sets a password.
- [ ] Upload an image (if storage is configured).
- [ ] Enter the confirmed contact details, QR destinations and social links in **Admin → Settings**.
- [ ] Review all content listed under "Content that still needs institute confirmation" in the README.

## Rollback

- Frontend: redeploy the previous build.
- Backend: redeploy the previous version. Migrations are forward-only; if a migration must be undone, write a new corrective migration or restore the pre-deployment backup into a new database after assessing data written since.
