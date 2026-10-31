import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePublicSettings } from '../features/cms/useSiteContent';

const SITE_URL = (import.meta.env.VITE_SITE_URL ?? '').replace(/\/+$/, '');

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

interface PageMeta {
  title?: string;
  description?: string;
  /** Private pages (portals, admin, auth) must never be indexed. */
  noIndex?: boolean;
}

export function usePageMeta({ title, description, noIndex }: PageMeta) {
  const { t, i18n } = useTranslation();
  const settings = usePublicSettings();
  const seo = settings.data?.['seo.defaults'] as Record<string, string> | undefined;
  const bn = i18n.language === 'bn';
  const brand = t('brand.name');
  const defaultTitle = (bn ? seo?.titleBn : seo?.titleEn) || `${brand} | ${t('brand.tagline')}`;
  const defaultDescription = (bn ? seo?.descriptionBn : seo?.descriptionEn) || t('brand.tagline');

  useEffect(() => {
    const fullTitle = title ? `${title} | ${brand}` : defaultTitle;
    const desc = description || defaultDescription;
    document.title = fullTitle;
    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:locale', bn ? 'bn_BD' : 'en_US');
    if (SITE_URL) setMeta('property', 'og:url', `${SITE_URL}${window.location.pathname}`);
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');
  }, [title, description, noIndex, brand, defaultTitle, defaultDescription, bn]);
}
