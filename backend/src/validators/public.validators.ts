import { z } from 'zod';
import { email, optionalText, optionalUrl } from '../utils/http.js';

const consent = z.literal(true, { error: 'Consent is required' });

export const applicationSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email,
  phone: z
    .string()
    .trim()
    .min(6)
    .max(30)
    .regex(/^[+0-9 ()-]+$/, 'Invalid phone number'),
  currentStatus: z.enum(['graduate_seeking_employment', 'hsc_qualified', 'student', 'employed', 'other']),
  highestEducation: optionalText(120),
  /** Ignored. The programme is always all five foundation courses. */
  areaOfInterest: z.string().trim().max(120).optional(),
  motivation: z.string().trim().min(20).max(2000),
  preferredContact: z.enum(['email', 'phone', 'either']).optional().nullable(),
  locale: z.enum(['en', 'bn']).default('en'),
  privacyConsent: consent,
  idempotencyKey: z.string().uuid().optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email,
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5000),
  category: z.enum(['general', 'admission', 'partnership']).default('general'),
});

export const partnershipInquirySchema = z.object({
  organizationName: z.string().trim().min(2).max(160),
  contactName: z.string().trim().min(2).max(120),
  workEmail: email,
  phone: optionalText(30),
  website: optionalUrl,
  interest: z.enum([
    'skill_requirements',
    'training_collaboration',
    'guest_sessions_mentoring',
    'practical_projects',
    'workplace_learning',
    'internships',
    'employment',
    'reskilling_upskilling',
    'other',
  ]),
  message: z.string().trim().min(10).max(5000),
  consent,
});
