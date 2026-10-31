import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma, Prisma } from '../lib/prisma.js';
import { audit } from '../services/audit.service.js';
import { adminCourse, courseInclude, localizeCourse, publishedCourses } from '../services/course.service.js';
import { ApiError, body, created, idParam, noContent, ok, pageArgs, pageMeta, paginationSchema, parse } from '../utils/http.js';
import { slugify } from '../utils/slug.js';
import { courseSchema, courseStatusSchema, courseUpdateSchema, reorderSchema } from '../validators/admin.validators.js';

const localeQuery = z.object({ locale: z.enum(['en', 'bn']).default('en') });
const slugParam = z.object({ slug: z.string().regex(/^[a-z0-9-]{1,80}$/) });

export async function listPublic(req: Request, res: Response) {
  const { locale } = parse(localeQuery, req.query);
  const courses = await publishedCourses();
  res.set('Cache-Control', 'no-cache');
  ok(res, courses.map((c) => localizeCourse(c, locale)));
}

export async function getPublic(req: Request, res: Response) {
  const { locale } = parse(localeQuery, req.query);
  const params = slugParam.safeParse(req.params);
  if (!params.success) throw ApiError.notFound('Course not found');
  const course = await prisma.course.findFirst({ where: { slug: params.data.slug, status: 'PUBLISHED' }, include: courseInclude });
  if (!course) throw ApiError.notFound('Course not found');
  res.set('Cache-Control', 'no-cache');
  ok(res, localizeCourse(course, locale));
}

// ---------------------------------------------------------------------------
// Administration (courses.manage)
// ---------------------------------------------------------------------------
const adminFilter = z.object({ status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional() });

export async function adminList(req: Request, res: Response) {
  const p = parse(paginationSchema, req.query);
  const f = parse(adminFilter, req.query);
  const where: Prisma.CourseWhereInput = {
    ...(f.status ? { status: f.status } : {}),
    ...(p.q ? { translations: { some: { title: { contains: p.q, mode: 'insensitive' } } } } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.course.findMany({ where, include: courseInclude, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }], ...pageArgs(p) }),
    prisma.course.count({ where }),
  ]);
  ok(res, items.map(adminCourse), pageMeta(p, total));
}

export async function adminGet(req: Request, res: Response) {
  const course = await prisma.course.findUnique({ where: { id: idParam(req) }, include: courseInclude });
  if (!course) throw ApiError.notFound();
  ok(res, adminCourse(course));
}

const translationRows = (t: { title: string; summary: string; description: string; duration: string | null }) => ({
  title: t.title,
  summary: t.summary,
  description: t.description,
  duration: t.duration,
});

export async function adminCreate(req: Request, res: Response) {
  const input = body(req, courseSchema);
  const slug = input.slug ?? slugify(input.translations.en.title);
  const course = await prisma.course.create({
    data: {
      slug,
      icon: input.icon,
      categoryId: input.categoryId,
      sortOrder: input.sortOrder,
      status: 'DRAFT',
      translations: {
        create: [
          { locale: 'en', ...translationRows(input.translations.en) },
          ...(input.translations.bn ? [{ locale: 'bn', ...translationRows(input.translations.bn) }] : []),
        ],
      },
      topics: { create: input.topics.map((t, i) => ({ sortOrder: i, textEn: t.en, textBn: t.bn })) },
      outcomes: { create: input.outcomes.map((o, i) => ({ sortOrder: i, textEn: o.en, textBn: o.bn })) },
    },
    include: courseInclude,
  });
  await audit(req, { action: 'course.create', entityType: 'Course', entityId: course.id });
  created(res, adminCourse(course));
}

/** Each language is upserted independently, so editing English never overwrites Bangla. */
export async function adminUpdate(req: Request, res: Response) {
  const id = idParam(req);
  const input = body(req, courseUpdateSchema);
  const existing = await prisma.course.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();

  await prisma.$transaction(async (tx) => {
    await tx.course.update({
      where: { id },
      data: {
        ...(input.slug ? { slug: input.slug } : {}),
        ...(input.icon ? { icon: input.icon } : {}),
        ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
        ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
      },
    });
    for (const locale of ['en', 'bn'] as const) {
      const t = input.translations?.[locale];
      if (!t) continue;
      await tx.courseTranslation.upsert({
        where: { courseId_locale: { courseId: id, locale } },
        update: translationRows(t),
        create: { courseId: id, locale, ...translationRows(t) },
      });
    }
    if (input.topics) {
      await tx.courseTopic.deleteMany({ where: { courseId: id } });
      await tx.courseTopic.createMany({ data: input.topics.map((t, i) => ({ courseId: id, sortOrder: i, textEn: t.en, textBn: t.bn })) });
    }
    if (input.outcomes) {
      await tx.learningOutcome.deleteMany({ where: { courseId: id } });
      await tx.learningOutcome.createMany({ data: input.outcomes.map((o, i) => ({ courseId: id, sortOrder: i, textEn: o.en, textBn: o.bn })) });
    }
    await audit(req, { action: 'course.update', entityType: 'Course', entityId: id, metadata: { fields: Object.keys(input) } }, tx);
  });
  const course = await prisma.course.findUniqueOrThrow({ where: { id }, include: courseInclude });
  ok(res, adminCourse(course));
}

export async function adminSetStatus(req: Request, res: Response) {
  const id = idParam(req);
  const { status } = body(req, courseStatusSchema);
  const existing = await prisma.course.findUnique({ where: { id }, include: { translations: true } });
  if (!existing) throw ApiError.notFound();
  if (status === 'PUBLISHED' && !existing.translations.some((t) => t.locale === 'en')) {
    throw ApiError.badRequest('An English translation is required before publishing');
  }
  const course = await prisma.course.update({
    where: { id },
    data: { status, publishedAt: status === 'PUBLISHED' ? existing.publishedAt ?? new Date() : existing.publishedAt },
    include: courseInclude,
  });
  await audit(req, { action: `course.status.${status.toLowerCase()}`, entityType: 'Course', entityId: id });
  ok(res, adminCourse(course));
}

export async function adminReorder(req: Request, res: Response) {
  const { ids } = body(req, reorderSchema);
  await prisma.$transaction(ids.map((id, index) => prisma.course.update({ where: { id }, data: { sortOrder: index } })));
  await audit(req, { action: 'course.reorder', entityType: 'Course', metadata: { ids } });
  ok(res, { reordered: ids.length });
}

/** Only unused drafts may be deleted; everything else is archived to preserve history. */
export async function adminDelete(req: Request, res: Response) {
  const id = idParam(req);
  const course = await prisma.course.findUnique({ where: { id }, include: { _count: { select: { batches: true, alumni: true, cohorts: true } } } });
  if (!course) throw ApiError.notFound();
  if (course.status !== 'DRAFT' || course._count.batches || course._count.alumni || course._count.cohorts) {
    throw ApiError.conflict('Only unused draft courses can be deleted. Archive this course instead.', 'IN_USE');
  }
  await prisma.course.delete({ where: { id } });
  await audit(req, { action: 'course.delete', entityType: 'Course', entityId: id });
  noContent(res);
}
