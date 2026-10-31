# Security

This document describes the controls that are implemented and the responsibilities that remain with whoever operates the platform.

## Secrets and configuration

- All secrets live in `backend/.env` (or the hosting provider's secret store): database URLs, `SESSION_SECRET`, `STORAGE_SERVICE_KEY`, `EMAIL_PROVIDER_API_KEY`.
- The frontend only receives `VITE_API_BASE_URL` and `VITE_SITE_URL`. Anything prefixed `VITE_` is public; never put a secret there.
- `.env` files are git-ignored; only `.env.example` templates (with placeholders) are committed. Scripts never overwrite an existing `.env`.
- The backend validates its environment at start-up and refuses to run with a missing or short `SESSION_SECRET` (minimum 32 characters).
- The Supabase service-role key is only used server-side for Storage; the browser never talks to Supabase directly.

## Authentication

- Passwords: bcrypt, cost 12; length 10–128. Login compares against a dummy hash when the account does not exist, so response time does not reveal registered emails. Forgot-password always returns the same response.
- Sessions: random 32-byte token in an `HttpOnly` cookie (`bi_session`), `Secure` in production, `SameSite` from `COOKIE_SAMESITE` (default `lax`). Only an HMAC-SHA256 hash of the token is stored. Sessions expire after `SESSION_TTL_HOURS` (default 72) and are rejected for deactivated users.
- Password change signs out other devices. Deactivating a user or **Sign out everywhere** revokes all sessions.
- Password reset links are single-use and expire after 1 hour; invitation links after 72 hours. Tokens are stored hashed.
- No default or seeded passwords exist. The first Super Admin is created with `npm run admin:create`, which reads the password from a hidden prompt (or a one-off environment variable), never from command-line arguments.

## Authorisation

- Role-based permissions are checked on the server for every protected route (`requirePermission`). Frontend guards only hide UI.
- Public registration creates an account with **no roles**. The request body cannot choose roles; Student and Alumni roles are only granted by staff workflows (onboarding an accepted application, verifying an alumni request).
- Only a Super Admin can grant or remove the Super Admin role or modify a Super Admin; nobody can deactivate themselves or remove their own Super Admin role. Super Admin permissions cannot be edited.
- Teachers only see and edit batches they are assigned to.
- Resource ownership is enforced for self-service endpoints (`/students/me`, `/alumni/me`, own stories, own uploads).
- The admin dashboard only returns applicant names to users with `applications.manage`.

## Request protection

- **CSRF**: double-submit token (`GET /auth/csrf` → `bi_csrf` HttpOnly cookie + `X-CSRF-Token` header, compared in constant time) on every state-changing request, plus an `Origin` allow-list (`WEB_ORIGIN`).
- **CORS**: credentials allowed only for origins in `WEB_ORIGIN`.
- **Rate limiting** per IP: 600 requests / 15 min for the API, 20 / 15 min for login, registration and password endpoints, 10 / 10 min for public forms. Behind a proxy set `TRUST_PROXY` so limits apply to the real client IP.
- **Validation**: every body and query is parsed with Zod; unknown fields are dropped (no mass assignment); list sorting uses per-resource allow-lists; JSON bodies are limited to 200 KB and CMS sections to 64 KB.
- **Headers**: Helmet with a `default-src 'none'` CSP on the API, `X-Powered-By` disabled.
- **Errors**: clients receive a code, message and request id; stack traces and internal messages are never returned in production.

## Files

- Uploads go through the backend only: max 5 MB, one file per request, type detected from the file's magic bytes (JPEG, PNG, WebP; PDF for learning materials). File names are sanitised and stored under random object keys.
- Permissions per purpose: alumni photos and story images (alumni.self / alumni.manage), CMS images (cms.edit), learning materials (courses.manage).
- Learning materials are stored in the **private** bucket and served through 5-minute signed URLs after an access check. Images are stored in the **public** bucket under unguessable keys; an alumni photo URL is only exposed through the API once the profile is public.
- If storage is not configured, uploads fail with `STORAGE_NOT_CONFIGURED`; nothing is written to local disk.

## Privacy

- Forms that collect personal data require explicit consent, and the consent time is stored.
- Public alumni profiles require verification, explicit consent recorded by the alumnus, and administrator approval. Public responses use a strict field whitelist; contact email and phone are never public. Edits to a published profile are held for review, and an alumnus can withdraw visibility at any time.
- Internal application notes are never returned to applicants.
- QR codes and social links are only rendered for confirmed `http(s)` URLs entered by an administrator.

## Logging and audit

- Structured logs (pino) with request ids. `Authorization`, cookies, CSRF headers, `Set-Cookie`, and any `password`, `token` or `passwordHash` fields are redacted. Request bodies are not logged.
- In development without an email provider, invitation and reset messages are printed to the console so flows can be tested. In production they are never logged.
- `AuditLog` records sign-ins, password changes and resets, user and role changes, application decisions, onboarding, training changes, certificates, CMS publishing, settings changes, alumni verification and publication decisions, uploads and deletions.

## Operator checklist before launch

- [ ] Generate a unique `SESSION_SECRET` per environment and store it in the host's secret manager.
- [ ] Serve frontend and API over HTTPS only. Prefer same-site hosting (e.g. `www.example.org` and `api.example.org`) with `COOKIE_SAMESITE=lax`; use `none` only if the API is on a different site, and then HTTPS is mandatory.
- [ ] Set `WEB_ORIGIN` to the exact production origin(s) and `TRUST_PROXY` to the number of proxies in front of the API.
- [ ] Use a database role with least privilege for the app, enable Supabase backups, and restrict database network access where possible.
- [ ] Keep the private bucket private (no public policy). Do not grant anonymous write access to any bucket.
- [ ] Configure email (SPF/DKIM for the sending domain) so invitations are not shared manually.
- [ ] Create the Super Admin, then invite other staff with the least-privileged roles they need.
- [ ] Review the privacy policy and terms text with the institute (and legal advice where appropriate).
- [ ] Run `npm audit` for both packages and keep dependencies updated.

## Known limitations

- There is no account lockout beyond rate limiting and no multi-factor authentication yet. Consider adding MFA for administrators.
- Images in the public bucket are reachable by anyone who has the exact URL. Do not upload sensitive documents as images.
- Malware scanning of uploads is not performed; only file type and size are enforced.

## Reporting a vulnerability

Report suspected vulnerabilities privately to the institute's technical contact (to be confirmed by the institute) rather than in a public issue tracker.
