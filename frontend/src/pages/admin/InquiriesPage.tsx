import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Building2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ErrorState, Spinner, useErrorMessage } from '../../components/common/States';
import { useToast } from '../../components/common/Toast';
import { AdminHeader, DataTable, DetailList, FilterSelect, SearchBox, Toolbar } from '../../components/dashboard/AdminUi';
import { SelectField, TextArea } from '../../components/forms/Field';
import { useAdminList } from '../../features/admin/useAdminList';
import { api } from '../../lib/api';
import { formatDate, formatDateTime } from '../../lib/format';

const STATUSES = ['NEW', 'IN_REVIEW', 'CONTACTED', 'CLOSED'];

interface Inquiry {
  id: string;
  organizationName: string;
  contactName: string;
  workEmail: string;
  phone: string | null;
  website: string | null;
  interest: string;
  message: string;
  status: string;
  createdAt: string;
  companyId: string | null;
  company: { id: string; name: string } | null;
}

interface InquiryDetail extends Inquiry {
  interactions: { id: string; type: string; note: string; occurredAt: string; author: { fullName: string } | null }[];
}

export function InquiriesPage() {
  const { t } = useTranslation(['admin', 'pages']);
  const list = useAdminList<Inquiry>('/partnership-inquiries');
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      <AdminHeader title={t('inquiries.title')} />
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
            key: 'org',
            header: t('fields.organizationName'),
            cell: (r) => (
              <button type="button" className="text-left font-semibold text-navy-950 hover:underline" onClick={() => setOpenId(r.id)}>
                {r.organizationName}
                <span className="block text-xs font-normal text-ink-500">
                  {r.contactName} · {r.workEmail}
                </span>
              </button>
            ),
          },
          { key: 'interest', header: t('fields.interest'), cell: (r) => t(`pages:companies.interests.${r.interest}`, { defaultValue: r.interest }) },
          { key: 'created', header: t('fields.submitted'), cell: (r) => formatDate(r.createdAt) },
          { key: 'company', header: t('fields.company'), cell: (r) => r.company?.name ?? '—' },
          { key: 'status', header: t('common.status'), cell: (r) => <StatusBadge status={r.status} label={t(`status.${r.status}`)} /> },
        ]}
      />
      {openId && <InquiryModal id={openId} onClose={() => setOpenId(null)} />}
    </div>
  );
}

function InquiryModal({ id, onClose }: { id: string; onClose: () => void }) {
  const { t } = useTranslation(['admin', 'pages']);
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const detail = useQuery({ queryKey: ['admin', 'inquiry', id], queryFn: () => api.get<InquiryDetail>(`/partnership-inquiries/${id}`) });
  const [type, setType] = useState('note');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (key: string, fn: () => Promise<unknown>, success: string) => {
    setBusy(key);
    try {
      await fn();
      await queryClient.invalidateQueries({ queryKey: ['admin'] });
      notify(success);
      return true;
    } catch (error) {
      notify(errorMessage(error), 'error');
      return false;
    } finally {
      setBusy(null);
    }
  };

  const i = detail.data;
  return (
    <Modal open onClose={onClose} size="xl" title={i?.organizationName ?? t('inquiries.title')}>
      {detail.isLoading ? (
        <Spinner />
      ) : detail.isError || !i ? (
        <ErrorState error={detail.error} />
      ) : (
        <div className="space-y-6">
          <DetailList
            items={[
              { label: t('fields.contactName'), value: i.contactName },
              { label: t('fields.contactEmail'), value: <a href={`mailto:${i.workEmail}`} className="text-royal-700 underline">{i.workEmail}</a> },
              { label: t('fields.phone'), value: i.phone },
              { label: t('fields.website'), value: i.website && /^https?:\/\//i.test(i.website) ? <a href={i.website} target="_blank" rel="noopener noreferrer" className="text-royal-700 underline">{i.website}</a> : null },
              { label: t('fields.interest'), value: t(`pages:companies.interests.${i.interest}`, { defaultValue: i.interest }) },
              { label: t('fields.submitted'), value: formatDateTime(i.createdAt) },
            ]}
          />
          <p className="rounded-xl bg-mist-50 p-4 text-sm whitespace-pre-line">{i.message}</p>
          <div className="flex flex-wrap items-end gap-3">
            <SelectField
              label={t('common.status')}
              value={i.status}
              onChange={(e) => void run('status', () => api.patch(`/partnership-inquiries/${id}`, { status: e.target.value }), t('common.saved'))}
              options={STATUSES.map((s) => ({ value: s, label: t(`status.${s}`) }))}
            />
            {i.company ? (
              <p className="pb-2 text-sm font-semibold text-emerald-700">{t('inquiries.linked', { name: i.company.name })}</p>
            ) : (
              <Button variant="outline" icon={<Building2 className="size-4" aria-hidden />} loading={busy === 'convert'} onClick={() => void run('convert', () => api.post(`/partnership-inquiries/${id}/convert`), t('inquiries.converted'))}>
                {t('inquiries.convert')}
              </Button>
            )}
          </div>
          <p className="text-xs text-ink-500">{t('companies.note')}</p>
          <section className="space-y-3">
            <h3 className="text-sm font-bold">{t('inquiries.interactions')}</h3>
            <ul className="space-y-2">
              {i.interactions.map((x) => (
                <li key={x.id} className="rounded-xl bg-sky-50 p-3 text-sm">
                  <p className="text-xs font-semibold text-royal-700 uppercase">{t(`inquiries.types.${x.type}`, { defaultValue: x.type })}</p>
                  <p className="mt-1 whitespace-pre-line">{x.note}</p>
                  <p className="mt-1 text-xs text-ink-500">
                    {x.author?.fullName} · {formatDateTime(x.occurredAt)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
              <SelectField label={t('fields.type')} value={type} onChange={(e) => setType(e.target.value)} options={['note', 'call', 'email', 'meeting'].map((v) => ({ value: v, label: t(`inquiries.types.${v}`) }))} />
              <TextArea label={t('common.note')} rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <Button
              size="sm"
              variant="secondary"
              disabled={!note.trim()}
              loading={busy === 'note'}
              onClick={async () => {
                if (await run('note', () => api.post(`/partnership-inquiries/${id}/interactions`, { type, note: note.trim() }), t('common.saved'))) setNote('');
              }}
            >
              {t('inquiries.addInteraction')}
            </Button>
          </section>
        </div>
      )}
    </Modal>
  );
}
