import type { Request, Response } from 'express';
import { prisma, Prisma } from '../lib/prisma.js';
import { currentUser } from '../middleware/auth.js';
import { PUBLIC_PROFILE_WHERE } from '../services/alumni.service.js';
import { audit } from '../services/audit.service.js';
import { ApiError, body, idParam, ok, orderBy, pageArgs, pageMeta, paginationSchema, parse } from '../utils/http.js';
import { slugify } from '../utils/slug.js';
import {
  adminProfileUpdateSchema,
  adminStoryUpdateSchema,
  profileFilterSchema,
  reviewDecisionSchema,
  reviewFilterSchema,
  storyFilterSchema,
} from '../validators/admin.validators.js';

export async function overview(_req: Request, res: Response) {
  const [verified, pendingRegistrations, publicProfiles, pendingPublication, storiesAwaitingReview, publishedStories, cohorts, announcements] =
    await Promise.all([
      prisma.alumniProfile.count({ where: { verificationStatus: 'VERIFIED', archivedAt: null } }),
      prisma.alumniRegistrationRequest.count({ where: { status: 'PENDING' } }),
      prisma.alumniProfile.count({ where: PUBLIC_PROFILE_WHERE }),
      prisma.alumniProfile.count({ where: { OR: [{ publicationStatus: 'PENDING' }, { pendingChanges: { not: Prisma.AnyNull } }], archivedAt: null } }),
      prisma.alumniStory.count({ where: { status: 'SUBMITTED' } }),
      prisma.alumniStory.count({ where: { status: 'PUBLISHED' } }),
      prisma.alumniCohort.count(),
      prisma.alumniAnnouncement.count({ where: { status: 'PUBLISHED' } }),
    ]);
  ok(res, { verified, pendingRegistrations, publicProfiles, pendingPublication, storiesAwaitingReview, publishedStories, cohorts, announcements });
}

// ---------------------------------------------------------------------------
// Registration requests
// ---------------------------------------------------------------------------
export async function listRegistrations(req: Request, res: Response) {
  const p = parse(paginationSchema, req.query);
  const f = parse(reviewFilterSchema, req.query);
  const where: Prisma.AlumniRegistrationRequestWhereInput = {
    ...(f.status ? { status: f.status } : {}),
    ...(p.q ? { OR: [{ fullName: { contains: p.q, mode: 'insensitive' } }, { email: { contains: p.q, mode: 'insensitive' } }] } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.alumniRegistrationRequest.findMany({
      where,
      orderBy: orderBy(p, ['createdAt', 'status', 'fullName']),
      ...pageArgs(p),
      include: { cohort: { select: { name: true } }, reviewedBy: { select: { fullName: true } } },
    }),
    prisma.alumniRegistrationRequest.count({ where }),
  ]);
  ok(res, items, pageMeta(p, total));
}

export async function getRegistration(req: Request, res: Response) {
  const request = await prisma.alumniRegistrationRequest.findUnique({
    where: { id: idParam(req) },
    include: { cohort: true, reviewedBy: { select: { fullName: true } }, user: { select: { id: true, email: true, fullName: true, createdAt: true } } },
  });
  if (!request) throw ApiError.notFound();
  const matchedStudent = request.matchedStudentId
    ? await prisma.studentProfile.findUnique({ where: { id: request.matchedStudentId }, select: { id: true, studentCode: true, status: true, graduatedAt: true } })
    : null;
  ok(res, { ...request, matchedStudent });
}

/** Public profiles live at /alumni/:slug alongside these portal routes. */
const RESERVED_PROFILE_SLUGS = new Set(['login', 'join', 'dashboard', 'profile', 'stories', 'story', 'opportunities', 'item']);

