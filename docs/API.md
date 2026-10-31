# API reference

Base URL: `/api/v1` (e.g. `http://localhost:5000/api/v1`). JSON in, JSON out.

## Conventions

**Responses**

```json
{ "data": { }, "meta": { "page": 1, "pageSize": 20, "total": 42, "totalPages": 3 } }
```

`meta` is present on paginated lists. Errors:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Validation failed", "details": [{ "path": "email", "code": "invalid_format", "message": "Invalid email address" }], "requestId": "…" } }
```

| Status | Typical codes |
| --- | --- |
| 400 | `BAD_REQUEST` |
| 401 | `UNAUTHENTICATED` |
| 403 | `FORBIDDEN`, `CSRF_INVALID`, `CSRF_ORIGIN` |
| 404 | `NOT_FOUND` |
| 409 | `CONFLICT`, `DUPLICATE`, `DUPLICATE_APPLICATION`, `EMAIL_IN_USE`, `IN_USE` |
| 413 | `PAYLOAD_TOO_LARGE` |
| 422 | `VALIDATION_ERROR` (with `details`) |
| 429 | `RATE_LIMITED` |
| 503 | `STORAGE_NOT_CONFIGURED`, `STORAGE_ERROR` |

**Lists** accept `page`, `pageSize` (max 100), `q` (search), `sort` (whitelisted field), `order` (`asc`/`desc`) plus resource filters.

**Authentication** uses an HTTP-only session cookie (`bi_session`). Browsers must send `credentials: 'include'`.

**CSRF**: every `POST`, `PUT`, `PATCH` and `DELETE` must include the header `X-CSRF-Token` with the value from `GET /auth/csrf` (double-submit cookie). Requests from origins not listed in `WEB_ORIGIN` are rejected.

**Rate limits** (per IP): whole API 600 requests / 15 min; login, registration and password endpoints 20 / 15 min; public forms 10 / 10 min.

Legend: 🌐 public · 🔑 signed in · 🛡 permission required (shown).

## Health

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| GET | `/health` | 🌐 | `{ status, database }`; 503 when the database is unreachable |

## Authentication — `/auth`

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| GET | `/auth/csrf` | 🌐 | Issues the CSRF cookie and returns `{ csrfToken }` |
| GET | `/auth/me` | 🌐 | Current user with roles, permissions, student/alumni summary, or `null` |
| PATCH | `/auth/me` | 🔑 | Update `fullName`, `phone`, `preferredLocale` |
| POST | `/auth/login` | 🌐 | `{ email, password }` → sets session cookie |
| POST | `/auth/logout` | 🌐 | Revokes the current session |
| POST | `/auth/register` | 🌐 | `{ fullName, email, password, phone?, preferredLocale? }` → account **without roles** |
| POST | `/auth/forgot-password` | 🌐 | `{ email }`; always responds the same way (no account enumeration) |
| POST | `/auth/reset-password` | 🌐 | `{ token, password }`; also used to accept invitations |
| POST | `/auth/change-password` | 🔑 | `{ currentPassword, newPassword }`; signs out other devices |

## Courses

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| GET | `/courses?locale=en\|bn` | 🌐 | Published courses (falls back to English text when Bangla is missing) |
| GET | `/courses/:slug?locale=` | 🌐 | Published course with topics and outcomes |
| GET | `/courses/admin` | 🛡 courses.manage | All courses with both languages; filter `status` |
| POST | `/courses/admin` | 🛡 courses.manage | Create (`slug?`, `icon`, `categoryId?`, `sortOrder`, `translations.{en,bn?}`, `topics[]`, `outcomes[]`) |
| GET / PUT | `/courses/admin/:id` | 🛡 courses.manage | Read / update |
| POST | `/courses/admin/:id/status` | 🛡 courses.manage | `{ status: DRAFT\|PUBLISHED\|ARCHIVED }` (English required to publish) |
| POST | `/courses/admin/reorder` | 🛡 courses.manage | `{ ids: [...] }` |
| DELETE | `/courses/admin/:id` | 🛡 courses.manage | Only unused drafts; otherwise archive |
| CRUD | `/course-categories` | 🛡 courses.manage | Categories |
| CRUD | `/learning-materials` | 🛡 courses.manage | Materials; filter `courseId` |

CRUD = `GET /`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`.

