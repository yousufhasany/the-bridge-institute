import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';
import type { Faq, PublicSettings } from '../../types/api';
import { sectionByKey } from './sections';

export function usePublishedSections() {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'bn' ? 'bn' : 'en';
  return useQuery({
    queryKey: ['cms', 'sections', lang],
    queryFn: () => api.get<Record<string, Record<string, unknown>>>('/cms/sections', { locale: lang }),
    staleTime: 5 * 60_000,
  });
}

/**
 * Returns a section's content for the current language: built-in defaults with any
 * published CMS fields layered on top. Never blocks rendering on the network.
 */
export function useSection<T = Record<string, unknown>>(key: string): T {
  const { t } = useTranslation();
  const sections = usePublishedSections();
  const def = sectionByKey(key);
  if (!def) throw new Error(`Unknown CMS section: ${key}`);
  const defaults = t(def.path, { ns: def.ns, returnObjects: true }) as Record<string, unknown>;
  const overrides = sections.data?.[key] ?? {};
  const merged: Record<string, unknown> = { ...defaults };
  for (const [field, value] of Object.entries(overrides)) {
    if (value !== '' && value !== null && value !== undefined && !(Array.isArray(value) && value.length === 0)) merged[field] = value;
  }
  return merged as T;
}

export function usePublicSettings() {
  return useQuery({
    queryKey: ['settings', 'public'],
    queryFn: () => api.get<PublicSettings>('/settings/public'),
    staleTime: 5 * 60_000,
  });
}

/** A string setting, or the provided fallback while loading / when empty. */
export function useSetting(key: string, fallback = ''): string {
  const settings = usePublicSettings();
  const value = settings.data?.[key];
  return typeof value === 'string' && value ? value : fallback;
}

export function useFaqs() {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'bn' ? 'bn' : 'en';
  return useQuery({ queryKey: ['faqs', lang], queryFn: () => api.get<Faq[]>('/faqs', { locale: lang }) });
}

export const BROCHURE_EMAIL = 'thebridgeinstitute2026@gmail.com';
