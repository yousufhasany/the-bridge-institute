import type { Request, Response } from 'express';
import { prisma, Prisma } from '../lib/prisma.js';
import { currentUser } from '../middleware/auth.js';
import { audit } from '../services/audit.service.js';
import { ApiError, body, idParam, ok, orderBy, pageArgs, pageMeta, paginationSchema, parse } from '../utils/http.js';
import { studentFilterSchema, studentSelfUpdateSchema, studentUpdateSchema } from '../validators/admin.validators.js';

const courseTitle = { translations: { where: { locale: 'en' }, select: { title: true } } } satisfies Prisma.CourseSelect;

/** The signed-in student's own records only. Returns null when the user has no student record. */
export async function me(req: Request, res: Response) {
  const auth = currentUser(req);
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: auth.id },
    include: {
      enrollments: {
        orderBy: { enrolledAt: 'desc' },
        include: {
          batch: { include: { course: { select: { id: true, slug: true, ...courseTitle } } } },
          attendance: { orderBy: { date: 'desc' }, select: { date: true, status: true } },
          results: { include: { assessment: { select: { title: true, type: true, maxScore: true, dueDate: true } } } },
          certificate: { select: { certificateNo: true, status: true, issuedAt: true } },
        },
      },
    },
  });
  if (!profile) return ok(res, null);

  const courseIds = profile.enrollments.map((e) => e.batch.courseId).filter((id): id is string => Boolean(id));
  const materials = courseIds.length
    ? await prisma.learningMaterial.findMany({
        where: { courseId: { in: courseIds }, isPublished: true },
        orderBy: [{ courseId: 'asc' }, { sortOrder: 'asc' }],
        select: { id: true, courseId: true, title: true, description: true, url: true },
      })
    : [];

  ok(res, {
    id: profile.id,
    studentCode: profile.studentCode,
    status: profile.status,
    educationLevel: profile.educationLevel,
    currentStatus: profile.currentStatus,
    enrollments: profile.enrollments.map((e) => ({
      id: e.id,
      status: e.status,
      progress: e.progress,
      enrolledAt: e.enrolledAt,
      batch: { code: e.batch.code, name: e.batch.name, startDate: e.batch.startDate, endDate: e.batch.endDate, status: e.batch.status },
      course: e.batch.course ? { id: e.batch.course.id, slug: e.batch.course.slug, title: e.batch.course.translations[0]?.title ?? '' } : null,
      attendance: {
        total: e.attendance.length,
        present: e.attendance.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length,
        recent: e.attendance.slice(0, 10),
      },
      results: e.results.map((r) => ({ assessment: r.assessment, score: Number(r.score), feedback: r.feedback })),
      certificate: e.certificate?.status === 'ISSUED' ? e.certificate : null,
    })),
    materials,
  });
}

export async function updateMe(req: Request, res: Response) {
  const auth = currentUser(req);
  const input = body(req, studentSelfUpdateSchema);
  const profile = await prisma.studentProfile.findUnique({ where: { userId: auth.id } });
  if (!profile) throw ApiError.notFound('No student record');
  await prisma.studentProfile.update({ where: { id: profile.id }, data: input });
  ok(res, { updated: true });
}

const studentInclude = {
  user: { select: { id: true, fullName: true, email: true, phone: true } },
  _count: { select: { enrollments: true } },
} satisfies Prisma.StudentProfileInclude;

export async function list(req: Request, res: Response) {
  const p = parse(paginationSchema, req.query);
  const f = parse(studentFilterSchema, req.query);
  const where: Prisma.StudentProfileWhereInput = {
    ...(f.status ? { status: f.status } : {}),
    ...(p.q
      ? {
          OR: [
            { studentCode: { contains: p.q, mode: 'insensitive' } },
            { user: { fullName: { contains: p.q, mode: 'insensitive' } } },
            { user: { email: { contains: p.q, mode: 'insensitive' } } },
          ],
        }
      : {}),
  };
  const [items, total] = await Promise.all([
    prisma.studentProfile.findMany({ where, include: studentInclude, orderBy: orderBy(p, ['createdAt', 'studentCode', 'status']), ...pageArgs(p) }),
    prisma.studentProfile.count({ where }),
  ]);
  ok(res, items, pageMeta(p, total));
}

export async function get(req: Request, res: Response) {
  const student = await prisma.studentProfile.findUnique({
    where: { id: idParam(req) },
    include: {
      ...studentInclude,
      enrollments: { include: { batch: { select: { id: true, code: true, name: true } }, certificate: true } },
      sourceApplication: { select: { id: true, referenceCode: true } },
    },
  });
  if (!student) throw ApiError.notFound();
  ok(res, student);
}

export async function update(req: Request, res: Response) {
  const id = idParam(req);
  const input = body(req, studentUpdateSchema);
  const student = await prisma.studentProfile.update({
    where: { id },
    data: { ...input, ...(input.status === 'GRADUATED' ? { graduatedAt: new Date() } : {}) },
    include: studentInclude,
  });
  await audit(req, { action: 'student.update', entityType: 'StudentProfile', entityId: id, metadata: { fields: Object.keys(input) } });
  ok(res, student);
}