## Admissions and students

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| POST | `/applications` | 🌐 | Submit (see body below). Returns `{ referenceCode }`; replays return 200 with the same reference |
| GET | `/applications/mine` | 🔑 | The signed-in user's applications (no internal notes) |
| GET | `/applications` | 🛡 applications.manage | List; filter `status` |
| GET | `/applications/:id` | 🛡 applications.manage | Detail with status history and internal notes |
| PATCH | `/applications/:id/status` | 🛡 applications.manage | `{ status, note? }` (history recorded) |
| POST | `/applications/:id/notes` | 🛡 applications.manage | `{ body }` private note |
| POST | `/applications/:id/onboard` | 🛡 applications.manage | Accepted → student record, STUDENT role, invitation `{ studentCode, emailSent, inviteUrl }` |
| GET / PATCH | `/students/me` | 🔑 | Own student record, enrollments, attendance summary, results, issued certificates |
| GET | `/students`, `/students/:id` | 🛡 students.manage or training.manage | List / detail |
| PATCH | `/students/:id` | 🛡 students.manage | Update status and education fields |

Application body:

```json
{
  "fullName": "…", "email": "…", "phone": "+880 …",
  "currentStatus": "graduate_seeking_employment | hsc_qualified | student | employed | other",
  "highestEducation": "…", "areaOfInterest": "critical-thinking",
  "motivation": "at least 20 characters", "preferredContact": "email | phone | either",
  "locale": "en", "privacyConsent": true, "idempotencyKey": "uuid"
}
```

A second submission from the same email for the same area of interest within 24 hours, while the first is still submitted or under review, returns `409 DUPLICATE_APPLICATION`. Retrying with the same `idempotencyKey` returns the original reference instead.

## Training

`training.manage` sees everything; `training.teach` is limited to batches the teacher is assigned to.

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| GET | `/batches/teachers` | 🛡 training.manage | Active users with the Teacher role |
| GET | `/batches`, `/batches/:id` | 🛡 manage or teach | Batches |
| POST / PATCH / DELETE | `/batches[/:id]` | 🛡 training.manage | Manage batches |
| PUT | `/batches/:id/teachers` | 🛡 training.manage | `{ userIds: [] }` |
| GET | `/enrollments?batchId=` | 🛡 manage or teach | Enrollments |
| POST | `/enrollments` | 🛡 training.manage | `{ batchId, studentId }` |
| PATCH | `/enrollments/:id` | 🛡 manage or teach | Status, progress |
| GET / PUT | `/attendance?batchId=&date=` | 🛡 manage or teach | Read / save `{ batchId, date, records: [{ enrollmentId, status, note? }] }` |
| GET / POST / PATCH / DELETE | `/assessments[/:id]` | 🛡 manage or teach | Assessments; filter `batchId` |
| GET / PUT | `/results?assessmentId=` | 🛡 manage or teach | Read / save `{ assessmentId, records: [{ enrollmentId, score, feedback? }] }` |
| GET / POST | `/certificates` | 🛡 certificates.manage | List / prepare for a completed enrollment |
| POST | `/certificates/:id/approve`, `/issue`, `/revoke` | 🛡 certificates.manage | Manual lifecycle |

## Industry, opportunities and contact

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| POST | `/partnership-inquiries` | 🌐 | `{ organizationName, contactName, workEmail, phone?, website?, interest, message, consent: true }` |
| GET | `/partnership-inquiries`, `/:id` | 🛡 companies.manage | List (filter `status`) / detail with interactions |
| PATCH | `/partnership-inquiries/:id` | 🛡 companies.manage | `{ status?, companyId? }` |
| POST | `/partnership-inquiries/:id/interactions` | 🛡 companies.manage | `{ type: note\|call\|email\|meeting, note }` |
| POST | `/partnership-inquiries/:id/convert` | 🛡 companies.manage | Create a `PROSPECT` company record |
| CRUD | `/companies` | 🛡 companies.manage | Company records; filter `status` |
| GET | `/opportunities/available` | 🔑 | Published opportunities for the user's audience (students/alumni) |
| CRUD | `/opportunities` | 🛡 companies.manage | Filters `status`, `audience` |
| POST | `/contact` | 🌐 | `{ name, email, subject, message, category: general\|admission\|partnership }` |
| GET | `/contact` | 🛡 contact.manage | Filters `isRead`, `category` |
| PATCH / DELETE | `/contact/:id` | 🛡 contact.manage | `{ isRead }` / delete |

