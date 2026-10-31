import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Alert, ErrorState, Spinner, useErrorMessage } from '../../components/common/States';
import { useToast } from '../../components/common/Toast';
import { AdminHeader, DataTable, DetailList, FilterSelect, SearchBox, Toolbar } from '../../components/dashboard/AdminUi';
import { SelectField, TextArea } from '../../components/forms/Field';
import { useAdminList } from '../../features/admin/useAdminList';
import { api } from '../../lib/api';
import { formatDate, formatDateTime } from '../../lib/format';

const STATUSES = ['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WAITLISTED'];

interface ApplicationRow {
  id: string;
  referenceCode: string;
  fullName: string;
  email: string;
  phone: string;
  areaOfInterest: string;
  currentStatus: string;
  status: string;
  createdAt: string;
}

interface ApplicationDetail extends ApplicationRow {
  highestEducation: string | null;
  motivation: string;
  preferredContact: string | null;
  locale: string;
  consentAt: string;
  history: { id: string; fromStatus: string | null; toStatus: string; note: string | null; createdAt: string; changedBy: { fullName: string } | null }[];
  notes: { id: string; body: string; createdAt: string; author: { fullName: string } | null }[];
  studentProfile: { id: string; studentCode: string } | null;
}

export function ApplicationsAdminPage() {
  const { t } = useTranslation('admin');
  const list = useAdminList<ApplicationRow>('/applications');
  const [openId, setOpenId] = useState<string | null>(null);
  const statusOptions = STATUSES.map((s) => ({ value: s, label: t(`status.${s}`) }));

  return (
    <div>
      <AdminHeader title={t('applications.title')} />
      <Toolbar>
        <SearchBox onSearch={list.setSearch} />
        <FilterSelect label={t('common.status')} value={list.params.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={statusOptions} />
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
          { key: 'ref', header: t('fields.referenceCode'), cell: (r) => <span className="font-mono text-xs">{r.referenceCode}</span> },
          {
            key: 'name',
            header: t('fields.fullName'),
            cell: (r) => (
              <button type="button" className="text-left font-semibold text-navy-950 hover:underline" onClick={() => setOpenId(r.id)}>
                {r.fullName}
                <span className="block text-xs font-normal text-ink-500">{r.email}</span>
              </button>
            ),
          },
          { key: 'interest', header: t('fields.areaOfInterest'), cell: (r) => r.areaOfInterest },
          { key: 'submitted', header: t('fields.submitted'), cell: (r) => formatDate(r.createdAt) },
          { key: 'status', header: t('common.status'), cell: (r) => <StatusBadge status={r.status} label={t(`status.${r.status}`)} /> },
        ]}
      />
      {openId && <ApplicationModal id={openId} onClose={() => setOpenId(null)} />}
    </div>
  );
}

