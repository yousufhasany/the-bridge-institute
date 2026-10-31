import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { request } from '../../lib/api';

export interface ListParams {
  page: number;
  q: string;
  filters: Record<string, string>;
}

/** Paginated, searchable, filterable list backed by a standard `{ data, meta }` endpoint. */
export function useAdminList<T>(endpoint: string, options: { pageSize?: number; initialFilters?: Record<string, string>; sort?: string; order?: 'asc' | 'desc'; enabled?: boolean } = {}) {
  const [params, setParams] = useState<ListParams>({ page: 1, q: '', filters: options.initialFilters ?? {} });
  const query = useQuery({
    queryKey: ['admin', endpoint, params, options.sort, options.order],
    queryFn: () =>
      request<T[]>(endpoint, {
        query: { page: params.page, pageSize: options.pageSize ?? 20, q: params.q, sort: options.sort, order: options.order, ...params.filters },
      }),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
  return {
    ...query,
    params,
    rows: query.data?.data ?? [],
    meta: query.data?.meta,
    setPage: (page: number) => setParams((p) => ({ ...p, page })),
    setSearch: (q: string) => setParams((p) => ({ ...p, q, page: 1 })),
    setFilter: (name: string, value: string) => setParams((p) => ({ ...p, page: 1, filters: { ...p.filters, [name]: value } })),
  };
}
