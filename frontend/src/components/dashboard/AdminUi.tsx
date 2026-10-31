import { Search } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { PageMeta } from '../../lib/api';
import { cn } from '../../lib/cn';
import { Pagination } from '../common/Pagination';
import { EmptyState, ErrorState, Spinner } from '../common/States';
import { inputClasses } from '../forms/Field';

export function AdminHeader({ title, description, actions }: { title: ReactNode; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl">{title}</h1>
        {description && <p className="mt-1 max-w-3xl text-sm text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function SearchBox({ onSearch, initial = '' }: { onSearch: (q: string) => void; initial?: string }) {
  const { t } = useTranslation('admin');
  const [value, setValue] = useState(initial);
  return (
    <form
      role="search"
      className="relative min-w-56 flex-1"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value.trim());
      }}
    >
      <label className="sr-only" htmlFor="admin-search">
        {t('common:actions.search')}
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-500" aria-hidden />
      <input
        id="admin-search"
        type="search"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (e.target.value === '') onSearch('');
        }}
        placeholder={t('searchPlaceholder')}
        className={cn(inputClasses, 'py-2 pl-9')}
      />
    </form>
  );
}

export function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  const { t } = useTranslation('admin');
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-navy-950">
      <span className="whitespace-nowrap">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={cn(inputClasses, 'w-auto py-2')}>
        <option value="">{t('filterAll')}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="mb-4 flex flex-wrap items-center gap-3">{children}</div>;
}

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  isLoading,
  error,
  onRetry,
  meta,
  onPage,
  empty,
  onRowClick,
}: {
  columns: Column<T>[];
  rows: T[];
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  meta?: PageMeta;
  onPage?: (page: number) => void;
  empty?: ReactNode;
  onRowClick?: (row: T) => void;
}) {
  const { t } = useTranslation('admin');
  if (isLoading) return <Spinner />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (rows.length === 0) return <EmptyState title={empty ?? t('common.noResults')} />;
  return (
    <>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-mist-200 bg-mist-50 text-xs tracking-wide text-ink-500 uppercase">
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col" className={cn('px-4 py-3 font-semibold', c.className)}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-mist-200">
            {rows.map((row) => (
              <tr key={row.id} className={cn('align-top', onRowClick && 'cursor-pointer hover:bg-sky-50/60')} onClick={onRowClick ? () => onRowClick(row) : undefined}>
                {columns.map((c) => (
                  <td key={c.key} className={cn('px-4 py-3', c.className)}>
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {onPage && <Pagination meta={meta} onPage={onPage} />}
    </>
  );
}

export function StatCard({ label, value, tone = 'blue' }: { label: string; value: number | string; tone?: 'blue' | 'orange' | 'navy' }) {
  const tones = { blue: 'border-royal-600', orange: 'border-orange-500', navy: 'border-navy-950' };
  return (
    <div className={cn('card border-l-4 p-5', tones[tone])}>
      <p className="text-sm text-ink-500">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-navy-950">{value}</p>
    </div>
  );
}

export function DetailList({ items }: { items: { label: ReactNode; value: ReactNode }[] }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
      {items.map((item, i) => (
        <div key={i}>
          <dt className="text-xs font-semibold tracking-wide text-ink-500 uppercase">{item.label}</dt>
          <dd className="mt-0.5 break-words text-navy-950">{item.value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  );
}
