import { useQueryClient } from '@tanstack/react-query';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ConfirmDialog, Modal } from '../../components/common/Modal';
import { useErrorMessage } from '../../components/common/States';
import { useToast } from '../../components/common/Toast';
import { AdminHeader, DataTable, FilterSelect, SearchBox, Toolbar } from '../../components/dashboard/AdminUi';
import { useAdminList } from '../../features/admin/useAdminList';
import { api } from '../../lib/api';
import { formatDateTime } from '../../lib/format';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  isRead: boolean;
  createdAt: string;
}

export function MessagesPage() {
  const { t } = useTranslation('admin');
  const list = useAdminList<Message>('/contact');
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const [open, setOpen] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState<Message | null>(null);
  const categories = ['general', 'admission', 'partnership', 'alumni-assistance'].map((c) => ({ value: c, label: t(`messages.categories.${c}`) }));

  const setRead = async (m: Message, isRead: boolean) => {
    try {
      await api.patch(`/contact/${m.id}`, { isRead });
      await queryClient.invalidateQueries({ queryKey: ['admin'] });
    } catch (error) {
      notify(errorMessage(error), 'error');
    }
  };

  return (
    <div>
      <AdminHeader title={t('messages.title')} />
      <Toolbar>
        <SearchBox onSearch={list.setSearch} />
        <FilterSelect label={t('fields.category')} value={list.params.filters.category ?? ''} onChange={(v) => list.setFilter('category', v)} options={categories} />
        <FilterSelect
          label={t('fields.read')}
          value={list.params.filters.isRead ?? ''}
          onChange={(v) => list.setFilter('isRead', v)}
          options={[
            { value: 'false', label: t('common.no') },
            { value: 'true', label: t('common.yes') },
          ]}
        />
      </Toolbar>
      <DataTable
        rows={list.rows}
        isLoading={list.isLoading}
        error={list.error}
        onRetry={() => void list.refetch()}
        meta={list.meta}
        onPage={list.setPage}
        columns={[
          {
            key: 'subject',
            header: t('fields.subject'),
            cell: (r) => (
              <button
                type="button"
                className={`flex items-start gap-2 text-left hover:underline ${r.isRead ? 'text-ink-700' : 'font-bold text-navy-950'}`}
                onClick={() => {
                  setOpen(r);
                  if (!r.isRead) void setRead(r, true);
                }}
              >
                {r.isRead ? <MailOpen className="mt-0.5 size-4 shrink-0" aria-hidden /> : <Mail className="mt-0.5 size-4 shrink-0 text-royal-600" aria-hidden />}
                {r.subject}
              </button>
            ),
          },
          { key: 'from', header: t('common.name'), cell: (r) => `${r.name} · ${r.email}` },
          { key: 'category', header: t('fields.category'), cell: (r) => <Badge tone="blue">{t(`messages.categories.${r.category}`, { defaultValue: r.category })}</Badge> },
          { key: 'date', header: t('common.created'), cell: (r) => formatDateTime(r.createdAt) },
          {
            key: 'actions',
            header: <span className="sr-only">{t('common.actions')}</span>,
            className: 'text-right whitespace-nowrap',
            cell: (r) => (
              <div className="flex justify-end gap-1">
                <Button size="sm" variant="ghost" onClick={() => void setRead(r, !r.isRead)}>
                  {r.isRead ? t('common.markUnread') : t('common.markRead')}
                </Button>
                <Button size="sm" variant="ghost" className="text-red-700" aria-label={t('common.delete')} onClick={() => setDeleting(r)}>
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </div>
            ),
          },
        ]}
      />
      {open && (
        <Modal open onClose={() => setOpen(null)} title={open.subject} size="lg">
          <p className="text-sm text-ink-500">
            {open.name} · <a href={`mailto:${open.email}`} className="text-royal-700 underline">{open.email}</a> · {formatDateTime(open.createdAt)}
          </p>
          <p className="mt-4 text-sm whitespace-pre-line">{open.message}</p>
        </Modal>
      )}
      <ConfirmDialog
        open={Boolean(deleting)}
        title={t('common.confirmTitle')}
        message={t('common.confirmDelete')}
        confirmLabel={t('common.delete')}
        danger
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await api.delete(`/contact/${deleting.id}`);
            await queryClient.invalidateQueries({ queryKey: ['admin'] });
            notify(t('common.deleted'));
          } catch (error) {
            notify(errorMessage(error), 'error');
          }
          setDeleting(null);
        }}
      />
    </div>
  );
}
