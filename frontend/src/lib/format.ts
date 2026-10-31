import i18n from './i18n';

const locale = () => (i18n.language === 'bn' ? 'bn-BD' : 'en-GB');

export function formatDate(value: string | Date | null | undefined, style: 'medium' | 'long' = 'medium') {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString(locale(), { dateStyle: style });
}

export function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString(locale(), { dateStyle: 'medium', timeStyle: 'short' });
}

/** yyyy-mm-dd for <input type="date">. */
export const toDateInput = (value: string | null | undefined) => (value ? value.slice(0, 10) : '');
