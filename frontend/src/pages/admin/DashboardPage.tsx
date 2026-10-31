import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { StatusBadge } from '../../components/common/Badge';
import { ErrorState, Spinner } from '../../components/common/States';
import { AdminHeader, StatCard } from '../../components/dashboard/AdminUi';
import { useAuth } from '../../features/auth/AuthProvider';
import { api } from '../../lib/api';
import { formatDate } from '../../lib/format';

interface Dashboard {
  counts: Record<string, number>;
  recentApplications: { id: string; referenceCode: string; fullName: string; status: string; createdAt: string }[];
}

/** Each stat is shown only to roles that work with that area. */
const GROUPS: { permission: string; keys: string[]; tone: 'blue' | 'orange' | 'navy' }[] = [
  { permission: 'applications.manage', keys: ['applications', 'pendingApplications'], tone: 'orange' },
  { permission: 'courses.manage', keys: ['publishedCourses'], tone: 'blue' },
  { permission: 'students.manage', keys: ['activeStudents'], tone: 'blue' },
  { permission: 'training.manage', keys: ['batches'], tone: 'blue' },
  { permission: 'training.teach', keys: ['batches'], tone: 'blue' },
  { permission: 'companies.manage', keys: ['partnershipInquiries', 'newInquiries'], tone: 'navy' },
  { permission: 'contact.manage', keys: ['unreadMessages'], tone: 'orange' },
  { permission: 'alumni.manage', keys: ['verifiedAlumni', 'pendingAlumniRegistrations', 'publicAlumniProfiles', 'storiesAwaitingReview', 'publishedStories'], tone: 'navy' },
];

export function DashboardPage() {
  const { t } = useTranslation('admin');
  const { can, user } = useAuth();
  const dashboard = useQuery({ queryKey: ['admin', 'dashboard'], queryFn: () => api.get<Dashboard>('/admin/dashboard') });

  if (dashboard.isLoading) return <Spinner />;
  if (dashboard.isError) return <ErrorState error={dashboard.error} onRetry={() => void dashboard.refetch()} />;
  const data = dashboard.data!;

  const shown = new Map<string, 'blue' | 'orange' | 'navy'>();
  for (const g of GROUPS) if (can(g.permission)) for (const k of g.keys) shown.set(k, g.tone);

  return (
    <div className="space-y-8">
      <AdminHeader title={t('dashboard.title')} description={`${user?.fullName} · ${t('dashboard.intro')}`} />
      {shown.size > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[...shown].map(([key, tone]) => (
            <StatCard key={key} label={t(`dashboard.counts.${key}`)} value={data.counts[key] ?? 0} tone={tone} />
          ))}
        </div>
      )}
      {can('applications.manage') && (
        <section className="card p-6" aria-labelledby="recent-title">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="recent-title" className="text-lg">
              {t('dashboard.recent')}
            </h2>
            <Link to="/admin/applications" className="text-sm font-semibold text-royal-700 hover:underline">
              {t('common:actions.viewAll')}
            </Link>
          </div>
          {data.recentApplications.length === 0 ? (
            <p className="text-sm text-ink-500">{t('dashboard.noRecent')}</p>
          ) : (
            <ul className="divide-y divide-mist-200">
              {data.recentApplications.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                  <span>
                    <span className="font-semibold text-navy-950">{a.fullName}</span> <span className="font-mono text-xs text-ink-500">{a.referenceCode}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-ink-500">{formatDate(a.createdAt)}</span>
                    <StatusBadge status={a.status} label={t(`status.${a.status}`)} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
