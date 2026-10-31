import { randomBytes } from 'node:crypto';

export function slugify(input: string) {
  const base = input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return base || 'item';
}

/** Slug with a short random suffix to avoid collisions without extra queries. */
export const uniqueSlug = (input: string) => `${slugify(input)}-${randomBytes(3).toString('hex')}`;
