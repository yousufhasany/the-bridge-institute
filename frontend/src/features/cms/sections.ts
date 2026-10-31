/**
 * CMS-editable sections. Default text lives in the locale files; a published CMS entry for
 * a (section, language) pair overrides only the fields it contains.
 */
export type FieldType = 'text' | 'textarea' | 'list' | 'items';

export interface SectionField {
  name: string;
  type: FieldType;
  /** For `items`: the fields of each item. */
  itemFields?: { name: string; type: Exclude<FieldType, 'items'> }[];
}

export interface SectionDefinition {
  key: string;
  /** i18n namespace and key holding the default content. */
  ns: string;
  path: string;
  fields: SectionField[];
}

const t = (name: string): SectionField => ({ name, type: 'text' });
const ta = (name: string): SectionField => ({ name, type: 'textarea' });
const list = (name: string): SectionField => ({ name, type: 'list' });
const titleBody = (name: string): SectionField => ({ name, type: 'items', itemFields: [{ name: 'title', type: 'text' }, { name: 'body', type: 'textarea' }] });

export const SECTIONS: SectionDefinition[] = [
  { key: 'hero', ns: 'home', path: 'hero', fields: [t('eyebrow'), t('titleBefore'), t('titleHighlight'), t('titleAfter'), ta('description'), t('tagline'), t('ctaCourses'), t('ctaIndustryPartners'), t('ctaPartner'), t('ctaAdmission'), t('parent')] },
  { key: 'intro', ns: 'home', path: 'intro', fields: [t('title'), ta('lead'), ta('body'), t('skillsTitle'), list('skills'), ta('goalStatement')] },
  { key: 'goal', ns: 'home', path: 'goal', fields: [t('title'), ta('statement'), list('objectives')] },
  { key: 'why', ns: 'home', path: 'why', fields: [t('title'), t('subtitle'), ta('description'), titleBody('features')] },
  { key: 'courses', ns: 'home', path: 'courses', fields: [t('title'), ta('subtitle'), t('viewAll')] },
  {
    key: 'roadmap',
    ns: 'home',
    path: 'roadmap',
    fields: [
      t('title'),
      t('subtitle'),
      ta('intro'),
      { name: 'years', type: 'items', itemFields: [{ name: 'label', type: 'text' }, { name: 'title', type: 'text' }, { name: 'body', type: 'textarea' }, { name: 'highlights', type: 'list' }] },
    ],
  },
  { key: 'pathway', ns: 'home', path: 'pathway', fields: [t('title'), t('subtitle'), titleBody('steps'), t('partnersTitle'), ta('partnersBody'), ta('disclaimer')] },
  { key: 'eligibility', ns: 'home', path: 'eligibility', fields: [t('title'), ta('statement'), titleBody('groups'), t('cta')] },
  { key: 'partners', ns: 'home', path: 'partners', fields: [t('title'), t('subtitle'), ta('body'), t('cta')] },
  { key: 'contact', ns: 'home', path: 'contact', fields: [t('title'), ta('body')] },
  { key: 'about', ns: 'pages', path: 'about', fields: [t('title'), ta('intro'), ta('mission'), ta('vision'), ta('philosophy'), ta('approach'), ta('alignment')] },
  { key: 'journey', ns: 'pages', path: 'journey', fields: [t('title'), ta('intro'), titleBody('stages'), ta('note')] },
  { key: 'companies', ns: 'pages', path: 'companies', fields: [t('title'), t('subtitle'), ta('body'), t('partnerTitle'), t('partnerLead'), ta('partnerBody'), t('areasTitle'), list('areas'), t('formTitle'), ta('formIntro')] },
  { key: 'alumniIntro', ns: 'alumni', path: 'public', fields: [t('title'), ta('description')] },
  { key: 'footer', ns: 'common', path: 'footer', fields: [ta('about')] },
  { key: 'privacy', ns: 'pages', path: 'privacy', fields: [t('title'), ta('body')] },
  { key: 'terms', ns: 'pages', path: 'terms', fields: [t('title'), ta('body')] },
];

export const sectionByKey = (key: string) => SECTIONS.find((s) => s.key === key);
