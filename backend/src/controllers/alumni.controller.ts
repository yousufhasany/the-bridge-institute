import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma, Prisma } from '../lib/prisma.js';
import { currentUser } from '../middleware/auth.js';
import {
  PUBLIC_PROFILE_WHERE,
  directoryFilters,
  publicProfileInclude,
  storyInclude,
  toPublicProfile,
  toPublicStory,
} from '../services/alumni.service.js';
import { audit } from '../services/audit.service.js';
import { ApiError, body, created, idParam, ok, pageMeta, parse } from '../utils/http.js';
import { uniqueSlug } from '../utils/slug.js';
import {
  PUBLIC_PROFILE_FIELDS,
  alumniJoinSchema,
  alumniSelfUpdateSchema,
  assistanceSchema,
  directoryQuerySchema,
  storySubmitSchema,
  visibilitySchema,
} from '../validators/alumni.validators.js';

const localeQuery = z.object({ locale: z.enum(['en', 'bn']).default('en') });
const slugParam = z.object({ slug: z.string().regex(/^[a-z0-9-]{1,100}$/) });
const getSlug = (req: Request) => {
  const r = slugParam.safeParse(req.params);
  if (!r.success) throw ApiError.notFound();
  return r.data.slug;
};

// ---------------------------------------------------------------------------
// Public directory and stories
// ---------------------------------------------------------------------------
export async function directory(req: Request, res: Response) {
  const q = parse(directoryQuerySchema, req.query);
  const { locale } = parse(localeQuery, req.query);
  const where: Prisma.AlumniProfileWhereInput = {
    ...PUBLIC_PROFILE_WHERE,
    ...(q.cohort ? { cohort: { slug: q.cohort } } : {}),
    ...(q.course ? { course: { slug: q.course } } : {}),
    ...(q.year ? { graduationYear: q.year } : {}),
    ...(q.field ? { professionalField: { equals: q.field, mode: 'insensitive' } } : {}),
    ...(q.q
      ? {
          OR: [
            { displayName: { contains: q.q, mode: 'insensitive' } },
            { professionalTitle: { contains: q.q, mode: 'insensitive' } },
            { organization: { contains: q.q, mode: 'insensitive' } },
            { skills: { has: q.q } },
          ],
        }
      : {}),
  };
  const [items, total] = await Promise.all([
    prisma.alumniProfile.findMany({
      where,
      include: publicProfileInclude,
      orderBy: [{ graduationYear: 'desc' }, { displayName: 'asc' }],
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize,
    }),
    prisma.alumniProfile.count({ where }),
  ]);
  res.set('Cache-Control', 'no-cache');
  ok(res, items.map((p) => toPublicProfile(p, locale)), pageMeta({ page: q.page, pageSize: q.pageSize, order: 'desc' }, total));
}

export async function filters(req: Request, res: Response) {
  const { locale } = parse(localeQuery, req.query);
  res.set('Cache-Control', 'no-cache');
  ok(res, await directoryFilters(locale));
}

export async function publicProfile(req: Request, res: Response) {
  const { locale } = parse(localeQuery, req.query);
  const profile = await prisma.alumniProfile.findFirst({ where: { ...PUBLIC_PROFILE_WHERE, slug: getSlug(req) }, include: publicProfileInclude });
  if (!profile) throw ApiError.notFound('Profile not found');
  const stories = await prisma.alumniStory.findMany({
    where: { authorId: profile.id, status: 'PUBLISHED' },
    include: storyInclude,
    orderBy: { publishedAt: 'desc' },
    take: 10,
  });
  ok(res, { ...toPublicProfile(profile, locale), stories: stories.map((s) => toPublicStory(s, locale, false)) });
}

