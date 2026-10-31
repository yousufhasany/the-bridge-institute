import type { Request, Response } from 'express';
import { P } from '../config/permissions.js';
import { prisma, Prisma } from '../lib/prisma.js';
import { currentUser, hasPermission } from '../middleware/auth.js';
import { audit } from '../services/audit.service.js';
import { referenceCode } from '../utils/crypto.js';
import { ApiError, body, created, idParam, noContent, ok, orderBy, pageArgs, pageMeta, paginationSchema, parse } from '../utils/http.js';
import {
  assessmentFilterSchema,
  assessmentSchema,
  assessmentUpdateSchema,
  attendanceQuerySchema,
  attendanceSaveSchema,
  batchFilterSchema,
  batchSchema,
  batchTeachersSchema,
  batchUpdateSchema,
  certificateActionSchema,
  certificateCreateSchema,
  certificateFilterSchema,
  enrollmentFilterSchema,
  enrollmentSchema,
  enrollmentUpdateSchema,
  resultsQuerySchema,
  resultsSaveSchema,
} from '../validators/admin.validators.js';

/**
 * Training managers see every batch. Teachers only see batches they are assigned to;
 * every batch-scoped handler calls this before reading or writing.
 */
async function assertBatchAccess(req: Request, batchId: string) {
  if (hasPermission(req, P.trainingManage)) return;
  if (!hasPermission(req, P.trainingTeach)) throw ApiError.forbidden();
  const assigned = await prisma.batchTeacher.count({ where: { batchId, userId: currentUser(req).id } });
  if (!assigned) throw ApiError.forbidden('You are not assigned to this batch');
}

const batchScope = (req: Request): Prisma.TrainingBatchWhereInput =>
  hasPermission(req, P.trainingManage) ? {} : { teachers: { some: { userId: currentUser(req).id } } };

const studentSummary = { select: { id: true, studentCode: true, user: { select: { fullName: true, email: true } } } } as const;

// ---------------------------------------------------------------------------
// Batches
// ---------------------------------------------------------------------------
export async function listBatches(req: Request, res: Response) {
  const p = parse(paginationSchema, req.query);
  const f = parse(batchFilterSchema, req.query);
  const where: Prisma.TrainingBatchWhereInput = {
    ...batchScope(req),
    ...(f.status ? { status: f.status } : {}),
    ...(f.courseId ? { courseId: f.courseId } : {}),
    ...(p.q ? { OR: [{ name: { contains: p.q, mode: 'insensitive' } }, { code: { contains: p.q, mode: 'insensitive' } }] } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.trainingBatch.findMany({
      where,
      orderBy: orderBy(p, ['createdAt', 'startDate', 'code', 'name']),
      ...pageArgs(p),
      include: {
        course: { select: { id: true, slug: true, translations: { where: { locale: 'en' }, select: { title: true } } } },
        teachers: { include: { user: { select: { id: true, fullName: true } } } },
        _count: { select: { enrollments: true } },
      },
    }),
    prisma.trainingBatch.count({ where }),
  ]);
  ok(res, items, pageMeta(p, total));
}