async function uniqueProfileSlug(tx: Prisma.TransactionClient, name: string) {
  const slug = slugify(name);
  const base = RESERVED_PROFILE_SLUGS.has(slug) ? `alumni-${slug === 'item' ? 'member' : slug}` : slug;
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`;
    if (!(await tx.alumniProfile.findUnique({ where: { slug: candidate } }))) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function approveRegistration(req: Request, res: Response) {
  const id = idParam(req);
  const { note } = body(req, reviewDecisionSchema);
  const reviewer = currentUser(req);
  const profile = await prisma.$transaction(async (tx) => {
    const request = await tx.alumniRegistrationRequest.findUnique({ where: { id } });
    if (!request) throw ApiError.notFound();
    if (request.status !== 'PENDING') throw ApiError.badRequest('This request has already been reviewed');

    await tx.alumniRegistrationRequest.update({
      where: { id },
      data: { status: 'APPROVED', reviewNote: note, reviewedById: reviewer.id, reviewedAt: new Date() },
    });

    const existing = await tx.alumniProfile.findUnique({ where: { userId: request.userId } });
    const profile = existing
      ? await tx.alumniProfile.update({ where: { id: existing.id }, data: { verificationStatus: 'VERIFIED', archivedAt: null } })
      : await tx.alumniProfile.create({
          data: {
            userId: request.userId,
            slug: await uniqueProfileSlug(tx, request.fullName),
            displayName: request.fullName,
            graduationYear: request.graduationYear,
            courseId: request.courseId,
            cohortId: request.cohortId,
            studentProfileId: request.matchedStudentId,
            verificationStatus: 'VERIFIED',
          },
        });

    const alumniRole = await tx.role.findUniqueOrThrow({ where: { key: 'ALUMNI' } });
    await tx.userRole.upsert({
      where: { userId_roleId: { userId: request.userId, roleId: alumniRole.id } },
      update: {},
      create: { userId: request.userId, roleId: alumniRole.id },
    });
    await audit(req, { action: 'alumni.registration_approve', entityType: 'AlumniRegistrationRequest', entityId: id, metadata: { profileId: profile.id } }, tx);
    return profile;
  });
  ok(res, { requestId: id, profileId: profile.id, status: 'APPROVED' });
}

export async function rejectRegistration(req: Request, res: Response) {
  const id = idParam(req);
  const { note } = body(req, reviewDecisionSchema);
  const request = await prisma.alumniRegistrationRequest.findUnique({ where: { id } });
  if (!request) throw ApiError.notFound();
  if (request.status !== 'PENDING') throw ApiError.badRequest('This request has already been reviewed');
  await prisma.alumniRegistrationRequest.update({
    where: { id },
    data: { status: 'REJECTED', reviewNote: note, reviewedById: currentUser(req).id, reviewedAt: new Date() },
  });
  await audit(req, { action: 'alumni.registration_reject', entityType: 'AlumniRegistrationRequest', entityId: id });
  ok(res, { requestId: id, status: 'REJECTED' });
}

// ---------------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------------
export async function listProfiles(req: Request, res: Response) {
  const p = parse(paginationSchema, req.query);
  const f = parse(profileFilterSchema, req.query);
  const where: Prisma.AlumniProfileWhereInput = {
    ...(f.verificationStatus ? { verificationStatus: f.verificationStatus } : {}),
    ...(f.publicationStatus ? { publicationStatus: f.publicationStatus } : {}),
    ...(f.archived === 'true' ? { archivedAt: { not: null } } : f.archived === 'false' ? { archivedAt: null } : {}),
    ...(p.q ? { OR: [{ displayName: { contains: p.q, mode: 'insensitive' } }, { user: { email: { contains: p.q, mode: 'insensitive' } } }] } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.alumniProfile.findMany({
      where,
      orderBy: orderBy(p, ['createdAt', 'displayName', 'graduationYear', 'updatedAt']),
      ...pageArgs(p),
      include: { user: { select: { email: true } }, cohort: { select: { name: true } } },
    }),
    prisma.alumniProfile.count({ where }),
  ]);
  ok(res, items, pageMeta(p, total));
}

export async function getProfile(req: Request, res: Response) {
  const profile = await prisma.alumniProfile.findUnique({
    where: { id: idParam(req) },
    include: { user: { select: { email: true, fullName: true } }, cohort: true, course: { select: { id: true, slug: true } }, stories: { select: { id: true, titleEn: true, status: true } } },
  });
  if (!profile) throw ApiError.notFound();
  ok(res, profile);
}

export async function updateProfile(req: Request, res: Response) {
  const id = idParam(req);
  const input = body(req, adminProfileUpdateSchema);
  const profile = await prisma.alumniProfile.update({ where: { id }, data: input });
  await audit(req, { action: 'alumni.profile_admin_update', entityType: 'AlumniProfile', entityId: id, metadata: { fields: Object.keys(input) } });
  ok(res, profile);
}

/** Approves publication (and any held changes). Requires verification and recorded consent. */
export async function approvePublication(req: Request, res: Response) {
  const id = idParam(req);
  const { note } = body(req, reviewDecisionSchema);
  const profile = await prisma.alumniProfile.findUnique({ where: { id } });
  if (!profile) throw ApiError.notFound();
  if (profile.verificationStatus !== 'VERIFIED') throw ApiError.badRequest('Only verified alumni can be published');
  if (!profile.isPublic || !profile.publicConsentAt) throw ApiError.badRequest('The alumnus has not consented to a public profile');
  const changes = (profile.pendingChanges as Record<string, unknown> | null) ?? {};
  const updated = await prisma.alumniProfile.update({
    where: { id },
    data: { ...changes, pendingChanges: Prisma.DbNull, publicationStatus: 'APPROVED', reviewNote: note },
  });
  await audit(req, { action: 'alumni.publication_approve', entityType: 'AlumniProfile', entityId: id, metadata: { appliedFields: Object.keys(changes) } });
  ok(res, updated);
}

export async function rejectPublication(req: Request, res: Response) {
  const id = idParam(req);
  const { note } = body(req, reviewDecisionSchema);
  const profile = await prisma.alumniProfile.findUnique({ where: { id } });
  if (!profile) throw ApiError.notFound();
  // Rejecting held edits to an already-published profile discards the edits but keeps it published.
  const keepPublished = profile.publicationStatus === 'APPROVED' && profile.pendingChanges !== null;
  const updated = await prisma.alumniProfile.update({
    where: { id },
    data: { pendingChanges: Prisma.DbNull, publicationStatus: keepPublished ? 'APPROVED' : 'REJECTED', reviewNote: note },
  });
  await audit(req, { action: 'alumni.publication_reject', entityType: 'AlumniProfile', entityId: id });
  ok(res, updated);
}

export const setArchived = (archived: boolean) => async (req: Request, res: Response) => {
  const id = idParam(req);
  const profile = await prisma.alumniProfile.update({ where: { id }, data: { archivedAt: archived ? new Date() : null } });
  await audit(req, { action: archived ? 'alumni.archive' : 'alumni.unarchive', entityType: 'AlumniProfile', entityId: id });
  ok(res, profile);
};

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------
export async function listStories(req: Request, res: Response) {
  const p = parse(paginationSchema, req.query);
  const f = parse(storyFilterSchema, req.query);
  const where: Prisma.AlumniStoryWhereInput = {
    ...(f.status ? { status: f.status } : {}),
    ...(p.q ? { OR: [{ titleEn: { contains: p.q, mode: 'insensitive' } }, { titleBn: { contains: p.q, mode: 'insensitive' } }] } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.alumniStory.findMany({
      where,
      orderBy: orderBy(p, ['createdAt', 'publishedAt', 'status']),
      ...pageArgs(p),
      include: { author: { select: { id: true, displayName: true, slug: true } } },
    }),
    prisma.alumniStory.count({ where }),
  ]);
  ok(res, items, pageMeta(p, total));
}

export async function updateStory(req: Request, res: Response) {
  const id = idParam(req);
  const input = body(req, adminStoryUpdateSchema);
  const story = await prisma.alumniStory.update({ where: { id }, data: input });
  await audit(req, { action: 'alumni.story_edit', entityType: 'AlumniStory', entityId: id, metadata: { fields: Object.keys(input) } });
  ok(res, story);
}

const storyTransitions = {
  publish: { from: ['SUBMITTED', 'REJECTED', 'ARCHIVED'], to: 'PUBLISHED' },
  reject: { from: ['SUBMITTED'], to: 'REJECTED' },
  archive: { from: ['PUBLISHED', 'SUBMITTED', 'REJECTED'], to: 'ARCHIVED' },
} as const;

export const storyAction = (action: keyof typeof storyTransitions) => async (req: Request, res: Response) => {
  const id = idParam(req);
  const { note } = body(req, reviewDecisionSchema);
  const story = await prisma.alumniStory.findUnique({ where: { id }, include: { author: true } });
  if (!story) throw ApiError.notFound();
  const rule = storyTransitions[action];
  if (!(rule.from as readonly string[]).includes(story.status)) throw ApiError.badRequest(`Cannot ${action} a story with status ${story.status}`);
  if (action === 'publish') {
    if (story.author.verificationStatus !== 'VERIFIED' || story.author.archivedAt) throw ApiError.badRequest('The author is not an active verified alumnus');
    if (!(story.titleEn && story.bodyEn) && !(story.titleBn && story.bodyBn)) throw ApiError.badRequest('A title and body are required');
  }
  const updated = await prisma.alumniStory.update({
    where: { id },
    data: { status: rule.to, reviewNote: note, ...(rule.to === 'PUBLISHED' ? { publishedAt: story.publishedAt ?? new Date() } : {}) },
  });
  await audit(req, { action: `alumni.story_${action}`, entityType: 'AlumniStory', entityId: id });
  ok(res, updated);
};