function ApplicationModal({ id, onClose }: { id: string; onClose: () => void }) {
  const { t } = useTranslation(['admin', 'pages']);
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const detail = useQuery({ queryKey: ['admin', 'application', id], queryFn: () => api.get<ApplicationDetail>(`/applications/${id}`) });
  const [status, setStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [invite, setInvite] = useState<{ studentCode: string; inviteUrl: string | null } | null>(null);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin'] });
  const run = async (key: string, fn: () => Promise<unknown>, success: string) => {
    setBusy(key);
    try {
      await fn();
      await refresh();
      notify(success);
      return true;
    } catch (error) {
      notify(errorMessage(error), 'error');
      return false;
    } finally {
      setBusy(null);
    }
  };

  const a = detail.data;
  return (
    <Modal open onClose={onClose} size="xl" title={a ? `${a.fullName} · ${a.referenceCode}` : t('applications.title')}>
      {detail.isLoading ? (
        <Spinner />
      ) : detail.isError || !a ? (
        <ErrorState error={detail.error} />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={a.status} label={t(`status.${a.status}`)} />
            {a.studentProfile && <span className="text-sm font-semibold text-emerald-700">{t('applications.alreadyOnboarded', { code: a.studentProfile.studentCode })}</span>}
          </div>
          <DetailList
            items={[
              { label: t('fields.email'), value: <a href={`mailto:${a.email}`} className="text-royal-700 underline">{a.email}</a> },
              { label: t('fields.phone'), value: a.phone },
              { label: t('fields.currentStatus'), value: t(`pages:apply.statuses.${a.currentStatus}`, { defaultValue: a.currentStatus }) },
              { label: t('fields.highestEducation'), value: a.highestEducation },
              { label: t('fields.areaOfInterest'), value: a.areaOfInterest },
              { label: t('fields.preferredContact'), value: a.preferredContact ? t(`pages:apply.contactMethods.${a.preferredContact}`) : null },
              { label: t('fields.submitted'), value: formatDateTime(a.createdAt) },
              { label: t('cms.language'), value: a.locale === 'bn' ? t('common.bangla') : t('common.english') },
            ]}
          />
          <div>
            <h3 className="text-sm font-bold">{t('fields.motivation')}</h3>
            <p className="mt-1 rounded-xl bg-mist-50 p-4 text-sm whitespace-pre-line">{a.motivation}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="space-y-3 rounded-xl ring-1 ring-mist-200 p-4">
              <h3 className="text-sm font-bold">{t('applications.changeStatus')}</h3>
              <SelectField label={t('common.status')} value={status} onChange={(e) => setStatus(e.target.value)} placeholder="—" options={STATUSES.filter((s) => s !== a.status).map((s) => ({ value: s, label: t(`status.${s}`) }))} />
              <TextArea label={t('applications.statusNote')} rows={2} value={statusNote} onChange={(e) => setStatusNote(e.target.value)} />
              <Button
                variant="secondary"
                size="sm"
                disabled={!status}
                loading={busy === 'status'}
                onClick={async () => {
                  const done = await run('status', () => api.patch(`/applications/${id}/status`, { status, note: statusNote || null }), t('common.saved'));
                  if (done) {
                    setStatus('');
                    setStatusNote('');
                  }
                }}
              >
                {t('applications.updateStatus')}
              </Button>
              {a.status === 'ACCEPTED' && !a.studentProfile && (
                <div className="space-y-2 border-t border-mist-200 pt-3">
                  <p className="text-xs text-ink-500">{t('applications.onboardHint')}</p>
                  <Button
                    size="sm"
                    icon={<UserPlus className="size-4" aria-hidden />}
                    loading={busy === 'onboard'}
                    onClick={() =>
                      void run(
                        'onboard',
                        async () => setInvite(await api.post<{ studentCode: string; inviteUrl: string | null }>(`/applications/${id}/onboard`)),
                        t('common.saved'),
                      )
                    }
                  >
                    {t('applications.onboard')}
                  </Button>
                </div>
              )}
              {invite && (
                <Alert kind="success">
                  <p>{t('applications.onboarded', { code: invite.studentCode })}</p>
                  {invite.inviteUrl && (
                    <>
                      <p className="mt-2">{t('applications.inviteLink')}</p>
                      <code className="mt-1 block text-xs break-all">{invite.inviteUrl}</code>
                    </>
                  )}
                </Alert>
              )}
            </section>

            <section className="space-y-3 rounded-xl ring-1 ring-mist-200 p-4">
              <h3 className="text-sm font-bold">{t('applications.history')}</h3>
              <ol className="space-y-2 border-l-2 border-royal-100 pl-4 text-sm">
                {a.history.map((h) => (
                  <li key={h.id}>
                    <span className="font-semibold text-navy-950">{t(`status.${h.toStatus}`)}</span>
                    <span className="text-xs text-ink-500">
                      {' '}
                      · {formatDateTime(h.createdAt)}
                      {h.changedBy && ` · ${h.changedBy.fullName}`}
                    </span>
                    {h.note && <p className="text-xs text-ink-700">{h.note}</p>}
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <section className="space-y-3">
            <h3 className="text-sm font-bold">{t('applications.notes')}</h3>
            <p className="text-xs text-ink-500">{t('applications.notesHint')}</p>
            <ul className="space-y-2">
              {a.notes.map((n) => (
                <li key={n.id} className="rounded-xl bg-amber-50 p-3 text-sm">
                  <p className="whitespace-pre-line">{n.body}</p>
                  <p className="mt-1 text-xs text-ink-500">
                    {n.author?.fullName} · {formatDateTime(n.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
            <TextArea label={t('common.note')} rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t('common.notePlaceholder')} />
            <Button
              size="sm"
              variant="outline"
              disabled={!note.trim()}
              loading={busy === 'note'}
              onClick={async () => {
                if (await run('note', () => api.post(`/applications/${id}/notes`, { body: note.trim() }), t('common.saved'))) setNote('');
              }}
            >
              {t('applications.addNote')}
            </Button>
          </section>
        </div>
      )}
    </Modal>
  );
}
