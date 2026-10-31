import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enAdmin from '../locales/en/admin.json';
import enAlumni from '../locales/en/alumni.json';
import enCommon from '../locales/en/common.json';
import enHome from '../locales/en/home.json';
import enPages from '../locales/en/pages.json';
import enPortal from '../locales/en/portal.json';
import bnAdmin from '../locales/bn/admin.json';
import bnAlumni from '../locales/bn/alumni.json';
import bnCommon from '../locales/bn/common.json';
import bnHome from '../locales/bn/home.json';
import bnPages from '../locales/bn/pages.json';
import bnPortal from '../locales/bn/portal.json';

export const LANGUAGES = ['en', 'bn'] as const;
export type Language = (typeof LANGUAGES)[number];
export const LANGUAGE_STORAGE_KEY = 'bi-language';

export const resources = {
  en: { common: enCommon, home: enHome, pages: enPages, alumni: enAlumni, portal: enPortal, admin: enAdmin },
  bn: { common: bnCommon, home: bnHome, pages: bnPages, alumni: bnAlumni, portal: bnPortal, admin: bnAdmin },
} as const;

function initialLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'en' || stored === 'bn') return stored;
  } catch {
    // Storage may be unavailable (privacy mode); fall back to English.
  }
  return 'en';
}

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage(),
  fallbackLng: 'en',
  supportedLngs: LANGUAGES,
  ns: ['common', 'home', 'pages', 'alumni', 'portal', 'admin'],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
  returnNull: false,
});

const applyDocumentLanguage = (lng: string) => {
  document.documentElement.lang = lng;
};
applyDocumentLanguage(i18n.language);

i18n.on('languageChanged', (lng) => {
  applyDocumentLanguage(lng);
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  } catch {
    // ignore
  }
});

export const currentLanguage = (): Language => (i18n.language === 'bn' ? 'bn' : 'en');
export default i18n;
