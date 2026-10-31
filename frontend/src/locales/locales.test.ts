import { describe, expect, it } from 'vitest';
import { resources } from '../lib/i18n';

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/** Flattens to `path -> value`; arrays contribute their length and their items. */
function flatten(node: Json, prefix = '', out = new Map<string, Json>()) {
  if (Array.isArray(node)) {
    out.set(`${prefix}[length]`, node.length);
    node.forEach((item, i) => flatten(item, `${prefix}[${i}]`, out));
  } else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) flatten(value, prefix ? `${prefix}.${key}` : key, out);
  } else {
    out.set(prefix, node);
  }
  return out;
}

const variables = (text: string) => [...text.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1]).sort();
/** Sentence fragments around a highlighted word; Bangla word order may leave one empty. */
const OPTIONAL_FRAGMENTS = /\.title(Before|After)$/;
const namespaces = Object.keys(resources.en) as (keyof typeof resources.en)[];

describe('locale files', () => {
  it.each(namespaces)('%s: English and Bangla have the same keys and list lengths', (ns) => {
    const en = flatten(resources.en[ns] as Json);
    const bn = flatten(resources.bn[ns] as Json);
    expect([...bn.keys()].filter((k) => !en.has(k))).toEqual([]);
    expect([...en.keys()].filter((k) => !bn.has(k))).toEqual([]);
    for (const [key, value] of en) {
      if (key.endsWith('[length]')) expect(bn.get(key), key).toBe(value);
    }
  });

  it.each(namespaces)('%s: interpolation variables match and no text is empty', (ns) => {
    const en = flatten(resources.en[ns] as Json);
    const bn = flatten(resources.bn[ns] as Json);
    for (const [key, value] of en) {
      if (typeof value !== 'string') continue;
      const other = bn.get(key);
      expect(typeof other, key).toBe('string');
      expect(variables(other as string), key).toEqual(variables(value));
      expect(value.trim().length, `en ${key}`).toBeGreaterThan(0);
      if (!OPTIONAL_FRAGMENTS.test(key)) expect((other as string).trim().length, `bn ${key}`).toBeGreaterThan(0);
    }
  });
});

describe('content guard', () => {
  const allText = (['en', 'bn'] as const).flatMap((lng) =>
    namespaces.flatMap((ns) => [...flatten(resources[lng][ns] as Json).entries()].filter(([, v]) => typeof v === 'string').map(([k, v]) => [`${lng}:${ns}:${k}`, v as string])),
  );

  it('contains no percentage statistics or salary figures', () => {
    const offenders = allText.filter(([, text]) => /\d\s*%|[৳$]\s*\d|\d+\s*(?:lakh|taka|টাকা)/i.test(text));
    expect(offenders).toEqual([]);
  });

  it('hard-codes no social media or QR destinations', () => {
    const offenders = allText.filter(([, text]) => /facebook\.com|fb\.me|linkedin\.com\/company|wa\.me|instagram\.com/i.test(text));
    expect(offenders).toEqual([]);
  });

  it('never promises guaranteed outcomes in English', () => {
    const offenders = allText.filter(([key, text]) => key.startsWith('en:') && /guarantee/i.test(text) && !/\b(not|no|never|without)\b[^.]*guarantee/i.test(text));
    expect(offenders).toEqual([]);
  });

  it('keeps the four-year roadmap', () => {
    for (const lng of ['en', 'bn'] as const) {
      expect((resources[lng].home as { roadmap: { years: unknown[] } }).roadmap.years).toHaveLength(4);
    }
  });
});
