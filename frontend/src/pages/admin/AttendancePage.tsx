import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/common/Button';
import { EmptyState, ErrorState, Spinner, useErrorMessage } from '../../components/common/States';
import { useToast } from '../../components/common/Toast';
import { AdminHeader } from '../../components/dashboard/AdminUi';
import { inputClasses, TextField } from '../../components/forms/Field';
import { api } from '../../lib/api';
import { BatchPicker, type StudentSummary } from './BatchPicker';

const STATUSES = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const;
type Status = (typeof STATUSES)[number];

interface Row {
  enrollmentId: string;
  student: StudentSummary;
  record: { status: Status; note: string | null } | null;
}

export function AttendancePage() {
  const { t } = useTranslation('admin');
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const [batchId, setBatchId] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState<Record<string, { status: Status; note: string }>>({});
  const [busy, setBusy] = useState(false);

  const rows = useQuery({
    queryKey: ['admin', 'attendance', batchId, date],
    queryFn: () => api.get<Row[]>('/attendance', { batchId, date }),
    enabled: Boolean(batchId && date),
  });

  useEffect(() => {
    if (!rows.data) return;
    setRecords(Object.fromEntries(rows.data.map((r) => [r.enrollmentId, { status: r.record?.status ?? 'PRESENT', note: r.record?.note ?? '' }])));
  }, [rows.data]);

  const save = async () => {
    setBusy(true);
    try {
      await api.put('/attendance', {
        batchId,
        date,
        records: Object.entries(records).map(([enrollmentId, r]) => ({ enrollmentId, status: r.status, note: r.note.trim() || null })),
      });
      notify(t('attendance.saved'));
      await rows.refetch();
    } catch (error) {
      notify(errorMessage(error), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <AdminHeader title={t('attendance.title')} />
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <BatchPicker value={batchId} onChange={setBatchId} />
        <TextField label={t('fields.date')} type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      {!batchId ? (
        <p className="text-sm text-ink-500">{t('attendance.selectBatchDate')}</p>
      ) : rows.isLoading ? (
        <Spinner />
      ) : rows.isError ? (
        <ErrorState error={rows.error} onRetry={() => void rows.refetch()} />
      ) : !rows.data?.length ? (
        <EmptyState title={t('common.noResults')} />
      ) : (
        <div className="card overflow-x-auto">
          <div className="flex justify-end border-b border-mist-200 p-3">
            <Button size="sm" variant="ghost" onClick={() => setRecords((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, { ...v, status: 'PRESENT' }])))}>
              {t('attendance.markAll')}
            </Button>
          </div>
          <table className="w-full min-w-[40rem] text-sm">
            <thead className="bg-mist-50 text-left text-xs text-ink-500 uppercase">
              <tr>
                <th scope="col" className="px-4 py-3">
                  {t('fields.student')}
                </th>
                <th scope="col" className="px-4 py-3">
                  {t('common.status')}
                </th>
                <th scope="col" className="px-4 py-3">
                  {t('fields.notes')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist-200">
              {rows.data.map((r) => {
                const rec = records[r.enrollmentId];
                if (!rec) return null;
                return (
                  <tr key={r.enrollmentId}>
                    <th scope="row" className="px-4 py-3 text-left font-semibold text-navy-950">
                      {r.student.user.fullName}
                      <span className="block font-mono text-xs font-normal text-ink-500">{r.student.studentCode}</span>
                    </th>
                    <td className="px-4 py-3">
                      <fieldset className="flex flex-wrap gap-1">
                        <legend className="sr-only">{`${t('common.status')}: ${r.student.user.fullName}`}</legend>
                        {STATUSES.map((s) => (
                          <label key={s} className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold ring-1 ${rec.status === s ? 'bg-navy-950 text-white ring-navy-950' : 'ring-mist-200 hover:bg-mist-50'}`}>
                            <input
                              type="radio"
                              className="sr-only"
                              name={`att-${r.enrollmentId}`}
                              checked={rec.status === s}
                              onChange={() => setRecords((all) => ({ ...all, [r.enrollmentId]: { ...rec, status: s } }))}
                            />
                            {t(`status.${s}`)}
                          </label>
                        ))}
                      </fieldset>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        aria-label={`${t('fields.notes')}: ${r.student.user.fullName}`}
                        value={rec.note}
                        maxLength={500}
                        onChange={(e) => setRecords((all) => ({ ...all, [r.enrollmentId]: { ...rec, note: e.target.value } }))}
                        className={`${inputClasses} py-1.5`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-end border-t border-mist-200 p-4">
            <Button onClick={() => void save()} loading={busy}>
              {t('common.save')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
