import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';
import type { Course } from '../../types/api';

const useLang = () => (useTranslation().i18n.language === 'bn' ? 'bn' : 'en');

export function useCourses() {
  const lang = useLang();
  return useQuery({ queryKey: ['courses', lang], queryFn: () => api.get<Course[]>('/courses', { locale: lang }), staleTime: 5 * 60_000 });
}

export function useCourse(slug: string | undefined) {
  const lang = useLang();
  return useQuery({
    queryKey: ['courses', lang, slug],
    queryFn: () => api.get<Course>(`/courses/${encodeURIComponent(slug!)}`, { locale: lang }),
    enabled: Boolean(slug),
  });
}