export async function getBatch(req: Request, res: Response) {
  const id = idParam(req);
  await assertBatchAccess(req, id);
  const batch = await prisma.trainingBatch.findUnique({
    where: { id },
    include: {
      course: { select: { id: true, slug: true, translations: { where: { locale: 'en' }, select: { title: true } } } },
      teachers: { include: { user: { select: { id: true, fullName: true, email: true } } } },
      enrollments: { include: { student: studentSummary }, orderBy: { enrolledAt: 'asc' } },
      assessments: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (!batch) throw ApiError.notFound();
  ok(res, batch);
}

export async function createBatch(req: Request, res: Response) {
  const input = body(req, batchSchema);
  if (input.startDate && input.endDate && input.endDate < input.startDate) throw ApiError.badRequest('End date must be after start date');
  const batch = await prisma.trainingBatch.create({ data: input });
  await audit(req, { action: 'batch.create', entityType: 'TrainingBatch', entityId: batch.id });
  created(res, batch);
}

export async function updateBatch(req: Request, res: Response) {
  const id = idParam(req);
  const input = body(req, batchUpdateSchema);
  const existing = await prisma.trainingBatch.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();
  const start = input.startDate !== undefined ? input.startDate : existing.startDate;
  const end = input.endDate !== undefined ? input.endDate : existing.endDate;
  if (start && end && end < start) throw ApiError.badRequest('End date must be after start date');
  const batch = await prisma.trainingBatch.update({ where: { id }, data: input });
  await audit(req, { action: 'batch.update', entityType: 'TrainingBatch', entityId: id, metadata: { fields: Object.keys(input) } });
  ok(res, batch);
}

export async function deleteBatch(req: Request, res: Response) {
  const id = idParam(req);
  const count = await prisma.enrollment.count({ where: { batchId: id } });
  if (count) throw ApiError.conflict('Batches with enrollments cannot be deleted. Cancel the batch instead.', 'IN_USE');
  await prisma.trainingBatch.delete({ where: { id } });
  await audit(req, { action: 'batch.delete', entityType: 'TrainingBatch', entityId: id });
  noContent(res);
}

export async function setTeachers(req: Request, res: Response) {
  const id = idParam(req);
  const { userIds } = body(req, batchTeachersSchema);
  const teachers = await prisma.user.count({
    where: { id: { in: userIds }, isActive: true, roles: { some: { role: { permissions: { some: { permission: { key: P.trainingTeach } } } } } } },
  });
  if (teachers !== new Set(userIds).size) throw ApiError.badRequest('Every assigned user must be an active teacher');
  await prisma.$transaction([
    prisma.batchTeacher.deleteMany({ where: { batchId: id } }),
    prisma.batchTeacher.createMany({ data: userIds.map((userId) => ({ batchId: id, userId })) }),
  ]);
  await audit(req, { action: 'batch.teachers', entityType: 'TrainingBatch', entityId: id, metadata: { userIds } });
  ok(res, { id, userIds });
}

export async function listTeachers(_req: Request, res: Response) {
  const users = await prisma.user.findMany({
    where: { isActive: true, roles: { some: { role: { permissions: { some: { permission: { key: P.trainingTeach } } } } } } },
    select: { id: true, fullName: true, email: true },
    orderBy: { fullName: 'asc' },
  });
  ok(res, users);
}

// ---------------------------------------------------------------------------
// Enrollments
// ---------------------------------------------------------------------------
export async function listEnrollments(req: Request, res: Response) {
  const p = parse(paginationSchema, req.query);
  const f = parse(enrollmentFilterSchema, req.query);
  if (f.batchId) await assertBatchAccess(req, f.batchId);
  else if (!hasPermission(req, P.trainingManage)) throw ApiError.badRequest('batchId is required');
  const where: Prisma.EnrollmentWhereInput = {
    ...(f.batchId ? { batchId: f.batchId } : {}),
    ...(f.studentId ? { studentId: f.studentId } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.enrollment.findMany({
      where,
      orderBy: orderBy(p, ['enrolledAt', 'progress', 'status'], 'enrolledAt'),
      ...pageArgs(p),
      include: { student: studentSummary, batch: { select: { id: true, code: true, name: true } }, certificate: { select: { id: true, status: true } } },
    }),
    prisma.enrollment.count({ where }),
  ]);
  ok(res, items, pageMeta(p, total));
}

export async function createEnrollment(req: Request, res: Response) {
  const input = body(req, enrollmentSchema);
  const [student, batch] = await Promise.all([
    prisma.studentProfile.findUnique({ where: { id: input.studentId } }),
    prisma.trainingBatch.findUnique({ where: { id: input.batchId }, include: { _count: { select: { enrollments: true } } } }),
  ]);
  if (!student || !batch) throw ApiError.badRequest('Student or batch not found');
  if (batch.status === 'CANCELLED' || batch.status === 'COMPLETED') throw ApiError.badRequest('This batch is not open for enrollment');
  if (batch.capacity && batch._count.enrollments >= batch.capacity) throw ApiError.conflict('This batch is full', 'BATCH_FULL');
  const enrollment = await prisma.enrollment.create({ data: input });
  await audit(req, { action: 'enrollment.create', entityType: 'Enrollment', entityId: enrollment.id });
  created(res, enrollment);
}

export async function updateEnrollment(req: Request, res: Response) {
  const id = idParam(req);
  const input = body(req, enrollmentUpdateSchema);
  const existing = await prisma.enrollment.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();
  await assertBatchAccess(req, existing.batchId);
  // Teachers may update progress only; status changes are a management action.
  if (input.status && !hasPermission(req, P.trainingManage)) throw ApiError.forbidden();
  const enrollment = await prisma.enrollment.update({
    where: { id },
    data: { ...input, ...(input.status === 'COMPLETED' ? { completedAt: new Date() } : {}) },
  });
  await audit(req, { action: 'enrollment.update', entityType: 'Enrollment', entityId: id, metadata: input });
  ok(res, enrollment);
}

// ---------------------------------------------------------------------------
// Attendance
// ---------------------------------------------------------------------------
const toDate = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

export async function getAttendance(req: Request, res: Response) {
  const q = parse(attendanceQuerySchema, req.query);
  await assertBatchAccess(req, q.batchId);
  const enrollments = await prisma.enrollment.findMany({
    where: { batchId: q.batchId, status: { not: 'WITHDRAWN' } },
    include: { student: studentSummary, attendance: { where: { date: toDate(q.date) } } },
    orderBy: { enrolledAt: 'asc' },
  });
  ok(
    res,
    enrollments.map((e) => ({ enrollmentId: e.id, student: e.student, record: e.attendance[0] ?? null })),
  );
}

export async function saveAttendance(req: Request, res: Response) {
  const input = body(req, attendanceSaveSchema);
  await assertBatchAccess(req, input.batchId);
  const valid = await prisma.enrollment.count({ where: { id: { in: input.records.map((r) => r.enrollmentId) }, batchId: input.batchId } });
  if (valid !== input.records.length) throw ApiError.badRequest('Every record must belong to this batch');
  const date = toDate(input.date);
  const recordedById = currentUser(req).id;
  await prisma.$transaction(
    input.records.map((r) =>
      prisma.attendance.upsert({
        where: { enrollmentId_date: { enrollmentId: r.enrollmentId, date } },
        update: { status: r.status, note: r.note, recordedById },
        create: { enrollmentId: r.enrollmentId, date, status: r.status, note: r.note, recordedById },
      }),
    ),
  );
  await audit(req, { action: 'attendance.save', entityType: 'TrainingBatch', entityId: input.batchId, metadata: { date: input.date, count: input.records.length } });
  ok(res, { saved: input.records.length });
}

// ---------------------------------------------------------------------------
// Assessments and results
// ---------------------------------------------------------------------------
export async function listAssessments(req: Request, res: Response) {
  const p = parse(paginationSchema, req.query);
  const f = parse(assessmentFilterSchema, req.query);
  if (f.batchId) await assertBatchAccess(req, f.batchId);
  const where: Prisma.AssessmentWhereInput = f.batchId ? { batchId: f.batchId } : { batch: batchScope(req) };
  const [items, total] = await Promise.all([
    prisma.assessment.findMany({
      where,
      orderBy: orderBy(p, ['createdAt', 'dueDate', 'title']),
      ...pageArgs(p),
      include: { batch: { select: { id: true, code: true, name: true } }, _count: { select: { results: true } } },
    }),
    prisma.assessment.count({ where }),
  ]);
  ok(res, items, pageMeta(p, total));
}

export async function createAssessment(req: Request, res: Response) {
  const input = body(req, assessmentSchema);
  await assertBatchAccess(req, input.batchId);
  const assessment = await prisma.assessment.create({ data: input });
  await audit(req, { action: 'assessment.create', entityType: 'Assessment', entityId: assessment.id });
  created(res, assessment);
}

async function loadAssessment(req: Request, id: string) {
  const assessment = await prisma.assessment.findUnique({ where: { id } });
  if (!assessment) throw ApiError.notFound();
  await assertBatchAccess(req, assessment.batchId);
  return assessment;
}

export async function updateAssessment(req: Request, res: Response) {
  const id = idParam(req);
  await loadAssessment(req, id);
  const input = body(req, assessmentUpdateSchema);
  const assessment = await prisma.assessment.update({ where: { id }, data: input });
  await audit(req, { action: 'assessment.update', entityType: 'Assessment', entityId: id });
  ok(res, assessment);
}

export async function deleteAssessment(req: Request, res: Response) {
  const id = idParam(req);
  await loadAssessment(req, id);
  await prisma.assessment.delete({ where: { id } });
  await audit(req, { action: 'assessment.delete', entityType: 'Assessment', entityId: id });
  noContent(res);
}

export async function getResults(req: Request, res: Response) {
  const q = parse(resultsQuerySchema, req.query);
  const assessment = await loadAssessment(req, q.assessmentId);
  const enrollments = await prisma.enrollment.findMany({
    where: { batchId: assessment.batchId, status: { not: 'WITHDRAWN' } },
    include: { student: studentSummary, results: { where: { assessmentId: assessment.id } } },
    orderBy: { enrolledAt: 'asc' },
  });
  ok(res, {
    assessment,
    rows: enrollments.map((e) => ({
      enrollmentId: e.id,
      student: e.student,
      result: e.results[0] ? { score: Number(e.results[0].score), feedback: e.results[0].feedback } : null,
    })),
  });
}

export async function saveResults(req: Request, res: Response) {
  const input = body(req, resultsSaveSchema);
  const assessment = await loadAssessment(req, input.assessmentId);
  if (input.records.some((r) => r.score > assessment.maxScore)) throw ApiError.badRequest(`Scores cannot exceed ${assessment.maxScore}`);
  const valid = await prisma.enrollment.count({ where: { id: { in: input.records.map((r) => r.enrollmentId) }, batchId: assessment.batchId } });
  if (valid !== input.records.length) throw ApiError.badRequest('Every record must belong to this assessment batch');
  const gradedById = currentUser(req).id;
  await prisma.$transaction(
    input.records.map((r) =>
      prisma.assessmentResult.upsert({
        where: { assessmentId_enrollmentId: { assessmentId: assessment.id, enrollmentId: r.enrollmentId } },
        update: { score: r.score, feedback: r.feedback, gradedById },
        create: { assessmentId: assessment.id, enrollmentId: r.enrollmentId, score: r.score, feedback: r.feedback, gradedById },
      }),
    ),
  );
  await audit(req, { action: 'results.save', entityType: 'Assessment', entityId: assessment.id, metadata: { count: input.records.length } });
  ok(res, { saved: input.records.length });
}

// ---------------------------------------------------------------------------
// Certificates: PENDING -> APPROVED -> ISSUED (or REVOKED). Never automatic.
// ---------------------------------------------------------------------------
export async function listCertificates(req: Request, res: Response) {
  const p = parse(paginationSchema, req.query);
  const f = parse(certificateFilterSchema, req.query);
  const where: Prisma.CertificateWhereInput = {
    ...(f.status ? { status: f.status } : {}),
    ...(p.q ? { certificateNo: { contains: p.q, mode: 'insensitive' } } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.certificate.findMany({
      where,
      orderBy: orderBy(p, ['createdAt', 'status', 'issuedAt']),
      ...pageArgs(p),
      include: {
        enrollment: { include: { student: studentSummary, batch: { select: { code: true, name: true } } } },
        approvedBy: { select: { fullName: true } },
      },
    }),
    prisma.certificate.count({ where }),
  ]);
  ok(res, items, pageMeta(p, total));
}

export async function createCertificate(req: Request, res: Response) {
  const input = body(req, certificateCreateSchema);
  const enrollment = await prisma.enrollment.findUnique({ where: { id: input.enrollmentId } });
  if (!enrollment) throw ApiError.badRequest('Enrollment not found');
  if (enrollment.status !== 'COMPLETED') throw ApiError.badRequest('Certificates can only be prepared for completed enrollments');
  const certificate = await prisma.certificate.create({
    data: { enrollmentId: enrollment.id, certificateNo: referenceCode('BIC'), notes: input.notes },
  });
  await audit(req, { action: 'certificate.create', entityType: 'Certificate', entityId: certificate.id });
  created(res, certificate);
}

const transitions: Record<string, { from: string[]; to: 'APPROVED' | 'ISSUED' | 'REVOKED' }> = {
  approve: { from: ['PENDING'], to: 'APPROVED' },
  issue: { from: ['APPROVED'], to: 'ISSUED' },
  revoke: { from: ['PENDING', 'APPROVED', 'ISSUED'], to: 'REVOKED' },
};

export const certificateAction = (action: keyof typeof transitions) => async (req: Request, res: Response) => {
  const id = idParam(req);
  const input = body(req, certificateActionSchema);
  const certificate = await prisma.certificate.findUnique({ where: { id } });
  if (!certificate) throw ApiError.notFound();
  const rule = transitions[action];
  if (!rule.from.includes(certificate.status)) throw ApiError.badRequest(`Cannot ${action} a certificate with status ${certificate.status}`);
  const now = new Date();
  const updated = await prisma.certificate.update({
    where: { id },
    data: {
      status: rule.to,
      ...(rule.to === 'APPROVED' ? { approvedById: currentUser(req).id, approvedAt: now } : {}),
      ...(rule.to === 'ISSUED' ? { issuedAt: now } : {}),
      ...(input.notes ? { notes: input.notes } : {}),
    },
  });
  await audit(req, { action: `certificate.${action}`, entityType: 'Certificate', entityId: id });
  ok(res, updated);
};
