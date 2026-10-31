import { prisma, Prisma } from '../lib/prisma.js';

export const courseInclude = {
  translations: true,
  topics: { orderBy: { sortOrder: 'asc' } },
  outcomes: { orderBy: { sortOrder: 'asc' } },
  category: true,
} satisfies Prisma.CourseInclude;

export type CourseWithRelations = Prisma.CourseGetPayload<{ include: typeof courseInclude }>;

/** Localised public view. Missing Bangla text falls back to English. */
export function localizeCourse(course: CourseWithRelations, locale: string) {
  const en = course.translations.find((t) => t.locale === 'en');
  const tr = course.translations.find((t) => t.locale === locale) ?? en;
  const pick = (enText: string, bnText: string | null) => (locale === 'bn' && bnText ? bnText : enText);
  return {
    id: course.id,
    slug: course.slug,
    icon: course.icon,
    sortOrder: course.sortOrder,
    locale: tr?.locale ?? 'en',
    title: tr?.title ?? '',
    summary: tr?.summary ?? '',
    description: tr?.description ?? '',
    duration: tr?.duration ?? en?.duration ?? null,
    category: course.category ? { slug: course.category.slug, name: pick(course.category.nameEn, course.category.nameBn) } : null,
    topics: course.topics.map((t) => pick(t.textEn, t.textBn)),
    outcomes: course.outcomes.map((o) => pick(o.textEn, o.textBn)),
  };
}

export const publishedCourses = () =>
  prisma.course.findMany({ where: { status: 'PUBLISHED' }, include: courseInclude, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });

/** Admin view keeps both languages side by side. */
export function adminCourse(course: CourseWithRelations) {
  const byLocale = (locale: string) => {
    const t = course.translations.find((x) => x.locale === locale);
    return t ? { title: t.title, summary: t.summary, description: t.description, duration: t.duration } : null;
  };
  return {
    id: course.id,
    slug: course.slug,
    icon: course.icon,
    status: course.status,
    sortOrder: course.sortOrder,
    categoryId: course.categoryId,
    category: course.category,
    publishedAt: course.publishedAt,
    updatedAt: course.updatedAt,
    translations: { en: byLocale('en'), bn: byLocale('bn') },
    topics: course.topics.map((t) => ({ en: t.textEn, bn: t.textBn })),
    outcomes: course.outcomes.map((o) => ({ en: o.textEn, bn: o.textBn })),
  };
}