export async function publicStories(req: Request, res: Response) {
  const { locale } = parse(localeQuery, req.query);
  const page = z.coerce.number().int().min(1).max(1000).catch(1).parse(req.query.page);
  const pageSize = 9;
  const where: Prisma.AlumniStoryWhereInput = { status: 'PUBLISHED', author: { archivedAt: null } };
  const [items, total] = await Promise.all([
    prisma.alumniStory.findMany({ where, include: storyInclude, orderBy: { publishedAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.alumniStory.count({ where }),
  ]);
  res.set('Cache-Control', 'no-cache');
  ok(res, items.map((s) => toPublicStory(s, locale, false)), pageMeta({ page, pageSize, order: 'desc' }, total));
}

export async function publicStory(req: Request, res: Response) {
  const { locale } = parse(localeQuery, req.query);
  const story = await prisma.alumniStory.findFirst({
    where: { slug: getSlug(req), status: 'PUBLISHED', author: { archivedAt: null } },
    include: storyInclude,
  });
  if (!story) throw ApiError.notFound('Story not found');
  ok(res, toPublicStory(story, locale, true));
}

export async function cohortsAndCourses(_req: Request, res: Response) {
  const [cohorts, courses] = await Promise.all([
    prisma.alumniCohort.findMany({ select: { id: true, name: true, graduationYear: true }, orderBy: [{ graduationYear: 'desc' }, { name: 'asc' }] }),
    prisma.course.findMany({
      where: { status: { in: ['PUBLISHED', 'ARCHIVED'] } },
      select: { id: true, translations: { select: { locale: true, title: true } } },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);
  ok(res, { cohorts, courses });
}

// ---------------------------------------------------------------------------
// Registration (never grants verified status automatically)
// ---------------------------------------------------------------------------
export async function register(req: Request, res: Response) {
  if (!req.auth) {
    throw ApiError.forbidden('An institute account is required. Contact The Bridge Institute to be invited before submitting an alumni request.');
  }
  const input = body(req, alumniJoinSchema);
  const userId = req.auth.id;

  const [profile, pending] = await Promise.all([
    prisma.alumniProfile.findUnique({ where: { userId } }),
    prisma.alumniRegistrationRequest.findFirst({ where: { userId, status: 'PENDING' } }),
  ]);
  if (profile?.verificationStatus === 'VERIFIED') throw ApiError.conflict('Your alumni status is already verified');
  if (pending) throw ApiError.conflict('You already have a registration request awaiting review', 'REQUEST_PENDING');

  // Help reviewers: match against a graduated student record that belongs to the same account.
  const student = await prisma.studentProfile.findFirst({
    where: { userId, status: 'GRADUATED', ...(input.studentCode ? { studentCode: input.studentCode } : {}) },
  });

  const request = await prisma.alumniRegistrationRequest.create({
    data: {
      userId,
      fullName: input.fullName,
      email: req.auth?.email ?? input.email,
      graduationYear: input.graduationYear,
      courseId: input.courseId,
      cohortId: input.cohortId,
      studentCode: input.studentCode,
      message: input.message,
      matchedStudentId: student?.id ?? null,
    },
    select: { id: true, status: true, createdAt: true },
  });
  await audit(req, { action: 'alumni.register', entityType: 'AlumniRegistrationRequest', entityId: request.id });
  created(res, request);
}

// ---------------------------------------------------------------------------
// Self service (alumni.self for profile features; any signed-in user for status)
// ---------------------------------------------------------------------------
const ownProfileSelect = {
  id: true,
  slug: true,
  displayName: true,
  graduationYear: true,
  programName: true,
  professionalTitle: true,
  organization: true,
  professionalField: true,
  skills: true,
  interests: true,
  bioEn: true,
  bioBn: true,
  linkedinUrl: true,
  portfolioUrl: true,
  photoAssetId: true,
  contactEmail: true,
  contactPhone: true,
  verificationStatus: true,
  isPublic: true,
  publicConsentAt: true,
  publicationStatus: true,
  pendingChanges: true,
  archivedAt: true,
  cohort: { select: { id: true, name: true } },
  course: { select: { id: true, slug: true, translations: { select: { locale: true, title: true } } } },
} satisfies Prisma.AlumniProfileSelect;

export async function me(req: Request, res: Response) {
  const auth = currentUser(req);
  const [profile, requests] = await Promise.all([
    prisma.alumniProfile.findUnique({ where: { userId: auth.id }, select: ownProfileSelect }),
    prisma.alumniRegistrationRequest.findMany({
      where: { userId: auth.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, status: true, createdAt: true, reviewedAt: true },
    }),
  ]);
  ok(res, { profile, requests });
}

async function ownActiveProfile(req: Request) {
  const profile = await prisma.alumniProfile.findUnique({ where: { userId: currentUser(req).id } });
  if (!profile || profile.verificationStatus !== 'VERIFIED') throw ApiError.forbidden('A verified alumni profile is required');
  if (profile.archivedAt) throw ApiError.forbidden('This alumni profile has been archived');
  return profile;
}

/**
 * Private fields apply immediately. Public-facing fields apply immediately while the profile
 * is unpublished; once published they are held in pendingChanges until staff approve them.
 */
export async function updateMe(req: Request, res: Response) {
  const profile = await ownActiveProfile(req);
  const input = body(req, alumniSelfUpdateSchema);

  if (input.photoAssetId) {
    const asset = await prisma.mediaAsset.findFirst({ where: { id: input.photoAssetId, uploadedById: profile.userId, mimeType: { startsWith: 'image/' } } });
    if (!asset) throw ApiError.badRequest('Invalid photo');
  }

  const publicChanges: Record<string, unknown> = {};
  const direct: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if ((PUBLIC_PROFILE_FIELDS as readonly string[]).includes(key)) publicChanges[key] = value;
    else direct[key] = value;
  }

  const published = profile.publicationStatus === 'APPROVED';
  const data: Prisma.AlumniProfileUpdateInput = published
    ? {
        ...direct,
        ...(Object.keys(publicChanges).length
          ? { pendingChanges: { ...((profile.pendingChanges as Record<string, unknown>) ?? {}), ...publicChanges } as Prisma.InputJsonValue }
          : {}),
      }
    : { ...direct, ...publicChanges };

  const updated = await prisma.alumniProfile.update({ where: { id: profile.id }, data, select: ownProfileSelect });
  await audit(req, { action: 'alumni.profile_update', entityType: 'AlumniProfile', entityId: profile.id, metadata: { fields: Object.keys(input), heldForReview: published } });
  ok(res, updated);
}

/** Turning visibility on requires explicit consent and staff approval; turning it off is immediate. */
export async function setVisibility(req: Request, res: Response) {
  const profile = await ownActiveProfile(req);
  const input = body(req, visibilitySchema);
  let data: Prisma.AlumniProfileUpdateInput;
  if (input.isPublic) {
    if (input.consent !== true) throw ApiError.badRequest('Explicit consent is required to make your profile public');
    data = {
      isPublic: true,
      publicConsentAt: new Date(),
      publicationStatus: profile.publicationStatus === 'APPROVED' ? 'APPROVED' : 'PENDING',
    };
  } else {
    data = { isPublic: false, publicConsentAt: null };
  }
  const updated = await prisma.alumniProfile.update({ where: { id: profile.id }, data, select: ownProfileSelect });
  await audit(req, { action: input.isPublic ? 'alumni.consent_granted' : 'alumni.consent_revoked', entityType: 'AlumniProfile', entityId: profile.id });
  ok(res, updated);
}

export async function myStories(req: Request, res: Response) {
  const profile = await ownActiveProfile(req);
  const stories = await prisma.alumniStory.findMany({
    where: { authorId: profile.id },
    orderBy: { createdAt: 'desc' },
    select: { id: true, slug: true, titleEn: true, titleBn: true, excerptEn: true, excerptBn: true, bodyEn: true, bodyBn: true, status: true, publishedAt: true, createdAt: true },
  });
  ok(res, stories);
}

export async function submitStory(req: Request, res: Response) {
  const profile = await ownActiveProfile(req);
  const input = body(req, storySubmitSchema);
  if (input.imageAssetId) {
    const asset = await prisma.mediaAsset.findFirst({ where: { id: input.imageAssetId, uploadedById: profile.userId } });
    if (!asset) throw ApiError.badRequest('Invalid image');
  }
  const story = await prisma.alumniStory.create({
    data: { ...input, authorId: profile.id, slug: uniqueSlug(input.titleEn ?? profile.displayName), status: 'SUBMITTED' },
    select: { id: true, slug: true, status: true, createdAt: true },
  });
  await audit(req, { action: 'alumni.story_submit', entityType: 'AlumniStory', entityId: story.id });
  created(res, story);
}

/** Authors may revise their own stories while unpublished; revisions return to review. */
export async function updateStory(req: Request, res: Response) {
  const profile = await ownActiveProfile(req);
  const id = idParam(req);
  const story = await prisma.alumniStory.findFirst({ where: { id, authorId: profile.id } });
  if (!story) throw ApiError.notFound();
  if (story.status === 'PUBLISHED' || story.status === 'ARCHIVED') throw ApiError.badRequest('Published stories cannot be edited. Contact the institute to request changes.');
  const input = body(req, storySubmitSchema);
  const updated = await prisma.alumniStory.update({
    where: { id },
    data: { ...input, status: 'SUBMITTED' },
    select: { id: true, slug: true, status: true },
  });
  ok(res, updated);
}

export async function announcements(req: Request, res: Response) {
  const { locale } = parse(localeQuery, req.query);
  const items = await prisma.alumniAnnouncement.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 50 });
  ok(
    res,
    items.map((a) => ({
      id: a.id,
      title: (locale === 'bn' && a.titleBn) || a.titleEn,
      body: (locale === 'bn' && a.bodyBn) || a.bodyEn,
      publishedAt: a.publishedAt,
    })),
  );
}

export async function requestAssistance(req: Request, res: Response) {
  const auth = currentUser(req);
  const input = body(req, assistanceSchema);
  const message = await prisma.contactMessage.create({
    data: { name: auth.fullName, email: auth.email, subject: input.subject, message: input.message, category: 'alumni-assistance', userId: auth.id },
    select: { id: true, createdAt: true },
  });
  created(res, message);
}
