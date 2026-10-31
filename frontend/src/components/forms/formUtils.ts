import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { z } from 'zod';
import { ApiError } from '../../lib/api';

/** Copies server-side field errors (VALIDATION_ERROR details) onto the form. Returns true if any were applied. */
export function applyServerErrors<T extends FieldValues>(error: unknown, setError: UseFormSetError<T>): boolean {
  if (!(error instanceof ApiError) || error.code !== 'VALIDATION_ERROR' || !Array.isArray(error.details)) return false;
  let applied = false;
  for (const issue of error.details) {
    if (issue.path) {
      setError(issue.path as Path<T>, { type: 'server', message: issue.message });
      applied = true;
    }
  }
  return applied;
}

/** Zod helpers emitting i18n message keys understood by `useFieldMessage`. */
export const v = {
  text: (max = 200) => z.string().trim().min(1, 'validation.required').max(max, `validation.max:${max}`),
  optionalText: (max = 200) => z.string().trim().max(max, `validation.max:${max}`),
  email: () => z.string().trim().min(1, 'validation.required').email('validation.email').max(254),
  optionalEmail: () => z.union([z.literal(''), z.string().trim().email('validation.email').max(254)]),
  phone: () => z.string().trim().min(1, 'validation.required').regex(/^[+0-9()\-\s]{6,30}$/, 'validation.phone'),
  optionalPhone: () => z.union([z.literal(''), z.string().trim().regex(/^[+0-9()\-\s]{6,30}$/, 'validation.phone')]),
  optionalUrl: () => z.union([z.literal(''), z.string().trim().regex(/^https?:\/\/\S+$/i, 'validation.url').max(500)]),
  password: () => z.string().min(10, 'validation.passwordMin').max(128, 'validation.max:128'),
  consent: () => z.boolean().refine((value) => value === true, 'validation.consent'),
};

/** Removes empty-string values so optional fields are omitted from API payloads. */
export function compact<T extends Record<string, unknown>>(values: T): Partial<T> {
  return Object.fromEntries(Object.entries(values).filter(([, value]) => value !== '' && value !== undefined)) as Partial<T>;
}
