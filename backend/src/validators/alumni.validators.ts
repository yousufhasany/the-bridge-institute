import { z } from 'zod';
import { email, optionalText, optionalUrl } from '../utils/http.js';
import { password } from './auth.validators.js';

const year = z.coerce.number().int().min(2000).max(2100).optional().nullable().transform((v) => v ?? null);
const optionalUuid = z.string().uuid().optional().nullable().transform((v) => v ?? null);
const tagList = z.array(z.string().trim().min(1).max(40)).max(20);

export const directoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(12),
  q: z.string().trim().max(100).optional(),
  cohort: z.string().max(80).optional(),
  course: z.string().max(80).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  field: z.string().max(80).optional(),
});

/** Registration for a visitor without an account (creates a basic account + request). */
export const alumniJoinSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email,
  password: password.optional(),
  graduationYear: year,
  courseId: optionalUuid,
  cohortId: optionalUuid,
  studentCode: optionalText(40),
  message: optionalText(2000),
});

/** Fields an alumnus may change. Public-facing ones go through review once published. */
export const alumniSelfUpdateSchema = z
  .object({
    displayName: z.string().trim().min(2).max(120),
    professionalTitle: optionalText(160),
    organization: optionalText(160),
    professionalField: optionalText(120),
    skills: tagList,
    interests: tagList,
    bioEn: optionalText(3000),
    bioBn: optionalText(3000),
    linkedinUrl: optionalUrl,
    portfolioUrl: optionalUrl,
    photoAssetId: optionalUuid,
    contactEmail: email.optional().nullable().transform((v) => v ?? null),
    contactPhone: optionalText(30),
  })
  .partial();

export const PUBLIC_PROFILE_FIELDS = [
  'displayName',
  'professionalTitle',
  'organization',
  'professionalField',
  'skills',
  'interests',
  'bioEn',
  'bioBn',
  'linkedinUrl',
  'portfolioUrl',
  'photoAssetId',
] as const;

export const visibilitySchema = z.object({
  isPublic: z.boolean(),
  consent: z.boolean().optional(),
});

export const storySubmitSchema = z
  .object({
    titleEn: optionalText(200),
    titleBn: optionalText(200),
    excerptEn: optionalText(500),
    excerptBn: optionalText(500),
    bodyEn: optionalText(20_000),
    bodyBn: optionalText(20_000),
    imageAssetId: optionalUuid,
  })
  .refine((s) => (s.titleEn && s.bodyEn) || (s.titleBn && s.bodyBn), {
    message: 'Provide a title and story in at least one language',
  });

export const assistanceSchema = z.object({
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5000),
});
