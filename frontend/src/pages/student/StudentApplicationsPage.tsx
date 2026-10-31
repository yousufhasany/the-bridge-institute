import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from '../../components/common/Badge';
import { ButtonLink } from '../../components/common/Button';
import { EmptyState, ErrorState, Spinner } from '../../components/common/States';
import { api } from '../../lib/api';
import { formatDate, formatDateTime } from '../../lib/format';

interface MyApplication {
  id: string;
  referenceCode: string;
  areaOfInterest: string;
  status: string;
  createdAt: string;
  history: { toStatus: string; createdAt: string }[];
}

export function StudentApplicationsPage() {
  const { t } = useTranslation('portal');
  const apps = useQuery({ queryKey: ['applications', 'mine'], queryFn: () => api.get<MyApplication[]>('/applications/mine') });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl">{t('student.applicationsTitle')}</h1>
      {apps.isLoading ? (
        <Spinner />
      ) : apps.isError ? (
        <ErrorState error={apps.error} onRetry={() => void apps.refetch()} />
      ) : apps.data?.length === 0 ? (
        <EmptyState title={t('student.applicationsEmpty')}>
          <ButtonLink to="/apply" className="mt-3">
            {t('student.applyCta')}
          </ButtonLink>
        </EmptyState>
      ) : (
        <ul className="space-y-4">
          {apps.data?.map((a) => (
            <li key={a.id} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-ink-500">
                    {t('student.reference')}: <span className="font-mono font-semibold text-navy-950">{a.referenceCode}</span>
                  </p>
                  <h2 className="mt-1 text-lg">{a.areaOfInterest}</h2>
                  <p className="text-sm text-ink-500">{t('student.submittedOn', { date: formatDate(a.createdAt) })}</p>
                </div>
                <StatusBadge status={a.status} label={t(`applicationStatus.${a.status}`)} />
              </div>
              {a.history.length > 0 && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-royal-700">{t('student.history')}</summary>
                  <ol className="mt-3 space-y-2 border-l-2 border-royal-100 pl-4 text-sm">
                    {a.history.map((h, i) => (
                      <li key={i}>
                        <span className="font-semibold text-navy-950">{t(`applicationStatus.${h.toStatus}`)}</span>
                        <span className="text-ink-500"> · {formatDateTime(h.createdAt)}</span>
                      </li>
                    ))}
                  </ol>
                </details>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
