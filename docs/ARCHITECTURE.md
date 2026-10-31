# Architecture

## Overview

```
Browser ──► frontend (static SPA: React, Vite build)
   │
   └─ fetch, credentials: include ──► backend (Express 5, /api/v1) ──► PostgreSQL (Supabase)
                                         │
                                         ├─► Supabase Storage REST (optional, server-side key)
                                         └─► Resend email API (optional)
```

- The frontend is a static single-page app. It never talks to the database or to Supabase directly and holds no secrets.
- The backend is the only component with database, storage and email credentials. Every request is authorised on the server.
- There is one database and one user table. Students, alumni and staff are the same `User` record with different roles; alumni is not a separate application or database.

## Backend (`backend/src`)

| Path | Responsibility |
| --- | --- |
| `server.ts` | Starts HTTP server, graceful shutdown |
| `app.ts` | Middleware chain: request id → pino-http → helmet → CORS → body limits → cookies → rate limit → session → CSRF → routes → 404 → error handler |
| `config/env.ts` | Zod-validated environment; the process exits on invalid configuration |
| `config/permissions.ts` | Permission keys (`P.*`) |
| `middleware/` | `auth` (session loading, `requireAuth`, `requirePermission`), `csrf`, `rateLimit`, `errorHandler`, `requestId` |
| `routes/` | Route groups mounted in `routes/index.ts` |
| `controllers/` | Request handlers. `crud.factory.ts` provides list/get/create/update/delete for simple resources |
| `services/` | Auth/sessions, users and invitations, audit log, storage, email, course/alumni shaping |
| `validators/` | Zod schemas for every request body and query |
| `utils/http.ts` | Response envelope, `ApiError`, pagination, sorting whitelist |
| `scripts/create-super-admin.ts` | Secure Super Admin bootstrap |

Conventions:

- Responses are `{ "data": ..., "meta"?: { page, pageSize, total, totalPages } }`. Errors are `{ "error": { code, message, details?, requestId } }`.
- Validation failures return `422 VALIDATION_ERROR` with `details: [{ path, code, message }]`.
- Only fields declared in Zod schemas are written (no mass assignment); list sorting is restricted to a whitelist per resource.
- Important actions are recorded through `services/audit.service.ts`.

## Frontend (`frontend/src`)

| Path | Responsibility |
| --- | --- |
| `App.tsx` | Route table; pages are lazy-loaded; admin routes are wrapped in permission guards |
| `layouts/` | Public layout (header/footer), portal layout (student/alumni), admin layout (sidebar filtered by permission), route guards |
| `pages/public`, `pages/auth`, `pages/student`, `pages/alumni`, `pages/admin` | Screens |
| `components/` | Design system (buttons, sections, forms, modal, table, badges, QR links, logo) |
| `features/` | Domain hooks: auth context, CMS content, courses, alumni, admin lists and lookups |
| `lib/api.ts` | Fetch wrapper: base URL, cookies, CSRF token handling, typed errors |
| `lib/i18n.ts`, `locales/{en,bn}/*.json` | i18next with namespaces `common`, `home`, `pages`, `alumni`, `portal`, `admin` |

State and data:

- Server state lives in TanStack Query. Forms use React Hook Form with Zod schemas; server validation errors are mapped back onto fields.
- The selected language is stored in `localStorage` (`bi-language`) and sets `<html lang>`.
- Design tokens (navy, royal blue, light blue, pale grey, orange, body text) are defined with Tailwind 4 `@theme` in `index.css`, taken from the brochure.

## Content management model

1. **Default content** for every public section is in the locale files (`locales/en/home.json`, `pages.json`, …). This is the brochure-based text and works with an empty database.
2. **Overrides** are stored per section and language in `WebsiteSection` (`draftContent`, `publishedContent`). Only fields that differ from the default are saved.
3. `GET /cms/sections?locale=` returns published overrides; `useSection(key)` merges non-empty override fields over the defaults.
4. Editors save drafts (`cms.edit`); publishers publish or revert to default (`cms.publish`). Item counts (roadmap years, pathway steps, features) are fixed so the brochure structure, including the four-year roadmap, cannot be broken accidentally.
5. **Settings** (`WebsiteSetting`) hold contact details, social links, QR destinations, SEO defaults and the optional six-month programme flag. Public settings are served from `GET /settings/public`; empty values are hidden on the site.
6. Courses, FAQs, opportunities, cohorts, announcements and alumni stories are database records with their own draft/published states.

## Roles and access

Permissions are attached to roles; a user's effective permissions are the union of their roles. Defaults (seeded once; editable in **Admin → Roles**):

| Role | Permissions |
| --- | --- |
| Super Admin | every administrative permission (fixed) |
| Content Manager | dashboard.view, cms.edit, cms.publish, faqs.manage |
| Course Manager | dashboard.view, courses.manage |
| Admissions Officer | dashboard.view, applications.manage, students.manage, contact.manage |
| Company Relations Manager | dashboard.view, companies.manage, contact.manage |
| Teacher | dashboard.view, training.teach (assigned batches only) |
| Student | student.self |
| Alumni | alumni.self |

Public sign-up creates an account with **no** role. Student status is granted when admissions onboard an accepted application; Alumni status is granted when an administrator verifies an alumni registration request.

## Main workflows

- **Admission**: public application (idempotency key, duplicate protection, reference code) → review with status history and private notes → onboard accepted applicant (creates `StudentProfile` + invitation) → enrol in a batch.
- **Training**: batches with assigned teachers → enrollments → attendance → assessments and results → certificates prepared, approved and issued manually (never automatic).
- **Alumni**: registration request → manual verification (with automatic student-record matching as a hint) → private profile → explicit public-visibility consent → administrator publication approval; later edits to a published profile are held for review. Stories are submitted, reviewed, then published.
- **Industry**: partnership inquiry form → inquiry review and interaction log → optional company record (a company record does not mean a confirmed partnership).