## Alumni — `/alumni`

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| GET | `/alumni/directory` | 🌐 | Public profiles only; `page`, `pageSize` (max 48), filters `q`, `year`, `cohort`, `course`, `field` |
| GET | `/alumni/directory/filters` | 🌐 | Available filter values |
| GET | `/alumni/directory/:slug` | 🌐 | Public profile (whitelisted fields) and published stories |
| GET | `/alumni/stories`, `/alumni/stories/:slug` | 🌐 | Published stories |
| GET | `/alumni/registration-options` | 🌐 | Cohorts and courses for the join form |
| POST | `/alumni/register` | 🌐 / 🔑 | Registration request. Guests also create an account (`password` required); signed-in users submit for themselves |
| GET | `/alumni/me` | 🔑 | Own profile (if any) and own requests |
| PATCH | `/alumni/me` | 🛡 alumni.self | Update own profile; edits to a published profile are held for review |
| PUT | `/alumni/me/visibility` | 🛡 alumni.self | `{ isPublic: true, consent: true }` requests publication with recorded consent; `{ isPublic: false }` withdraws it and hides the profile |
| GET / POST | `/alumni/me/stories` | 🛡 alumni.self | Own stories / submit |
| PUT | `/alumni/me/stories/:id` | 🛡 alumni.self | Edit while not published |
| GET | `/alumni/announcements` | 🛡 alumni.self | Published announcements |
| POST | `/alumni/me/assistance` | 🛡 alumni.self | Request help (stored as a contact message) |

## Alumni administration — `/admin/alumni` (🛡 alumni.manage)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/overview` | Counts for the alumni dashboard |
| GET | `/registrations`, `/registrations/:id` | Requests (filter `status`) with matched student hint |
| POST | `/registrations/:id/approve`, `/reject` | `{ note? }`. Approve creates a private profile and grants ALUMNI |
| GET / PATCH | `/profiles`, `/profiles/:id` | Filters `verificationStatus`, `publicationStatus`, `archived`; admin fields `displayName`, `cohortId`, `courseId`, `graduationYear`, `programName` |
| POST | `/profiles/:id/publication/approve`, `/reject` | Requires verification and recorded consent; applies held changes |
| POST | `/profiles/:id/archive`, `/unarchive` | Hide/restore without deleting |
| GET / PATCH | `/stories`, `/stories/:id` | Filter `status`; edit text |
| POST | `/stories/:id/publish`, `/reject`, `/archive` | `{ note? }` |
| CRUD | `/cohorts` | Cohorts |
| CRUD | `/announcements` | Announcements; filter `status` |

## Website content, FAQs, settings and media

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| GET | `/cms/sections?locale=` | 🌐 | Published section overrides keyed by section |
| GET | `/cms/admin/sections` | 🛡 cms.edit | Drafts and published content for every section/language |
| PUT | `/cms/admin/sections/:key/:locale` | 🛡 cms.edit | `{ content }` save draft (max 64 KB) |
| POST | `/cms/admin/sections/:key/:locale/publish` | 🛡 cms.publish | Publish the draft |
| POST | `/cms/admin/sections/:key/:locale/unpublish` | 🛡 cms.publish | Revert the live site to default text |
| GET | `/faqs?locale=` | 🌐 | Published FAQs |
| CRUD | `/faqs/admin` | 🛡 faqs.manage | Manage FAQs |
| GET | `/settings/public` | 🌐 | Public settings as `{ key: value }` |
| GET | `/settings` | 🛡 settings.manage | All settings |
| PUT | `/settings/:key` | 🛡 settings.manage | `{ value }`, validated per key (emails, `https://` URLs, SEO object, programme object) |
| POST | `/media` | 🔑 + purpose permission | Multipart `file` + `purpose` (`alumni-photo`, `story-image`, `cms-image`, `learning-material`); max 5 MB; JPEG/PNG/WebP (and PDF for materials) detected by content |
| GET | `/media/:id/url` | 🔑 | Public URL, or a 5-minute signed URL for private files the user may access |

## Administration

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| GET | `/admin/dashboard` | 🛡 dashboard.view | Counts for the sections the user can manage; recent applications only with applications.manage |
| GET | `/users`, `/users/:id` | 🛡 users.manage | Filters `role`, `isActive` |
| POST | `/users` | 🛡 users.manage | `{ fullName, email, phone?, roleKeys[] }` → invitation `{ emailSent, inviteUrl }` (`inviteUrl` only when email is not configured) |
| PATCH | `/users/:id` | 🛡 users.manage | `fullName`, `phone`, `isActive`, `roleKeys`. Only a Super Admin can grant/remove Super Admin |
| POST | `/users/:id/revoke-sessions` | 🛡 users.manage | Sign out everywhere |
| POST | `/users/:id/invite` | 🛡 users.manage | New password-setup link |
| GET | `/roles` | 🛡 roles.manage or users.manage | Roles with permissions and user counts |
| GET | `/roles/permissions` | 🛡 roles.manage | All permission keys |
| POST | `/roles` | 🛡 roles.manage | `{ key, name, description?, permissions[] }` |
| PUT | `/roles/:id/permissions` | 🛡 roles.manage | `{ permissions[] }` (Super Admin is fixed) |
| DELETE | `/roles/:id` | 🛡 roles.manage | Custom roles only |
| GET | `/audit-logs` | 🛡 audit.read | Filters `entityType`, `action` (prefix), `actorId` |
