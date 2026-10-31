import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ErrorState, Spinner } from '../../../components/common/States';
import { AdminHeader, StatCard } from '../../../components/dashboard/AdminUi';
import { api } from '../../../lib/api';

interface Overview {
  verified: number;
  pendingRegistrations: number;
  publicProfiles: number;
  pendingPublication: number;
  storiesAwaitingReview: number;
  publishedStories: number;
  cohorts: number;
  announcements: number;
}

export function AlumniOverviewPage() {
  const { t } = useTranslation('admin');
  const overview = useQuery({ queryKey: ['admin', 'alumni-overview'], queryFn: () => api.get<Overview>('/admin/alumni/overview') });

  if (overview.isLoading) return <Spinner />;
  if (overview.isError || !overview.data) return <ErrorState error={overview.error} onRetry={() => void overview.refetch()} />;
  const o = overview.data;

  const cards: { to: string; label: string; value: number; tone: 'blue' | 'orange' | 'navy' }[] = [
    { to: '/admin/alumni/registrations', label: t('alumniAdmin.stats.pendingRegistrations'), value: o.pendingRegistrations, tone: 'orange' },
    { to: '/admin/alumni/profiles', label: t('alumniAdmin.stats.pendingPublication'), value: o.pendingPublication, tone: 'orange' },
    { to: '/admin/alumni/stories', label: t('alumniAdmin.stats.storiesAwaitingReview'), value: o.storiesAwaitingReview, tone: 'orange' },
    { to: '/admin/alumni/profiles', label: t('alumniAdmin.stats.verified'), value: o.verified, tone: 'navy' },
    { to: '/admin/alumni/profiles', label: t('alumniAdmin.stats.publicProfiles'), value: o.publicProfiles, tone: 'blue' },
    { to: '/admin/alumni/stories', label: t('alumniAdmin.stats.publishedStories'), value: o.publishedStories, tone: 'blue' },
    { to: '/admin/alumni/cohorts', label: t('alumniAdmin.stats.cohorts'), value: o.cohorts, tone: 'blue' },
    { to: '/admin/alumni/announcements', label: t('alumniAdmin.stats.announcements'), value: o.announcements, tone: 'blue' },
  ];

  return (
    <div>
      <AdminHeader title={t('alumniAdmin.title')} description={t('alumniAdmin.description')} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="rounded-2xl focus-visible:outline-2 focus-visible:outline-royal-600">
            <StatCard label={c.label} value={c.value} tone={c.tone} />
          </Link>
        ))}
      </div>
      <p className="mt-6 max-w-3xl text-sm text-ink-500">{t('alumniAdmin.privacyNote')}</p>
    </div>
  );
}
