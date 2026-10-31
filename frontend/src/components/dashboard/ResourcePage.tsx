import { useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminList } from '../../features/admin/useAdminList';
import { api } from '../../lib/api';
import { Button } from '../common/Button';
import { ConfirmDialog, Modal } from '../common/Modal';
import { useErrorMessage } from '../common/States';
import { useToast } from '../common/Toast';
import { AdminHeader, DataTable, FilterSelect, SearchBox, Toolbar, type Column } from './AdminUi';
import { ResourceForm, type FieldSpec } from './ResourceForm';

export interface ResourcePageProps<T> {
  title: string;
  description?: ReactNode;
  endpoint: string;
  columns: Column<T>[];
  fields: FieldSpec[];
  filters?: { name: string; label: string; options: { value: string; label: string }[] }[];
  searchable?: boolean;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
  rowActions?: (row: T) => ReactNode;
  /** Prepares a record for the edit form (e.g. flattening relations). */
  toForm?: (row: T) => Record<string, unknown>;
  modalSize?: 'md' | 'lg' | 'xl';
}

/** Generic list + create/edit/delete page for simple CRUD resources. */
export function ResourcePage<T extends { id: string }>(props: ResourcePageProps<T>) {
  const { t } = useTranslation('admin');
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const queryClient = useQueryClient();
  const list = useAdminList<T>(props.endpoint, { sort: props.sort, order: props.order });
  const [editing, setEditing] = useState<T | 'new' | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin'] });

  const save = async (payload: Record<string, unknown>) => {
    if (editing && editing !== 'new') await api.patch(`${props.endpoint}/${editing.id}`, payload);
    else await api.post(props.endpoint, payload);
    await refresh();
    notify(t('common.saved'));
    setEditing(null);
  };

  const remove = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.delete(`${props.endpoint}/${deleting.id}`);
      await refresh();
      notify(t('common.deleted'));
      setDeleting(null);
    } catch (error) {
      notify(errorMessage(error), 'error');
    } finally {
      setBusy(false);
    }
  };

  const columns: Column<T>[] = [
    ...props.columns,
    {
      key: '_actions',
      header: <span className="sr-only">{t('common.actions')}</span>,
      className: 'w-0 whitespace-nowrap text-right',
      cell: (row) => (
        <div className="flex justify-end gap-1">
          {props.rowActions?.(row)}
          {props.canEdit !== false && (
            <Button size="sm" variant="ghost" onClick={() => setEditing(row)} icon={<Pencil className="size-4" aria-hidden />}>
              {t('common.edit')}
            </Button>
          )}
          {props.canDelete !== false && (
            <Button size="sm" variant="ghost" className="text-red-700" onClick={() => setDeleting(row)} aria-label={t('common.delete')}>
              <Trash2 className="size-4" aria-hidden />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const record = editing && editing !== 'new' ? (props.toForm ? props.toForm(editing) : (editing as unknown as Record<string, unknown>)) : null;

  return (
    <div>
      <AdminHeader
        title={props.title}
        description={props.description}
        actions={
          props.canCreate !== false && (
            <Button onClick={() => setEditing('new')} icon={<Plus className="size-4" aria-hidden />}>
              {t('common.new')}
            </Button>
          )
        }
      />
      {(props.searchable !== false || props.filters?.length) && (
        <Toolbar>
          {props.searchable !== false && <SearchBox onSearch={list.setSearch} />}
          {props.filters?.map((f) => (
            <FilterSelect key={f.name} label={f.label} value={list.params.filters[f.name] ?? ''} onChange={(v) => list.setFilter(f.name, v)} options={f.options} />
          ))}
        </Toolbar>
      )}
      <DataTable columns={columns} rows={list.rows} isLoading={list.isLoading} error={list.error} onRetry={() => void list.refetch()} meta={list.meta} onPage={list.setPage} />

      {editing && (
        <Modal
          open
          onClose={() => setEditing(null)}
          size={props.modalSize ?? 'lg'}
          title={editing === 'new' ? t('common.create') : t('common.edit')}
          footer={
            <>
              <Button variant="ghost" onClick={() => setEditing(null)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" form="resource-form">
                {t('common.save')}
              </Button>
            </>
          }
        >
          <ResourceForm id="resource-form" fields={props.fields} record={record} onSubmit={save} onError={(e) => notify(errorMessage(e), 'error')} />
        </Modal>
      )}
      <ConfirmDialog
        open={Boolean(deleting)}
        title={t('common.confirmTitle')}
        message={t('common.confirmDelete')}
        confirmLabel={t('common.delete')}
        danger
        loading={busy}
        onConfirm={() => void remove()}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
