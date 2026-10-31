import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PageMeta } from '../../lib/api';
import { Button } from './Button';

export function Pagination({ meta, onPage }: { meta?: PageMeta; onPage: (page: number) => void }) {
  const { t } = useTranslation();
  if (!meta || meta.totalPages <= 1) return null;
  return (
    <nav aria-label={t('pagination.label')} className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="text-ink-500">
        {t('pagination.results', { count: meta.total })} · {t('pagination.pageOf', { page: meta.page, total: meta.totalPages })}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={meta.page <= 1} onClick={() => onPage(meta.page - 1)} icon={<ChevronLeft className="size-4" aria-hidden />}>
          {t('actions.previous')}
        </Button>
        <Button variant="outline" size="sm" disabled={meta.page >= meta.totalPages} onClick={() => onPage(meta.page + 1)} className="flex-row-reverse">
          <ChevronRight className="size-4" aria-hidden />
          {t('actions.next')}
        </Button>
      </div>
    </nav>
  );
}
