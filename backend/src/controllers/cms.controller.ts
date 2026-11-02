import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma, Prisma } from '../lib/prisma.js';
import { P } from '../config/permissions.js';
import { currentUser, hasPermission } from '../middleware/auth.js';
import { audit } from '../services/audit.service.js';
import { ApiError, body, httpUrlOrEmpty, ok, orderBy, pageArgs, pageMeta, paginationSchema, parse } from '../utils/http.js';
import { auditFilterSchema, sectionContentSchema, sectionKey } from '../validators/admin.validators.js';

const locale = z.enum(['en', 'bn']);
const sectionParams = z.object({ key: sectionKey, locale });
const MAX_SECTION_BYTES = 64 * 1024;

const getSectionParams = (req: Request) => {
  const r = sectionParams.safeParse(req.params);
  if (!r.success) throw ApiError.notFound();
  return r.data;
};

// ---------------------------------------------------------------------------
// Website sections: drafts are private; only published content is public.
// ---------------------------------------------------------------------------
export async function publicSections(req: Request, res: Response) {
  const { locale: lang } = parse(z.object({ locale: locale.default('en') }), req.query);
  const rows = await prisma.websiteSection.findMany({ where: { locale: lang, publishedContent: { not: Prisma.AnyNull } } });
  res.set('Cache-Control', 'no-cache');
  ok(res, Object.fromEntries(rows.map((r) => [r.key, r.publishedContent])));
}

export async function adminSections(_req: Request, res: Response) {
  const rows = await prisma.websiteSection.findMany({ orderBy: [{ key: 'asc' }, { locale: 'asc' }] });
  ok(
    res,
    rows.map((r) => ({
      key: r.key,
      locale: r.locale,
      draftContent: r.draftContent,
      publishedContent: r.publishedContent,
      publishedAt: r.publishedAt,
      updatedAt: r.updatedAt,
      hasUnpublishedChanges: JSON.stringify(r.draftContent) !== JSON.stringify(r.publishedContent),
    })),
  );
}

export async function saveDraft(req: Request, res: Response) {
  const { key, locale: lang } = getSectionParams(req);
  const { content } = body(req, sectionContentSchema);
  if (Buffer.byteLength(JSON.stringify(content)) > MAX_SECTION_BYTES) throw ApiError.badRequest('Section content is too large');
  const row = await prisma.websiteSection.upsert({
    where: { key_locale: { key, locale: lang } },
    update: { draftContent: content as Prisma.InputJsonValue, updatedById: currentUser(req).id },
    create: { key, locale: lang, draftContent: content as Prisma.InputJsonValue, updatedById: currentUser(req).id },
  });
  await audit(req, { action: 'cms.draft_save', entityType: 'WebsiteSection', entityId: row.id, metadata: { key, locale: lang } });
  ok(res, row);
}

export async function publish(req: Request, res: Response) {
  const { key, locale: lang } = getSectionParams(req);
  const row = await prisma.websiteSection.findUnique({ where: { key_locale: { key, locale: lang } } });
  if (!row) throw ApiError.notFound('Save a draft before publishing');
  const updated = await prisma.websiteSection.update({
    where: { id: row.id },
    data: { publishedContent: row.draftContent as Prisma.InputJsonValue, publishedAt: new Date(), updatedById: currentUser(req).id },
  });
  await audit(req, { action: 'cms.publish', entityType: 'WebsiteSection', entityId: row.id, metadata: { key, locale: lang } });
  ok(res, updated);
}

/** Removes the published override so the site falls back to the built-in default text. */
export async function unpublish(req: Request, res: Response) {
  const { key, locale: lang } = getSectionParams(req);
  const row = await prisma.websiteSection.findUnique({ where: { key_locale: { key, locale: lang } } });
  if (!row) throw ApiError.notFound();
  const updated = await prisma.websiteSection.update({ where: { id: row.id }, data: { publishedContent: Prisma.DbNull, publishedAt: null } });
  await audit(req, { action: 'cms.unpublish', entityType: 'WebsiteSection', entityId: row.id, metadata: { key, locale: lang } });
  ok(res, updated);
}

// ---------------------------------------------------------------------------
// FAQs (public read)
// ---------------------------------------------------------------------------
export async function publicFaqs(req: Request, res: Response) {
  const { locale: lang } = parse(z.object({ locale: locale.default('en') }), req.query);
  const faqs = await prisma.faq.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
  res.set('Cache-Control', 'no-cache');
  ok(
    res,
    faqs.map((f) => ({
      id: f.id,
      category: f.category,
      question: (lang === 'bn' && f.questionBn) || f.questionEn,
      answer: (lang === 'bn' && f.answerBn) || f.answerEn,
    })),
  );
}

// ---------------------------------------------------------------------------
// Settings. Only pre-defined keys exist; each has a value rule.
// ---------------------------------------------------------------------------
const emailOrEmpty = z.union([z.literal(''), z.string().trim().toLowerCase().email().max(254)]);
const urlOrEmpty = httpUrlOrEmpty;

