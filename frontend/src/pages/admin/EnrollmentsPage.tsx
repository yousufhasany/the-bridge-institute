import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useErrorMessage } from '../../components/common/States';
import { useToast } from '../../components/common/Toast';
import { AdminHeader, DataTable } from '../../components/dashboard/AdminUi';
import { inputClasses, SelectField, TextField } from '../../components/forms/Field';
import { useAdminList } from '../../features/admin/useAdminList';
import { useAuth } from '../../features/auth/AuthProvider';
import { api, request } from '../../lib/api';
import { formatDate } from '../../lib/format';
import { BatchPicker, studentLabel, type StudentSummary } from './BatchPicker';

interface Enrollment {
  id: string;
  status: string;
  progress: number;
  enrolledAt: string;
  student: StudentSummary;
  batch: { id: string; code: string; name: string };
  certificate: { id: string; status: string } | null;
}

export function EnrollmentsPage() {
  const { t } = useTranslation('admin');
  const { can } = useAuth();
  const manage = can('training.manage');
  const [batchId, setBatchId] = useState('');
  const list = useAdminList<Enrollment>(`/enrollments`, { initialFilters: {}, enabled: Boolean(batchId) || manage });
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Enrollment | null>(null);

  return (
    <div>
      <AdminHeader
        title={t('enrollments.title')}
        actions={
          manage && (
            <Button onClick={() => setAdding(true)} icon={<Plus className="size-4" aria-hidden />} disabled={!batchId}>
              {t('enrollments.add')}
            </Button>
          )
        }
      />
      <div className="mb-4">
        <BatchPicker
          value={batchId}
          onChange={(id) => {
            setBatchId(id);
            list.setFilter('batchId', id);
          }}
        />
      </div>
      {batchId || manage ? (
        <DataTable
          rows={list.rows}
          isLoading={list.isLoading}
          error={list.error}
          onRetry={() => void list.refetch()}
          meta={list.meta}
          onPage={list.setPage}
          columns={[
            {
              key: 'student',
              header: t('fields.student'),
              cell: (r) => (
                <>
                  <span className="font-semibold text-navy-950">{r.student.user.fullName}</span>
                  <span className="block font-mono text-xs text-ink-500">{r.student.studentCode}</span>
                </>
              ),
            },
            { key: 'batch', header: t('fields.batch'), cell: (r) => r.batch.code },
            { key: 'enrolled', header: t('common.created'), cell: (r) => formatDate(r.enrolledAt) },
            { key: 'progress', header: t('fields.progress'), cell: (r) => `${r.progress}%` },
            { key: 'status', header: t('common.status'), cell: (r) => <StatusBadge status={r.status} label={t(`status.${r.status}`)} /> },
            {
              key: 'actions',
              header: <span className="sr-only">{t('common.actions')}</span>,
              className: 'text-right',
              cell: (r) => (
                <Button size="sm" variant="ghost" onClick={() => setEditing(r)}>
                  {t('common.edit')}
                </Button>
              ),
            },
          ]}
        />
      ) : (
        <p className="text-sm text-ink-500">{t('enrollments.selectBatch')}</p>
      )}
      {adding && <AddEnrollment batchId={batchId} onClose={() => setAdding(false)} />}
      {editing && <EditEnrollment enrollment={editing} canChangeStatus={manage} onClose={() => setEditing(null)} />}
    </div>
  );
}

function AddEnrollment({ batchId, onClose }: { batchId: string; onClose: () => void }) {
  const { t } = useTranslation('admin');
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const queryClient = useQueryClient();
  const [q, setQ] = useState('');
  const [studentId, setStudentId] = useState('');
  const [busy, setBusy] = useState(false);
  const students = useQuery({
    queryKey: ['admin', 'student-search', q],
    queryFn: async () => (await request<StudentSummary[]>('/students', { query: { q, pageSize: 50, status: 'ACTIVE' } })).data,
  });

  const save = async () => {
    setBusy(true);
    try {
      await api.post('/enrollments', { studentId, batchId });
      await queryClient.invalidateQueries({ queryKey: ['admin'] });
      notify(t('common.saved'));
      onClose();
    } catch (error) {
      notify(errorMessage(error), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={t('enrollments.add')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={() => void save()} disabled={!studentId} loading={busy}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-navy-950">
          {t('enrollments.studentSearch')}
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} className={`${inputClasses} mt-1.5`} />
        </label>
        <SelectField
          label={t('enrollments.studentPick')}
          required
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="—"
          options={(students.data ?? []).map((s) => ({ value: s.id, label: studentLabel(s) }))}
        />
      </div>
    </Modal>
  );
}

function EditEnrollment({ enrollment, canChangeStatus, onClose }: { enrollment: Enrollment; canChangeStatus: boolean; onClose: () => void }) {
  const { t } = useTranslation('admin');
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(String(enrollment.progress));
  const [status, setStatus] = useState(enrollment.status);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await api.patch(`/enrollments/${enrollment.id}`, { progress: Number(progress), ...(canChangeStatus && status !== enrollment.status ? { status } : {}) });
      await queryClient.invalidateQueries({ queryKey: ['admin'] });
      notify(t('common.saved'));
      onClose();
    } catch (error) {
      notify(errorMessage(error), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`${enrollment.student.user.fullName} · ${enrollment.batch.code}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={() => void save()} loading={busy}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label={t('fields.progress')} type="number" min={0} max={100} required value={progress} onChange={(e) => setProgress(e.target.value)} />
        {canChangeStatus && (
          <SelectField
            label={t('common.status')}
            required
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={['ACTIVE', 'COMPLETED', 'WITHDRAWN'].map((s) => ({ value: s, label: t(`status.${s}`) }))}
          />
        )}
      </div>
    </Modal>
  );
}
