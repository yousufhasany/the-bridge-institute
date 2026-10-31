import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/common/Button';
import { EmptyState, ErrorState, Spinner, useErrorMessage } from '../../components/common/States';
import { useToast } from '../../components/common/Toast';
import { AdminHeader } from '../../components/dashboard/AdminUi';
import { inputClasses, SelectField } from '../../components/forms/Field';
import { api, request } from '../../lib/api';
import type { StudentSummary } from './BatchPicker';

interface Results {
  assessment: { id: string; title: string; maxScore: number };
  rows: { enrollmentId: string; student: StudentSummary; result: { score: number; feedback: string | null } | null }[];
}

export function ResultsPage() {
  const { t } = useTranslation('admin');
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const [assessmentId, setAssessmentId] = useState('');
  const [scores, setScores] = useState<Record<string, { score: string; feedback: string }>>({});
  const [busy, setBusy] = useState(false);

  const assessments = useQuery({
    queryKey: ['admin', 'lookup', 'assessments'],
    queryFn: async () => (await request<{ id: string; title: string; batch: { code: string } }[]>('/assessments', { query: { pageSize: 100 } })).data,
  });
  const results = useQuery({ queryKey: ['admin', 'results', assessmentId], queryFn: () => api.get<Results>('/results', { assessmentId }), enabled: Boolean(assessmentId) });

  useEffect(() => {
    if (!results.data) return;
    setScores(Object.fromEntries(results.data.rows.map((r) => [r.enrollmentId, { score: r.result ? String(r.result.score) : '', feedback: r.result?.feedback ?? '' }])));
  }, [results.data]);

  const max = results.data?.assessment.maxScore ?? 0;
  const invalid = Object.values(scores).some((s) => s.score !== '' && (Number.isNaN(Number(s.score)) || Number(s.score) < 0 || Number(s.score) > max));

  const save = async () => {
    setBusy(true);
    try {
      await api.put('/results', {
        assessmentId,
        records: Object.entries(scores)
          .filter(([, s]) => s.score !== '')
          .map(([enrollmentId, s]) => ({ enrollmentId, score: Number(s.score), feedback: s.feedback.trim() || null })),
      });
      notify(t('results.saved'));
      await results.refetch();
    } catch (error) {
      notify(errorMessage(error), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <AdminHeader title={t('results.title')} />
      <div className="mb-6">
        <SelectField
          label={t('nav.assessments')}
          required
          value={assessmentId}
          onChange={(e) => setAssessmentId(e.target.value)}
          placeholder={t('results.selectAssessment')}
          options={(assessments.data ?? []).map((a) => ({ value: a.id, label: `${a.batch.code} · ${a.title}` }))}
          wrapperClassName="max-w-md"
        />
      </div>
      {!assessmentId ? null : results.isLoading ? (
        <Spinner />
      ) : results.isError ? (
        <ErrorState error={results.error} onRetry={() => void results.refetch()} />
      ) : !results.data?.rows.length ? (
        <EmptyState title={t('common.noResults')} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead className="bg-mist-50 text-left text-xs text-ink-500 uppercase">
              <tr>
                <th scope="col" className="px-4 py-3">
                  {t('fields.student')}
                </th>
                <th scope="col" className="px-4 py-3">
                  {t('fields.score')} ({t('results.outOf', { max })})
                </th>
                <th scope="col" className="px-4 py-3">
                  {t('fields.feedback')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist-200">
              {results.data.rows.map((r) => {
                const s = scores[r.enrollmentId];
                if (!s) return null;
                const bad = s.score !== '' && (Number.isNaN(Number(s.score)) || Number(s.score) < 0 || Number(s.score) > max);
                return (
                  <tr key={r.enrollmentId}>
                    <th scope="row" className="px-4 py-3 text-left font-semibold text-navy-950">
                      {r.student.user.fullName}
                      <span className="block font-mono text-xs font-normal text-ink-500">{r.student.studentCode}</span>
                    </th>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={0}
                        max={max}
                        step="0.5"
                        aria-label={`${t('fields.score')}: ${r.student.user.fullName}`}
                        aria-invalid={bad}
                        value={s.score}
                        onChange={(e) => setScores((all) => ({ ...all, [r.enrollmentId]: { ...s, score: e.target.value } }))}
                        className={`${inputClasses} w-28 py-1.5`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        aria-label={`${t('fields.feedback')}: ${r.student.user.fullName}`}
                        value={s.feedback}
                        maxLength={2000}
                        onChange={(e) => setScores((all) => ({ ...all, [r.enrollmentId]: { ...s, feedback: e.target.value } }))}
                        className={`${inputClasses} py-1.5`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-end border-t border-mist-200 p-4">
            <Button onClick={() => void save()} loading={busy} disabled={invalid}>
              {t('common.save')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
