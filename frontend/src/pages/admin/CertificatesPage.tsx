import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ConfirmDialog, Modal } from '../../components/common/Modal';
import { useErrorMessage } from '../../components/common/States';
import { useToast } from '../../components/common/Toast';
import { AdminHeader, DataTable, FilterSelect, SearchBox, Toolbar } from '../../components/dashboard/AdminUi';
import { SelectField, TextArea } from '../../components/forms/Field';
import { useAdminList } from '../../features/admin/useAdminList';
import { api, request } from '../../lib/api';
import { formatDate } from '../../lib/format';
import { studentLabel, type StudentSummary } from './BatchPicker';

interface Certificate {
  id: string;
  certificateNo: string;
  status: 'PENDING' | 'APPROVED' | 'ISSUED' | 'REVOKED';
  issuedAt: string | null;
  createdAt: string;
  notes: string | null;
  enrollment: { student: StudentSummary; batch: { code: string; name: string } };
  approvedBy: { fullName: string } | null;
}

type Action = 'approve' | 'issue' | 'revoke';

export function CertificatesPage() {
  const { t } = useTranslation('admin');
  const list = useAdminList<Certificate>('/certificates');
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const [preparing, setPreparing] = useState(false);
  const [pending, setPending] = useState<{ cert: Certificate; action: Action } | null>(null);
  const [busy, setBusy] = useState(false);
  const statuses = ['PENDING', 'APPROVED', 'ISSUED', 'REVOKED'].map((s) => ({ value: s, label: t(`status.${s}`) }));

  const act = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      await api.post(`/certificates/${pending.cert.id}/${pending.action}`);
      await queryClient.invalidateQueries({ queryKey: ['admin'] });
      notify(t('common.saved'));
      setPending(null);
    } catch (error) {
      notify(errorMessage(error), 'error');
    } finally {
      setBusy(false);
    }
  };

  const actionLabel: Record<Action, string> = { approve: t('common.approve'), issue: t('certificates.issue'), revoke: t('certificates.revoke') };

  return (
    <div>
      <AdminHeader
        title={t('certificates.title')}
        description={t('certificates.intro')}
        actions={
          <Button onClick={() => setPreparing(true)} icon={<Plus className="size-4" aria-hidden />}>
            {t('certificates.prepare')}
          </Button>
        }
      />
      <Toolbar>
        <SearchBox onSearch={list.setSearch} />
        <FilterSelect label={t('common.status')} value={list.params.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={statuses} />
      </Toolbar>
      <DataTable
        rows={list.rows}
        isLoading={list.isLoading}
        error={list.error}
        onRetry={() => void list.refetch()}
        meta={list.meta}
        onPage={list.setPage}
        columns={[
          { key: 'no', header: t('fields.certificateNo'), cell: (r) => <span className="font-mono text-xs">{r.certificateNo}</span> },
          { key: 'student', header: t('fields.student'), cell: (r) => studentLabel(r.enrollment.student) },
          { key: 'batch', header: t('fields.batch'), cell: (r) => r.enrollment.batch.code },
          { key: 'issued', header: t('status.ISSUED'), cell: (r) => formatDate(r.issuedAt) },
          { key: 'status', header: t('common.status'), cell: (r) => <StatusBadge status={r.status} label={t(`status.${r.status}`)} /> },
          {
            key: 'actions',
            header: <span className="sr-only">{t('common.actions')}</span>,
            className: 'text-right whitespace-nowrap',
            cell: (r) => (
              <div className="flex justify-end gap-1">
                {r.status === 'PENDING' && (
                  <Button size="sm" variant="outline" onClick={() => setPending({ cert: r, action: 'approve' })}>
                    {actionLabel.approve}
                  </Button>
                )}
                {r.status === 'APPROVED' && (
                  <Button size="sm" onClick={() => setPending({ cert: r, action: 'issue' })}>
                    {actionLabel.issue}
                  </Button>
                )}
                {r.status !== 'REVOKED' && (
                  <Button size="sm" variant="ghost" className="text-red-700" onClick={() => setPending({ cert: r, action: 'revoke' })}>
                    {actionLabel.revoke}
                  </Button>
                )}
              </div>
            ),
          },
        ]}
      />
      {preparing && <PrepareCertificate onClose={() => setPreparing(false)} />}
      <ConfirmDialog
        open={Boolean(pending)}
        title={t('common.confirmTitle')}
        message={pending ? `${actionLabel[pending.action]}: ${pending.cert.certificateNo} (${studentLabel(pending.cert.enrollment.student)})` : ''}
        confirmLabel={pending ? actionLabel[pending.action] : undefined}
        danger={pending?.action === 'revoke'}
        loading={busy}
        onConfirm={() => void act()}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}

function PrepareCertificate({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('admin');
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const [enrollmentId, setEnrollmentId] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const completed = useQuery({
    queryKey: ['admin', 'completed-enrollments'],
    queryFn: async () =>
      (await request<{ id: string; status: string; student: StudentSummary; batch: { code: string }; certificate: { id: string } | null }[]>('/enrollments', { query: { pageSize: 100 } })).data.filter(
        (e) => e.status === 'COMPLETED' && !e.certificate,
      ),
  });

  const save = async () => {
    setBusy(true);
    try {
      await api.post('/certificates', { enrollmentId, notes: notes.trim() || null });
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
      title={t('certificates.prepare')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={() => void save()} disabled={!enrollmentId} loading={busy}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <SelectField
          label={t('fields.enrollmentId')}
          required
          hint={t('certificates.enrollmentHint')}
          value={enrollmentId}
          onChange={(e) => setEnrollmentId(e.target.value)}
          placeholder="—"
          options={(completed.data ?? []).map((e) => ({ value: e.id, label: `${studentLabel(e.student)} · ${e.batch.code}` }))}
        />
        <TextArea label={t('fields.notes')} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
    </Modal>
  );
}
