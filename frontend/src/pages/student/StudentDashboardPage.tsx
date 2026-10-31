import { useQuery } from '@tanstack/react-query';
import { Award, BookOpen, CalendarCheck, ExternalLink, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from '../../components/common/Badge';
import { ButtonLink } from '../../components/common/Button';
import { EmptyState, ErrorState, Spinner } from '../../components/common/States';
import { useAuth } from '../../features/auth/AuthProvider';
import { api } from '../../lib/api';
import { formatDate } from '../../lib/format';

export interface StudentMe {
  id: string;
  studentCode: string;
  status: string;
  educationLevel: string | null;
  currentStatus: string | null;
  enrollments: {
    id: string;
    status: string;
    progress: number;
    enrolledAt: string;
    batch: { code: string; name: string; startDate: string | null; endDate: string | null; status: string };
    course: { id: string; slug: string; title: string } | null;
    attendance: { total: number; present: number; recent: { date: string; status: string }[] };
    results: { assessment: { title: string; type: string; maxScore: string | number; dueDate: string | null }; score: number; feedback: string | null }[];
    certificate: { certificateNo: string; status: string; issuedAt: string | null } | null;
  }[];
  materials: { id: string; courseId: string; title: string; description: string | null; url: string | null }[];
}

export const useStudentMe = () => useQuery({ queryKey: ['student', 'me'], queryFn: () => api.get<StudentMe | null>('/students/me') });

export function StudentDashboardPage() {
  const { t } = useTranslation(['portal', 'admin']);
  const { user } = useAuth();
  const me = useStudentMe();

  if (me.isLoading) return <Spinner />;
  if (me.isError) return <ErrorState error={me.error} onRetry={() => void me.refetch()} />;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl">{t('student.welcome', { name: user?.fullName })}</h1>
          {me.data && (
            <p className="mt-1 text-sm text-ink-500">
              {t('student.studentCode')}: <span className="font-mono font-semibold text-navy-950">{me.data.studentCode}</span>
            </p>
          )}
        </div>
        {me.data && <StatusBadge status={me.data.status} label={t(`admin:status.${me.data.status}`)} />}
      </div>

      {!me.data ? (
        <EmptyState title={t('student.noStudentRecord')}>
          <ButtonLink to="/apply" className="mt-3">
            {t('student.applyCta')}
          </ButtonLink>
        </EmptyState>
      ) : (
        <>
          <section aria-labelledby="enrollments-title">
            <h2 id="enrollments-title" className="mb-4 text-xl">
              {t('student.enrollments')}
            </h2>
            {me.data.enrollments.length === 0 ? (
              <EmptyState title={t('student.noEnrollments')} />
            ) : (
              <ul className="grid gap-5 lg:grid-cols-2">
                {me.data.enrollments.map((e) => (
                  <li key={e.id} className="card space-y-5 p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="flex items-center gap-2 text-sm text-ink-500">
                          <BookOpen className="size-4" aria-hidden />
                          {e.batch.code}
                        </p>
                        <h3 className="mt-1 text-lg">{e.course?.title ?? e.batch.name}</h3>
                        <p className="text-sm text-ink-500">
                          {formatDate(e.batch.startDate)} – {formatDate(e.batch.endDate)}
                        </p>
                      </div>
                      <StatusBadge status={e.status} label={t(`admin:status.${e.status}`)} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-semibold text-navy-950">
                        <span>{t('student.progress')}</span>
                        <span>{e.progress}%</span>
                      </div>
                      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-mist-50" role="progressbar" aria-valuenow={e.progress} aria-valuemin={0} aria-valuemax={100} aria-label={t('student.progress')}>
                        <div className="h-full rounded-full bg-royal-600" style={{ width: `${e.progress}%` }} />
                      </div>
                    </div>
                    <p className="flex items-center gap-2 text-sm">
                      <CalendarCheck className="size-4 text-royal-600" aria-hidden />
                      {t('student.attendance')}: {t('student.attendanceSummary', { present: e.attendance.present, total: e.attendance.total })}
                    </p>
                    <div>
                      <h4 className="text-sm font-bold text-navy-950">{t('student.results')}</h4>
                      {e.results.length === 0 ? (
                        <p className="mt-1 text-sm text-ink-500">{t('student.noResults')}</p>
                      ) : (
                        <ul className="mt-2 divide-y divide-mist-200 text-sm">
                          {e.results.map((r) => (
                            <li key={r.assessment.title} className="py-2">
                              <div className="flex justify-between gap-3">
                                <span>{r.assessment.title}</span>
                                <span className="font-semibold text-navy-950">
                                  {r.score} / {Number(r.assessment.maxScore)}
                                </span>
                              </div>
                              {r.feedback && <p className="mt-1 text-xs text-ink-500">{r.feedback}</p>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {e.certificate && (
                      <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
                        <Award className="size-5" aria-hidden />
                        {t('student.certificateIssued', { number: e.certificate.certificateNo })}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="materials-title">
            <h2 id="materials-title" className="mb-4 text-xl">
              {t('student.materials')}
            </h2>
            {me.data.materials.length === 0 ? (
              <EmptyState title={t('student.noMaterials')} />
            ) : (
              <ul className="card divide-y divide-mist-200">
                {me.data.materials.map((m) => (
                  <li key={m.id} className="flex items-start gap-3 p-4">
                    <FileText className="mt-0.5 size-5 shrink-0 text-royal-600" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-navy-950">{m.title}</p>
                      {m.description && <p className="text-sm text-ink-500">{m.description}</p>}
                    </div>
                    {m.url && /^https?:\/\//i.test(m.url) && (
                      <a href={m.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-royal-700 hover:underline">
                        {t('common:actions.learnMore')}
                        <ExternalLink className="size-3.5" aria-hidden />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
