import type { Request, Response } from 'express';
import { prisma, Prisma } from '../lib/prisma.js';
import { currentUser } from '../middleware/auth.js';
import { audit } from '../services/audit.service.js';
import { sendEmail } from '../services/email.service.js';
import { inviteUser } from '../services/user.service.js';
import { referenceCode } from '../utils/crypto.js';
import { ApiError, body, created, idParam, ok, orderBy, pageArgs, pageMeta, paginationSchema, parse } from '../utils/http.js';
import { applicationFilterSchema, applicationStatusSchema, noteSchema } from '../validators/admin.validators.js';
import { applicationSchema } from '../validators/public.validators.js';

const DUPLICATE_WINDOW_MS = 24 * 3600_000;
/** Every applicant takes the same five foundation courses. Applicants do not choose one. */
const FOUNDATION_PROGRAMME = 'All five foundation courses';

/** Public submission. Never enrolls the applicant automatically. */
export async function submit(req: Request, res: Response) {
  const input = body(req, applicationSchema);

  if (input.idempotencyKey) {
    const replay = await prisma.studentApplication.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
    if (replay) return ok(res, { referenceCode: replay.referenceCode, createdAt: replay.createdAt, duplicate: true });
  }

  const recent = await prisma.studentApplication.findFirst({
    where: {
      email: input.email,
      areaOfInterest: { equals: FOUNDATION_PROGRAMME, mode: 'insensitive' },
      status: { in: ['SUBMITTED', 'UNDER_REVIEW'] },
      createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
    },
  });
  if (recent) {
    throw ApiError.conflict('An application with this email was already submitted recently and is awaiting review.', 'DUPLICATE_APPLICATION');
  }

  const application = await prisma.$transaction(async (tx) => {
    const app = await tx.studentApplication.create({
      data: {
        referenceCode: referenceCode('BI'),
        idempotencyKey: input.idempotencyKey,
        userId: req.auth?.id,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        currentStatus: input.currentStatus,
        highestEducation: input.highestEducation,
        areaOfInterest: FOUNDATION_PROGRAMME,
        motivation: input.motivation,
        preferredContact: input.preferredContact ?? null,
        locale: input.locale,
        consentAt: new Date(),
      },
    });
    await tx.applicationStatusHistory.create({ data: { applicationId: app.id, toStatus: 'SUBMITTED' } });
    return app;
  });

  await sendEmail({
    to: application.email,
    subject: `Application received (${application.referenceCode}) - The Bridge Institute`,
    text: `Dear ${application.fullName},\n\nThank you for applying to The Bridge Institute. Your application reference is ${application.referenceCode}. Our admissions team will review it and contact you.\n\nSubmitting an application does not confirm admission or enrolment.`,
  });

  created(res, { referenceCode: application.referenceCode, createdAt: application.createdAt });
}

/** Applicant's own applications. Internal notes and staff identities are never included. */
export async function mine(req: Request, res: Response) {
  const auth = currentUser(req);
  const items = await prisma.studentApplication.findMany({
    where: { userId: auth.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      referenceCode: true,
      areaOfInterest: true,
      currentStatus: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      history: { select: { toStatus: true, createdAt: true }, orderBy: { createdAt: 'asc' } },
    },
  });
  ok(res, items);
}

// ---------------------------------------------------------------------------
// Admissions staff (applications.manage)
// ---------------------------------------------------------------------------
export async function list(req: Request, res: Response) {
  const p = parse(paginationSchema, req.query);
  const f = parse(applicationFilterSchema, req.query);
  const where: Prisma.StudentApplicationWhereInput = {
    ...(f.status ? { status: f.status } : {}),
    ...(p.q
      ? {
          OR: [
            { fullName: { contains: p.q, mode: 'insensitive' } },
            { email: { contains: p.q, mode: 'insensitive' } },
            { referenceCode: { contains: p.q, mode: 'insensitive' } },
          ],
        }
      : {}),
  };
  const [items, total] = await Promise.all([
    prisma.studentApplication.findMany({
      where,
      orderBy: orderBy(p, ['createdAt', 'status', 'fullName', 'updatedAt']),
      ...pageArgs(p),
      select: { id: true, referenceCode: true, fullName: true, email: true, phone: true, areaOfInterest: true, currentStatus: true, status: true, createdAt: true },
    }),
    prisma.studentApplication.count({ where }),
  ]);
  ok(res, items, pageMeta(p, total));
}

