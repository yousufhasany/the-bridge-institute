import { useQuery } from '@tanstack/react-query';
import { Building2, CalendarClock, ExternalLink, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Badge } from '../../components/common/Badge';
import { Alert, EmptyState, ErrorState, Spinner } from '../../components/common/States';
import { isVerifiedAlumni, useAlumniMe } from '../../features/alumni/useAlumniMe';
import { api } from '../../lib/api';
import { formatDate } from '../../lib/format';

interface Opportunity {
  id: string;
  title: string;
  type: string;
  description: string;
  location: string | null;
  applyUrl: string | null;
  deadline: string | null;
  company: { name: string; website: string | null } | null;
}

export function AlumniOpportunitiesPage() {
  const { t } = useTranslation('alumni');
  const me = useAlumniMe();
  const verified = isVerifiedAlumni(me.data);
  const items = useQuery({ queryKey: ['opportunities', 'available'], queryFn: () => api.get<Opportunity[]>('/opportunities/available'), enabled: verified });

  if (me.isLoading) return <Spinner />;
  if (!verified) {
    return (
      <Alert>
        {t('portal.requiresVerification')}{' '}
        <Link to="/alumni/dashboard" className="font-semibold underline">
          {t('portal.nav.dashboard')}
        </Link>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">{t('portal.opportunities.title')}</h1>
        <p className="mt-1 max-w-3xl text-sm text-ink-500">{t('portal.opportunities.intro')}</p>
      </div>
      {items.isLoading ? (
        <Spinner />
      ) : items.isError ? (
        <ErrorState error={items.error} onRetry={() => void items.refetch()} />
      ) : items.data?.length === 0 ? (
        <EmptyState title={t('portal.opportunities.empty')} />
      ) : (
        <ul className="grid gap-5 md:grid-cols-2">
          {items.data?.map((o) => (
            <li key={o.id} className="card flex flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg">{o.title}</h2>
                <Badge tone="blue">{t(`portal.opportunities.types.${o.type}`)}</Badge>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-500">
                {o.company && (
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="size-4" aria-hidden />
                    {o.company.name}
                  </span>
                )}
                {o.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-4" aria-hidden />
                    {o.location}
                  </span>
                )}
                {o.deadline && (
                  <span className="inline-flex items-center gap-1">
                    <CalendarClock className="size-4" aria-hidden />
                    {t('portal.opportunities.deadline', { date: formatDate(o.deadline) })}
                  </span>
                )}
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed whitespace-pre-line">{o.description}</p>
              {o.applyUrl && /^https?:\/\//i.test(o.applyUrl) && (
                <a href={o.applyUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-royal-700 hover:underline">
                  {t('portal.opportunities.apply')}
                  <ExternalLink className="size-4" aria-hidden />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
