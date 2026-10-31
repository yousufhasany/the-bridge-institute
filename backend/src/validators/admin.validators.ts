import { z } from 'zod';
import { email, optionalText, optionalUrl } from '../utils/http.js';

const uuid = z.string().uuid();
const optionalUuid = uuid.optional().nullable().transform((v) => v ?? null);
const optionalDate = z.coerce.date().optional().nullable().transform((v) => v ?? null);
const sortOrder = z.coerce.number().int().min(0).max(10_000);

// ---------------------------------------------------------------------------
// Users and roles
// ---------------------------------------------------------------------------
export const roleKey = z.string().regex(/^[A-Z][A-Z0-9_]{1,40}$/);

export const createUserSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email,
  phone: optionalText(30),
  roleKeys: z.array(roleKey).max(10).default([]),
});

export const updateUserSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120),
    phone: optionalText(30),
    isActive: z.boolean(),
    roleKeys: z.array(roleKey).max(10),
  })
  .partial();

export const userFilterSchema = z.object({
  role: roleKey.optional(),
  isActive: z.enum(['true', 'false']).optional(),
});

export const createRoleSchema = z.object({
  key: roleKey,
  name: z.string().trim().min(2).max(80),
  description: optionalText(300),
  permissions: z.array(z.string().max(60)).max(100).default([]),
});

export const rolePermissionsSchema = z.object({ permissions: z.array(z.string().max(60)).max(100) });

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------
const translation = z.object({
  title: z.string().trim().min(2).max(160),
  summary: z.string().trim().min(2).max(500),
  description: z.string().trim().min(2).max(10_000),
  duration: optionalText(80),
});

const bilingualItem = z.object({ en: z.string().trim().min(1).max(300), bn: optionalText(300) });

export const courseSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens')
    .max(80)
    .optional(),
  icon: z.string().trim().regex(/^[a-z0-9-]{1,40}$/).default('book-open'),
  categoryId: optionalUuid,
  sortOrder: sortOrder.default(0),
  translations: z.object({ en: translation, bn: translation.optional() }),
  topics: z.array(bilingualItem).max(50).default([]),
  outcomes: z.array(bilingualItem).max(50).default([]),
});

export const courseUpdateSchema = z
  .object({
    slug: courseSchema.shape.slug,
    icon: z.string().trim().regex(/^[a-z0-9-]{1,40}$/),
    categoryId: optionalUuid,
    sortOrder,
    translations: z.object({ en: translation.optional(), bn: translation.optional() }),
    topics: z.array(bilingualItem).max(50),
    outcomes: z.array(bilingualItem).max(50),
  })
  .partial();

export const courseStatusSchema = z.object({ status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']) });
export const reorderSchema = z.object({ ids: z.array(uuid).min(1).max(200) });

export const categorySchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),
  nameEn: z.string().trim().min(2).max(120),
  nameBn: optionalText(120),
  sortOrder: sortOrder.default(0),
});

export const materialSchema = z.object({
  courseId: uuid,
  title: z.string().trim().min(2).max(200),
  description: optionalText(2000),
  url: optionalUrl,
  assetId: optionalUuid,
  isPublished: z.boolean().default(false),
  sortOrder: sortOrder.default(0),
});
export const materialFilterSchema = z.object({ courseId: uuid.optional() });

// ---------------------------------------------------------------------------
// Admissions and students
// ---------------------------------------------------------------------------
export const applicationStatus = z.enum(['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WAITLISTED']);
export const applicationFilterSchema = z.object({ status: applicationStatus.optional() });
export const applicationStatusSchema = z.object({ status: applicationStatus, note: optionalText(2000) });
export const noteSchema = z.object({ body: z.string().trim().min(1).max(5000) });

export const studentUpdateSchema = z
  .object({
    status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED', 'WITHDRAWN']),
    educationLevel: optionalText(120),
    currentStatus: optionalText(120),
  })
  .partial();