export async function get(req: Request, res: Response) {
  const application = await prisma.studentApplication.findUnique({
    where: { id: idParam(req) },
    include: {
      history: { orderBy: { createdAt: 'asc' }, include: { changedBy: { select: { id: true, fullName: true } } } },
      notes: { orderBy: { createdAt: 'desc' }, include: { author: { select: { id: true, fullName: true } } } },
      studentProfile: { select: { id: true, studentCode: true } },
    },
  });
  if (!application) throw ApiError.notFound();
  const { idempotencyKey: _ignored, ...rest } = application;
  void _ignored;
  ok(res, rest);
}

export async function updateStatus(req: Request, res: Response) {
  const id = idParam(req);
  const input = body(req, applicationStatusSchema);
  const auth = currentUser(req);
  const result = await prisma.$transaction(async (tx) => {
    const current = await tx.studentApplication.findUnique({ where: { id } });
    if (!current) throw ApiError.notFound();
    if (current.status === input.status) throw ApiError.badRequest('Application already has this status');
    const updated = await tx.studentApplication.update({ where: { id }, data: { status: input.status } });
    await tx.applicationStatusHistory.create({
      data: { applicationId: id, fromStatus: current.status, toStatus: input.status, changedById: auth.id, note: input.note },
    });
    await audit(req, { action: 'application.status', entityType: 'StudentApplication', entityId: id, metadata: { from: current.status, to: input.status } }, tx);
    return updated;
  });
  ok(res, { id: result.id, status: result.status });
}

export async function addNote(req: Request, res: Response) {
  const id = idParam(req);
  const input = body(req, noteSchema);
  const exists = await prisma.studentApplication.count({ where: { id } });
  if (!exists) throw ApiError.notFound();
  const note = await prisma.applicationInternalNote.create({
    data: { applicationId: id, authorId: currentUser(req).id, body: input.body },
    include: { author: { select: { id: true, fullName: true } } },
  });
  await audit(req, { action: 'application.note', entityType: 'StudentApplication', entityId: id });
  created(res, note);
}

async function nextStudentCode(tx: Prisma.TransactionClient) {
  const year = new Date().getUTCFullYear();
  const count = await tx.studentProfile.count({ where: { studentCode: { startsWith: `BIS-${year}-` } } });
  return `BIS-${year}-${String(count + 1).padStart(4, '0')}`;
}

/**
 * Converts an ACCEPTED application into a student record. Creates (or reuses) the user
 * account, grants the STUDENT role and sends an invitation if the account has no password.
 */
export async function onboard(req: Request, res: Response) {
  const id = idParam(req);
  const { user, profile } = await prisma.$transaction(async (tx) => {
    const app = await tx.studentApplication.findUnique({ where: { id }, include: { studentProfile: true } });
    if (!app) throw ApiError.notFound();
    if (app.status !== 'ACCEPTED') throw ApiError.badRequest('Only accepted applications can be onboarded');
    if (app.studentProfile) throw ApiError.conflict('This application has already been onboarded');

    const user =
      (app.userId ? await tx.user.findUnique({ where: { id: app.userId } }) : null) ??
      (await tx.user.findUnique({ where: { email: app.email } })) ??
      (await tx.user.create({ data: { email: app.email, fullName: app.fullName, phone: app.phone, preferredLocale: app.locale } }));

    const existingProfile = await tx.studentProfile.findUnique({ where: { userId: user.id } });
    if (existingProfile) throw ApiError.conflict('This person already has a student record');

    const studentRole = await tx.role.findUniqueOrThrow({ where: { key: 'STUDENT' } });
    await tx.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: studentRole.id } },
      update: {},
      create: { userId: user.id, roleId: studentRole.id },
    });
    const profile = await tx.studentProfile.create({
      data: {
        userId: user.id,
        studentCode: await nextStudentCode(tx),
        educationLevel: app.highestEducation,
        currentStatus: app.currentStatus,
        sourceApplicationId: app.id,
      },
    });
    if (!app.userId) await tx.studentApplication.update({ where: { id }, data: { userId: user.id } });
    await audit(req, { action: 'application.onboard', entityType: 'StudentApplication', entityId: id, metadata: { studentId: profile.id } }, tx);
    return { user, profile };
  });

  const invite = user.passwordHash ? { emailSent: false, inviteUrl: null } : await inviteUser(user.id, user.email, user.fullName);
  created(res, { studentId: profile.id, studentCode: profile.studentCode, ...invite });
}