function settingRule(key: string): z.ZodTypeAny {
  if (/^contact\.[a-zA-Z]+Email$/.test(key)) return emailOrEmpty;
  if (key === 'contact.phone') return z.string().trim().max(40);
  if (key === 'contact.address') return z.string().trim().max(500);
  if (key === 'social.facebookUrl' || key.startsWith('qr.')) return urlOrEmpty;
  if (key === 'social.links') return z.array(z.object({ label: z.string().trim().min(1).max(60), url: urlOrEmpty })).max(20);
  if (key === 'seo.defaults') {
    return z.object({
      titleEn: z.string().trim().max(120),
      titleBn: z.string().trim().max(120),
      descriptionEn: z.string().trim().max(300),
      descriptionBn: z.string().trim().max(300),
    });
  }
  if (key === 'program.sixMonthProgram') {
    return z.object({
      status: z.enum(['requires_review', 'confirmed', 'not_applicable']),
      enabled: z.boolean(),
      relationship: z.string().trim().max(1000),
    });
  }
  throw ApiError.badRequest('This setting cannot be edited');
}

export async function publicSettings(_req: Request, res: Response) {
  const rows = await prisma.websiteSetting.findMany({ where: { isPublic: true } });
  res.set('Cache-Control', 'no-cache');
  ok(res, Object.fromEntries(rows.map((r) => [r.key, r.value])));
}

export async function adminSettings(_req: Request, res: Response) {
  ok(res, await prisma.websiteSetting.findMany({ orderBy: [{ group: 'asc' }, { key: 'asc' }] }));
}

export async function updateSetting(req: Request, res: Response) {
  const key = z.string().regex(/^[a-zA-Z.]{3,60}$/).safeParse(req.params.key);
  if (!key.success) throw ApiError.notFound();
  const existing = await prisma.websiteSetting.findUnique({ where: { key: key.data } });
  if (!existing) throw ApiError.notFound('Unknown setting');
  const { value } = body(req, z.object({ value: settingRule(key.data) }));
  // The six-month programme may only be shown publicly once an administrator confirms it.
  const program = value as { status?: string; enabled?: boolean };
  const isPublic = key.data === 'program.sixMonthProgram' ? program.status === 'confirmed' && program.enabled === true : existing.isPublic;
  const updated = await prisma.websiteSetting.update({
    where: { key: key.data },
    data: { value: value as Prisma.InputJsonValue, isPublic, updatedById: currentUser(req).id },
  });
  await audit(req, { action: 'settings.update', entityType: 'WebsiteSetting', entityId: updated.id, metadata: { key: key.data } });
  ok(res, updated);
}

// ---------------------------------------------------------------------------
// Audit logs
// ---------------------------------------------------------------------------
export async function auditLogs(req: Request, res: Response) {
  const p = parse(paginationSchema, req.query);
  const f = parse(auditFilterSchema, req.query);
  const where: Prisma.AuditLogWhereInput = {
    ...(f.entityType ? { entityType: f.entityType } : {}),
    ...(f.action ? { action: { startsWith: f.action } } : {}),
    ...(f.actorId ? { actorId: f.actorId } : {}),
    ...(p.q ? { OR: [{ action: { contains: p.q, mode: 'insensitive' } }, { entityId: { contains: p.q } }] } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({ where, orderBy: orderBy(p, ['createdAt', 'action', 'entityType']), ...pageArgs(p), include: { actor: { select: { fullName: true, email: true } } } }),
    prisma.auditLog.count({ where }),
  ]);
  ok(res, items, pageMeta(p, total));
}

// ---------------------------------------------------------------------------
// Dashboard: every number is a live database count.
// ---------------------------------------------------------------------------
export async function dashboard(req: Request, res: Response) {
  const [
    applications,
    pendingApplications,
    publishedCourses,
    activeStudents,
    batches,
    partnershipInquiries,
    newInquiries,
    unreadMessages,
    verifiedAlumni,
    pendingAlumniRegistrations,
    publicAlumniProfiles,
    storiesAwaitingReview,
    publishedStories,
  ] = await Promise.all([
    prisma.studentApplication.count(),
    prisma.studentApplication.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } } }),
    prisma.course.count({ where: { status: 'PUBLISHED' } }),
    prisma.studentProfile.count({ where: { status: 'ACTIVE' } }),
    prisma.trainingBatch.count({ where: { status: { in: ['PLANNED', 'ACTIVE'] } } }),
    prisma.partnershipInquiry.count(),
    prisma.partnershipInquiry.count({ where: { status: 'NEW' } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.alumniProfile.count({ where: { verificationStatus: 'VERIFIED', archivedAt: null } }),
    prisma.alumniRegistrationRequest.count({ where: { status: 'PENDING' } }),
    prisma.alumniProfile.count({
      where: { verificationStatus: 'VERIFIED', isPublic: true, publicConsentAt: { not: null }, publicationStatus: 'APPROVED', archivedAt: null },
    }),
    prisma.alumniStory.count({ where: { status: 'SUBMITTED' } }),
    prisma.alumniStory.count({ where: { status: 'PUBLISHED' } }),
  ]);
  // Applicant names are only shown to staff who handle admissions.
  const recentApplications = hasPermission(req, P.applicationsManage)
    ? await prisma.studentApplication.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, referenceCode: true, fullName: true, status: true, createdAt: true },
      })
    : [];
  ok(res, {
    counts: {
      applications,
      pendingApplications,
      publishedCourses,
      activeStudents,
      batches,
      partnershipInquiries,
      newInquiries,
      unreadMessages,
      verifiedAlumni,
      pendingAlumniRegistrations,
      publicAlumniProfiles,
      storiesAwaitingReview,
      publishedStories,
    },
    recentApplications,
  });
}
