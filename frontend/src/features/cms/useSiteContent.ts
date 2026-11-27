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
export const SITE_PHONE = '01348319375';
export const SITE_ADDRESS = '125 Motijheel C/A, 2nd Floor, Dhaka 1000\nBangladesh Institute of Islamic Finance (BIIF)';
export const SITE_FACEBOOK_URL = 'https://www.facebook.com/people/The-Bridge-Institute/61595249856998/';
export const SITE_INSTAGRAM_URL = 'https://www.instagram.com/careersbridging/';

const SAFE_URL = /^https?:\/\//i;

export function telHref(phone: string): string {
  const digits = phone.replace(/[^+0-9]/g, '');
  if (/^01\d{9}$/.test(digits)) return `tel:+880${digits.slice(1)}`;
  return `tel:${digits}`;
}

export function mapsHref(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.replace(/\s*\n\s*/g, ', '))}`;
}

function samePage(a: string, b: string): boolean {
  try {
    const left = new URL(a);
    const right = new URL(b);
    return left.origin === right.origin && left.pathname.replace(/\/+$/, '') === right.pathname.replace(/\/+$/, '');
  } catch {
    return a === b;
  }
}

/** Official pages, plus any extra links saved in the admin settings. */
export function useSocialLinks(): { label: string; url: string }[] {
  const { t } = useTranslation();
  const settings = usePublicSettings();
  const facebook = useSetting('social.facebookUrl', SITE_FACEBOOK_URL);
  const instagramSetting = useSetting('social.instagramUrl');
  const extras = ((settings.data?.['social.links'] as { label?: string; url?: string }[] | undefined) ?? []).flatMap((link) =>
    typeof link?.url === 'string' && typeof link.label === 'string' && SAFE_URL.test(link.url) ? [{ label: link.label, url: link.url }] : [],
  );
  const instagram = instagramSetting || extras.find((link) => /instagram\.com/i.test(link.url))?.url || SITE_INSTAGRAM_URL;
  const primary = [
    { label: t('qr.facebook'), url: facebook },
    { label: t('qr.instagram'), url: instagram },
  ].filter((link) => SAFE_URL.test(link.url));
  const rest = extras.filter((link) => !primary.some((item) => samePage(item.url, link.url)));
  return [...primary, ...rest];
}

export function useContactChannels() {
  const email = useSetting('contact.generalEmail', BROCHURE_EMAIL);
  const phone = useSetting('contact.phone', SITE_PHONE);
  const address = useSetting('contact.address', SITE_ADDRESS);
  const social = useSocialLinks();
  return { email, phone, address, social, tel: telHref(phone), maps: mapsHref(address) };
}