export const studentSelfUpdateSchema = z.object({ educationLevel: optionalText(120), currentStatus: optionalText(120) }).partial();
export const studentFilterSchema = z.object({ status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED', 'WITHDRAWN']).optional() });

// ---------------------------------------------------------------------------
// Training
// ---------------------------------------------------------------------------
const batchStatus = z.enum(['PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED']);
const batchBase = {
  code: z.string().trim().regex(/^[A-Za-z0-9-]{2,40}$/),
  name: z.string().trim().min(2).max(160),
  courseId: optionalUuid,
  startDate: optionalDate,
  endDate: optionalDate,
  capacity: z.coerce.number().int().min(1).max(10_000).optional().nullable().transform((v) => v ?? null),
  status: batchStatus.default('PLANNED'),
};
export const batchSchema = z.object(batchBase);
export const batchUpdateSchema = z.object({ ...batchBase, status: batchStatus }).partial();
export const batchTeachersSchema = z.object({ userIds: z.array(uuid).max(20) });
export const batchFilterSchema = z.object({ status: batchStatus.optional(), courseId: uuid.optional() });

export const enrollmentSchema = z.object({ studentId: uuid, batchId: uuid });
export const enrollmentUpdateSchema = z
  .object({ status: z.enum(['ACTIVE', 'COMPLETED', 'WITHDRAWN']), progress: z.coerce.number().int().min(0).max(100) })
  .partial();
export const enrollmentFilterSchema = z.object({ batchId: uuid.optional(), studentId: uuid.optional() });

export const attendanceQuerySchema = z.object({ batchId: uuid, date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) });
export const attendanceSaveSchema = z.object({
  batchId: uuid,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  records: z
    .array(z.object({ enrollmentId: uuid, status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']), note: optionalText(500) }))
    .max(500),
});

export const assessmentSchema = z.object({
  batchId: uuid,
  title: z.string().trim().min(2).max(200),
  type: z.enum(['assignment', 'quiz', 'exam', 'project', 'practical']).default('assignment'),
  maxScore: z.coerce.number().int().min(1).max(1000).default(100),
  dueDate: optionalDate,
});
export const assessmentUpdateSchema = assessmentSchema.omit({ batchId: true }).partial();
export const assessmentFilterSchema = z.object({ batchId: uuid.optional() });

export const resultsQuerySchema = z.object({ assessmentId: uuid });
export const resultsSaveSchema = z.object({
  assessmentId: uuid,
  records: z
    .array(z.object({ enrollmentId: uuid, score: z.coerce.number().min(0).max(1000), feedback: optionalText(2000) }))
    .max(500),
});

export const certificateCreateSchema = z.object({ enrollmentId: uuid, notes: optionalText(1000) });
export const certificateActionSchema = z.object({ notes: optionalText(1000) });
export const certificateFilterSchema = z.object({ status: z.enum(['PENDING', 'APPROVED', 'ISSUED', 'REVOKED']).optional() });

// ---------------------------------------------------------------------------
// Companies and opportunities
// ---------------------------------------------------------------------------
const companyBase = {
  name: z.string().trim().min(2).max(160),
  website: optionalUrl,
  industry: optionalText(120),
  contactName: optionalText(120),
  contactEmail: email.optional().nullable().transform((v) => v ?? null),
  phone: optionalText(30),
  notes: optionalText(5000),
  status: z.enum(['PROSPECT', 'ACTIVE', 'INACTIVE']).default('PROSPECT'),
};
export const companySchema = z.object({ ...companyBase, listedPublicly: z.boolean().default(false) });
export const companyUpdateSchema = z
  .object({ ...companyBase, status: z.enum(['PROSPECT', 'ACTIVE', 'INACTIVE']), listedPublicly: z.boolean() })
  .partial();
export const companyFilterSchema = z.object({ status: z.enum(['PROSPECT', 'ACTIVE', 'INACTIVE']).optional() });

export const inquiryUpdateSchema = z
  .object({ status: z.enum(['NEW', 'IN_REVIEW', 'CONTACTED', 'CLOSED']), companyId: optionalUuid })
  .partial();
export const inquiryFilterSchema = z.object({ status: z.enum(['NEW', 'IN_REVIEW', 'CONTACTED', 'CLOSED']).optional() });
export const interactionSchema = z.object({
  type: z.enum(['note', 'call', 'email', 'meeting']).default('note'),
  note: z.string().trim().min(1).max(5000),
});

const opportunityBase = {
  companyId: optionalUuid,
  title: z.string().trim().min(2).max(200),
  type: z.enum(['INTERNSHIP', 'JOB', 'TRAINING', 'PROJECT', 'MENTORING', 'OTHER']).default('OTHER'),
  description: z.string().trim().min(10).max(10_000),
  location: optionalText(160),
  applyUrl: optionalUrl,
  deadline: optionalDate,
  audience: z.enum(['STUDENTS', 'ALUMNI', 'ALL']).default('ALL'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']).default('DRAFT'),
};
export const opportunitySchema = z.object(opportunityBase);
export const opportunityUpdateSchema = z
  .object({
    ...opportunityBase,
    type: z.enum(['INTERNSHIP', 'JOB', 'TRAINING', 'PROJECT', 'MENTORING', 'OTHER']),
    audience: z.enum(['STUDENTS', 'ALUMNI', 'ALL']),
    status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']),
  })
  .partial();
export const opportunityFilterSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']).optional(),
  audience: z.enum(['STUDENTS', 'ALUMNI', 'ALL']).optional(),
});

// ---------------------------------------------------------------------------
// Contact messages
// ---------------------------------------------------------------------------
export const contactFilterSchema = z.object({
  isRead: z.enum(['true', 'false']).optional(),
  category: z.enum(['general', 'admission', 'partnership', 'alumni-assistance']).optional(),
});
export const contactUpdateSchema = z.object({ isRead: z.boolean() });

// ---------------------------------------------------------------------------
// CMS, FAQs, settings
// ---------------------------------------------------------------------------
const faqBase = {
  questionEn: z.string().trim().min(5).max(300),
  answerEn: z.string().trim().min(5).max(5000),
  questionBn: optionalText(300),
  answerBn: optionalText(5000),
  category: z.string().trim().regex(/^[a-z0-9-]{1,40}$/).default('general'),
  sortOrder: sortOrder.default(0),
  isPublished: z.boolean().default(false),
};
export const faqSchema = z.object(faqBase);
export const faqUpdateSchema = z
  .object({ ...faqBase, category: z.string().trim().regex(/^[a-z0-9-]{1,40}$/), sortOrder, isPublished: z.boolean() })
  .partial();

export const sectionKey = z.string().regex(/^[a-z][a-z0-9-]{1,40}$/);
const jsonValue: z.ZodType<unknown> = z.lazy(() =>
  z.union([z.string().max(10_000), z.number(), z.boolean(), z.null(), z.array(jsonValue).max(100), z.record(z.string().max(60), jsonValue)]),
);
export const sectionContentSchema = z.object({ content: z.record(z.string().max(60), jsonValue) });

export const auditFilterSchema = z.object({
  entityType: z.string().max(60).optional(),
  action: z.string().max(80).optional(),
  actorId: uuid.optional(),
});

// ---------------------------------------------------------------------------
// Alumni administration
// ---------------------------------------------------------------------------
const cohortBase = {
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),
  name: z.string().trim().min(2).max(160),
  graduationYear: z.coerce.number().int().min(2000).max(2100).optional().nullable().transform((v) => v ?? null),
  courseId: optionalUuid,
  description: optionalText(2000),
};
export const cohortSchema = z.object(cohortBase);
export const cohortUpdateSchema = z.object(cohortBase).partial();

const announcementBase = {
  titleEn: z.string().trim().min(2).max(200),
  titleBn: optionalText(200),
  bodyEn: z.string().trim().min(2).max(10_000),
  bodyBn: optionalText(10_000),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
};
export const announcementSchema = z.object(announcementBase);
export const announcementUpdateSchema = z
  .object({ ...announcementBase, status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']) })
  .partial();
export const announcementFilterSchema = z.object({ status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional() });

export const reviewDecisionSchema = z.object({ note: optionalText(2000) });
export const reviewFilterSchema = z.object({ status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional() });
export const profileFilterSchema = z.object({
  verificationStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED']).optional(),
  publicationStatus: z.enum(['NOT_SUBMITTED', 'PENDING', 'APPROVED', 'REJECTED']).optional(),
  archived: z.enum(['true', 'false']).optional(),
});
export const storyFilterSchema = z.object({ status: z.enum(['SUBMITTED', 'PUBLISHED', 'REJECTED', 'ARCHIVED']).optional() });
export const adminProfileUpdateSchema = z
  .object({
    displayName: z.string().trim().min(2).max(120),
    cohortId: optionalUuid,
    courseId: optionalUuid,
    graduationYear: cohortBase.graduationYear,
    programName: optionalText(160),
  })
  .partial();
export const adminStoryUpdateSchema = z
  .object({
    titleEn: optionalText(200),
    titleBn: optionalText(200),
    excerptEn: optionalText(500),
    excerptBn: optionalText(500),
    bodyEn: optionalText(20_000),
    bodyBn: optionalText(20_000),
  })
  .partial();
