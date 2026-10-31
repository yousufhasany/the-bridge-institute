import { describe, expect, it } from 'vitest';
import { resources } from '../../lib/i18n';
import { SECTIONS, type SectionField } from './sections';

function defaults(ns: string, path: string, lng: 'en' | 'bn') {
  const bundle = resources[lng][ns as keyof (typeof resources)['en']] as unknown as Record<string, unknown>;
  return path.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], bundle) as Record<string, unknown> | undefined;
}

function checkValue(field: Pick<SectionField, 'type' | 'itemFields'>, value: unknown, label: string) {
  if (field.type === 'text' || field.type === 'textarea') {
    expect(typeof value, label).toBe('string');
  } else if (field.type === 'list') {
    expect(Array.isArray(value) && value.every((v) => typeof v === 'string'), label).toBe(true);
  } else {
    expect(Array.isArray(value) && value.length > 0, label).toBe(true);
    for (const [i, item] of (value as Record<string, unknown>[]).entries()) {
      for (const sub of field.itemFields ?? []) checkValue(sub, item[sub.name], `${label}[${i}].${sub.name}`);
    }
  }
}

describe('CMS section definitions', () => {
  it('use unique keys', () => {
    expect(new Set(SECTIONS.map((s) => s.key)).size).toBe(SECTIONS.length);
  });

  it.each(SECTIONS.map((s) => [s.key, s] as const))('%s has default content for every field in both languages', (_key, section) => {
    for (const lng of ['en', 'bn'] as const) {
      const content = defaults(section.ns, section.path, lng);
      expect(content, `${lng} ${section.ns}:${section.path}`).toBeTypeOf('object');
      for (const field of section.fields) checkValue(field, content![field.name], `${lng} ${section.key}.${field.name}`);
    }
  });
});
