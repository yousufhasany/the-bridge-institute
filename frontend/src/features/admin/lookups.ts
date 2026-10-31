import { useQuery } from '@tanstack/react-query';
import { api, request } from '../../lib/api';
import type { AdminCourse } from '../../types/api';

export interface Option {
  value: string;
  label: string;
}

function useOptions<T>(key: string, endpoint: string, map: (row: T) => Option, enabled = true) {
  return useQuery({
    queryKey: ['admin', 'lookup', key],
    queryFn: async () => (await request<T[]>(endpoint, { query: { pageSize: 100 } })).data.map(map),
    staleTime: 60_000,
    enabled,
  });
}

export const useCourseOptions = (enabled = true) =>
  useOptions<AdminCourse>('courses', '/courses/admin', (c) => ({ value: c.id, label: c.translations.en?.title ?? c.slug }), enabled);

export const useCategoryOptions = () => useOptions<{ id: string; nameEn: string }>('categories', '/course-categories', (c) => ({ value: c.id, label: c.nameEn }));

export const useCompanyOptions = () => useOptions<{ id: string; name: string }>('companies', '/companies', (c) => ({ value: c.id, label: c.name }));

export const useBatchOptions = () => useOptions<{ id: string; code: string; name: string }>('batches', '/batches', (b) => ({ value: b.id, label: `${b.code} · ${b.name}` }));

export const useCohortOptions = () => useOptions<{ id: string; name: string }>('cohorts', '/admin/alumni/cohorts', (c) => ({ value: c.id, label: c.name }));

export const useTeachers = (enabled = true) =>
  useQuery({ queryKey: ['admin', 'lookup', 'teachers'], queryFn: () => api.get<{ id: string; fullName: string; email: string }[]>('/batches/teachers'), enabled });
