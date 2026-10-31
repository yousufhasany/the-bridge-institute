import { prisma, Prisma } from '../lib/prisma.js';
import { publicUrl } from './storage.service.js';

/**
 * The single definition of "publicly visible" alumni profile. Every public endpoint uses it:
 * verified, explicitly consented, publication approved and not archived.
 */
export const PUBLIC_PROFILE_WHERE = {
  verificationStatus: 'VERIFIED',
  isPublic: true,
  publicConsentAt: { not: null },
  publicationStatus: 'APPROVED',
  archivedAt: null,
} satisfies Prisma.AlumniProfileWhereInput;

export const publicProfileInclude = {
  cohort: { select: { slug: true, name: true, graduationYear: true } },
  course: { select: { slug: true, translations: { select: { locale: true, title: true } } } },
  photo: { select: { bucket: true, objectKey: true, visibility: true, altText: true } },
} satisfies Prisma.AlumniProfileInclude;

type PublicProfileRow = Prisma.AlumniProfileGetPayload<{ include: typeof publicProfileInclude }>;

const assetUrl = (asset: { bucket: string; objectKey: string; visibility: string } | null) =>
  asset && asset.visibility === 'PUBLIC' ? publicUrl(asset.bucket, asset.objectKey) : null;

/** Whitelisted public fields only. Contact details, user ids and review data are never included. */
export function toPublicProfile(p: PublicProfileRow, locale: string) {
  const courseTitle =
    p.course?.translations.find((t) => t.locale === locale)?.title ?? p.course?.translations.find((t) => t.locale === 'en')?.title ?? null;
  return {
    slug: p.slug,
    displayName: p.displayName,
    graduationYear: p.graduationYear ?? p.cohort?.graduationYear ?? null,
    cohort: p.cohort ? { slug: p.cohort.slug, name: p.cohort.name } : null,
    course: p.course ? { slug: p.course.slug, title: courseTitle } : null,
    programName: p.programName,
    professionalTitle: p.professionalTitle,
    organization: p.organization,
    professionalField: p.professionalField,
    skills: p.skills,
    interests: p.interests,
    bio: (locale === 'bn' ? p.bioBn || p.bioEn : p.bioEn || p.bioBn) ?? null,
    linkedinUrl: p.linkedinUrl,
    portfolioUrl: p.portfolioUrl,
    photoUrl: assetUrl(p.photo),
    photoAlt: p.photo?.altText ?? p.displayName,
  };
}

export const storyInclude = {
  author: {
    select: { verificationStatus: true, isPublic: true, publicConsentAt: true, publicationStatus: true, archivedAt: true, slug: true, displayName: true },
  },
  image: { select: { bucket: true, objectKey: true, visibility: true, altText: true } },
} satisfies Prisma.AlumniStoryInclude;

type StoryRow = Prisma.AlumniStoryGetPayload<{ include: typeof storyInclude }>;

export function isProfilePublic(a: StoryRow['author']) {
  return a.verificationStatus === 'VERIFIED' && a.isPublic && Boolean(a.publicConsentAt) && a.publicationStatus === 'APPROVED' && !a.archivedAt;
}

/** The author is only named/linked when their own profile is public. */
export function toPublicStory(s: StoryRow, locale: string, withBody: boolean) {
  const pick = (en: string | null, bn: string | null) => (locale === 'bn' ? bn || en : en || bn) ?? null;
  const authorPublic = isProfilePublic(s.author);
  return {
    slug: s.slug,
    title: pick(s.titleEn, s.titleBn),
    excerpt: pick(s.excerptEn, s.excerptBn),
    ...(withBody ? { body: pick(s.bodyEn, s.bodyBn) } : {}),
    publishedAt: s.publishedAt,
    imageUrl: assetUrl(s.image),
    imageAlt: s.image?.altText ?? null,
    author: authorPublic ? { displayName: s.author.displayName, slug: s.author.slug } : null,
  };
}

export async function directoryFilters(locale: string) {
  const profiles = await prisma.alumniProfile.findMany({
    where: PUBLIC_PROFILE_WHERE,
    select: { graduationYear: true, professionalField: true, cohort: { select: { slug: true, name: true } }, course: { select: { slug: true, translations: { select: { locale: true, title: true } } } } },
  });
  const years = new Set<number>();
  const fields = new Set<string>();
  const cohorts = new Map<string, string>();
  const courses = new Map<string, string>();
  for (const p of profiles) {
    if (p.graduationYear) years.add(p.graduationYear);
    if (p.professionalField) fields.add(p.professionalField);
    if (p.cohort) cohorts.set(p.cohort.slug, p.cohort.name);
    if (p.course) {
      const title = p.course.translations.find((t) => t.locale === locale)?.title ?? p.course.translations.find((t) => t.locale === 'en')?.title ?? p.course.slug;
      courses.set(p.course.slug, title);
    }
  }
  return {
    years: [...years].sort((a, b) => b - a),
    fields: [...fields].sort(),
    cohorts: [...cohorts].map(([slug, name]) => ({ slug, name })),
    courses: [...courses].map(([slug, title]) => ({ slug, title })),
  };
}
