# Database

PostgreSQL (Supabase in production) accessed only by the backend through Prisma 6.

- Schema: `database/prisma/schema.prisma`
- Migrations: `database/prisma/migrations/` (initial migration `20261026104641_init`)
- Seed: `database/prisma/seed.ts`
- Generated client: `backend/generated/prisma` (git-ignored, created by `npm run db:generate` or on install)

Primary keys are UUIDs; timestamps are `timestamptz(3)`. Operational commands (migrations, seeding, tests, backups) are in [`database/README.md`](../database/README.md).

## Models

### Identity and access

| Model | Purpose |
| --- | --- |
| `User` | Single account table for staff, students and alumni. Email (unique, lowercase), bcrypt `passwordHash` (null until the invited user sets one), `isActive`, preferred locale |
| `Role`, `Permission`, `UserRole`, `RolePermission` | Role-based access control. System roles (`isSystem`) cannot be deleted |
| `Session` | Server-side sessions. Only an HMAC-SHA256 hash of the session token is stored; `revokedAt`, `expiresAt`, IP and user agent |
| `PasswordResetToken` | Hashed one-time tokens for password reset (1 h) and invitations (72 h), with `usedAt` |

### Courses and training

| Model | Purpose |
| --- | --- |
| `CourseCategory` | Bilingual category names |
| `Course` | Slug, icon, `ContentStatus` (DRAFT / PUBLISHED / ARCHIVED), order, category |
| `CourseTranslation` | Per-locale title, summary, description, optional duration (`en` required to publish; `bn` optional) |
| `CourseTopic`, `LearningOutcome` | Ordered bilingual lists |
| `LearningMaterial` | Course materials linked to private `MediaAsset` files |
| `TrainingBatch`, `BatchTeacher` | Batches of a course and their assigned teachers |
| `StudentProfile` | Student record (code `BIS-YYYY-NNNN`) linked to a `User` and optionally to the source application |
| `Enrollment` | Student in a batch with status and progress |
| `Attendance` | Per student, batch and date |
| `Assessment`, `AssessmentResult` | Assessments per batch and scores per enrollment |
| `Certificate` | `PENDING` (prepared) → `APPROVED` → `ISSUED`, or `REVOKED`; always created manually for a completed enrollment |

### Admissions

| Model | Purpose |
| --- | --- |
| `StudentApplication` | Public application with reference code, idempotency key, consent timestamp, status |
| `ApplicationStatusHistory` | Every status change with actor and private note |
| `ApplicationInternalNote` | Staff-only notes, never returned to applicants |

### Industry and contact

| Model | Purpose |
| --- | --- |
| `Company` | Relationship records (`PROSPECT`, `ACTIVE`, `INACTIVE`). Not shown publicly |
| `PartnershipInquiry`, `PartnershipInteraction` | Inquiries from the companies form and the staff interaction log |
| `Opportunity` | Internships/jobs/training shown to signed-in students or alumni when published |
| `ContactMessage` | Contact form and alumni assistance messages |

### Alumni (same database, same `User` table)

| Model | Purpose |
| --- | --- |
| `AlumniCohort` | Cohort name, slug, graduation year, course |
| `AlumniRegistrationRequest` | Request to be recognised as alumni; `matchedStudentId` is an automatic hint only |
| `AlumniProfile` | One per user. `verificationStatus`, `isPublic` + `publicConsentAt` (explicit consent), `publicationStatus`, `pendingChanges` (edits held for review), `archivedAt` |
| `AlumniStory` | Bilingual stories: SUBMITTED → PUBLISHED / REJECTED / ARCHIVED |
| `AlumniAnnouncement` | Announcements for verified alumni |

A profile is public only when it is verified, not archived, has recorded consent and publication is approved (`PUBLIC_PROFILE_WHERE` in `backend/src/services/alumni.service.ts`). Public responses use a strict field whitelist; contact email and phone are never public.

### Website, files and audit

| Model | Purpose |
| --- | --- |
| `WebsiteSection` | CMS overrides per `(key, locale)` with `draftContent` and `publishedContent` |
| `WebsiteSetting` | Pre-defined settings (contact, social, QR, SEO, programme) with `isPublic` |
| `Faq` | Bilingual FAQs with publish flag |
| `MediaAsset` | Uploaded file metadata (bucket, object key, MIME type detected from file content, visibility) |
| `Notification` | In-app notifications (reserved for future use) |
| `AuditLog` | Actor, action, entity, metadata and IP for important actions |

## Seeded reference data

`npm run db:seed` is idempotent and safe to re-run:

- All permissions and the eight default roles (role permissions are only seeded when a role is first created, so changes made in the admin are kept; Super Admin is always topped up with every administrative permission).
- The **Foundation Courses** category and the five brochure courses (Critical Thinking, Basic English, Basic Mathematics, Basic ICT, Basic Python Programming) with bilingual descriptions, topics and outcomes, published. Durations are intentionally empty. Existing courses are not overwritten.
- Website settings with empty values except the brochure email. Existing values are never overwritten.
- Three neutral FAQs, only if no FAQs exist.

The seed creates no users, students, alumni, stories, testimonials, companies or statistics.

## Data protection notes

- Passwords: bcrypt (cost 12). Session and reset tokens: random 32-byte values; only HMAC hashes are stored.
- Applicant and alumni personal data is only returned to staff with the matching permission, or to the person themselves.
- Deleting is avoided for records with history: courses, alumni profiles and stories are archived instead.
