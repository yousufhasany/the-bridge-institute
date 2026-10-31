import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Alert, ErrorState, Spinner, useErrorMessage } from '../../../components/common/States';
import { useToast } from '../../../components/common/Toast';
import { AdminHeader, DataTable, DetailList, FilterSelect, SearchBox, Toolbar } from '../../../components/dashboard/AdminUi';
import { TextArea } from '../../../components/forms/Field';
import { useAdminList } from '../../../features/admin/useAdminList';
import { api } from '../../../lib/api';
import { formatDate, formatDateTime } from '../../../lib/format';

interface RegistrationRow {
  id: string;
  fullName: string;
  email: string;
  graduationYear: number | null;
  studentCode: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  cohort: { name: string } | null;
  reviewedBy: { fullName: string } | null;
}

interface RegistrationDetail extends RegistrationRow {
  message: string | null;
  reviewNote: string | null;
  reviewedAt: string | null;
  user: { id: string; email: string; fullName: string; createdAt: string };
  matchedStudent: { id: string; studentCode: string; status: string; graduatedAt: string | null } | null;
}

const STATUSES = ['PENDING', 'APPROVED', 'REJECTED'];

export function AlumniRegistrationsPage() {
  const { t } = useTranslation('admin');
  const list = useAdminList<RegistrationRow>('/admin/alumni/registrations', { initialFilters: { status: 'PENDING' } });
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      <AdminHeader title={t('alumniAdmin.registrations.title')} description={t('alumniAdmin.registrations.description')} />
      <Toolbar>
        <SearchBox onSearch={list.setSearch} />
        <FilterSelect label={t('common.status')} value={list.params.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={STATUSES.map((s) => ({ value: s, label: t(`status.${s}`) }))} />
      </Toolbar>
      <DataTable
        rows={list.rows}
        isLoading={list.isLoading}
        error={list.error}
        onRetry={() => void list.refetch()}
        meta={list.meta}
        onPage={list.setPage}
        onRowClick={(r) => setOpenId(r.id)}
        columns={[
          {
            key: 'name',
            header: t('common.name'),
            cell: (r) => (
              <button type="button" className="text-left font-semibold text-navy-950 hover:underline" onClick={() => setOpenId(r.id)}>
                {r.fullName}
                <span className="block text-xs font-normal text-ink-500">{r.email}</span>
              </button>
            ),
          },
          { key: 'year', header: t('fields.graduationYear'), cell: (r) => r.graduationYear ?? '—' },
          { key: 'cohort', header: t('fields.cohort'), cell: (r) => r.cohort?.name ?? '—' },
          { key: 'code', header: t('fields.studentCode'), cell: (r) => r.studentCode ?? '—' },
          { key: 'created', header: t('fields.submitted'), cell: (r) => formatDate(r.createdAt) },
          { key: 'status', header: t('common.status'), cell: (r) => <StatusBadge status={r.status} label={t(`status.${r.status}`)} /> },
        ]}
      />
      {openId && <RegistrationModal id={openId} onClose={() => setOpenId(null)} />}
    </div>
  );
}

function RegistrationModal({ id, onClose }: { id: string; onClose: () => void }) {
  const { t } = useTranslation('admin');
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const detail = useQuery({ queryKey: ['admin', 'alumni-registration', id], queryFn: () => api.get<RegistrationDetail>(`/admin/alumni/registrations/${id}`) });
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState<'approve' | 'reject' | null>(null);

  const decide = async (decision: 'approve' | 'reject') => {
    setBusy(decision);
    try {
      await api.post(`/admin/alumni/registrations/${id}/${decision}`, { note: note.trim() || null });
      await queryClient.invalidateQueries({ queryKey: ['admin'] });
      notify(decision === 'approve' ? t('alumniAdmin.registrations.approved') : t('alumniAdmin.registrations.rejected'));
      onClose();
    } catch (error) {
      notify(errorMessage(error), 'error');
    } finally {
      setBusy(null);
    }
  };

  const r = detail.data;
  return (
    <Modal open onClose={onClose} size="lg" title={r?.fullName ?? t('alumniAdmin.registrations.title')}>
      {detail.isLoading ? (
        <Spinner />
      ) : detail.isError || !r ? (
        <ErrorState error={detail.error} />
      ) : (
        <div className="space-y-5">
          <DetailList
            items={[
              { label: t('fields.email'), value: r.email },
              { label: t('alumniAdmin.registrations.account'), value: `${r.user.fullName} · ${r.user.email}` },
              { label: t('fields.graduationYear'), value: r.graduationYear },
              { label: t('fields.cohort'), value: r.cohort?.name },
              { label: t('fields.studentCode'), value: r.studentCode },
              { label: t('fields.submitted'), value: formatDateTime(r.createdAt) },
              { label: t('common.status'), value: <StatusBadge status={r.status} label={t(`status.${r.status}`)} /> },
            ]}
          />
          {r.matchedStudent ? (
            <Alert kind="success">
              {t('alumniAdmin.registrations.matched', { code: r.matchedStudent.studentCode, status: t(`status.${r.matchedStudent.status}`, { defaultValue: r.matchedStudent.status }) })}
            </Alert>
          ) : (
            <Alert kind="warning">{t('alumniAdmin.registrations.noMatch')}</Alert>
          )}
          {r.message && (
            <div>
              <h3 className="text-sm font-bold">{t('alumniAdmin.registrations.message')}</h3>
              <p className="mt-1 rounded-xl bg-mist-50 p-3 text-sm whitespace-pre-line">{r.message}</p>
            </div>
          )}
          {r.status === 'PENDING' ? (
            <div className="space-y-3 border-t border-mist-200 pt-4">
              <TextArea label={t('alumniAdmin.reviewNote')} hint={t('alumniAdmin.reviewNoteHint')} rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
              <div className="flex flex-wrap gap-2">
                <Button loading={busy === 'approve'} disabled={busy !== null} onClick={() => void decide('approve')}>
                  {t('alumniAdmin.registrations.approve')}
                </Button>
                <Button variant="danger" loading={busy === 'reject'} disabled={busy !== null} onClick={() => void decide('reject')}>
                  {t('alumniAdmin.registrations.reject')}
                </Button>
              </div>
              <p className="text-xs text-ink-500">{t('alumniAdmin.registrations.approveHelp')}</p>
            </div>
          ) : (
            <p className="text-sm text-ink-500">
              {t('alumniAdmin.reviewedBy', { name: r.reviewedBy?.fullName ?? '—', date: r.reviewedAt ? formatDateTime(r.reviewedAt) : '—' })}
              {r.reviewNote && <span className="mt-1 block whitespace-pre-line">{r.reviewNote}</span>}
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}
