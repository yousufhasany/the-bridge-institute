import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Lock, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ConfirmDialog, Modal } from '../../components/common/Modal';
import { Alert, ErrorState, Spinner, useErrorMessage } from '../../components/common/States';
import { useToast } from '../../components/common/Toast';
import { AdminHeader } from '../../components/dashboard/AdminUi';
import { TextField } from '../../components/forms/Field';
import { api } from '../../lib/api';

interface RoleRow {
  id: string;
  key: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  userCount: number;
  permissions: string[];
}

interface Permission {
  id: string;
  key: string;
  description: string | null;
}

const permissionLabelKey = (key: string) => `permissions.${key.replace(/\./g, '_')}`;

export function RolesPage() {
  const { t } = useTranslation('admin');
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const roles = useQuery({ queryKey: ['admin', 'roles'], queryFn: () => api.get<RoleRow[]>('/roles') });
  const permissions = useQuery({ queryKey: ['admin', 'permissions'], queryFn: () => api.get<Permission[]>('/roles/permissions'), staleTime: Infinity });
  const [editing, setEditing] = useState<RoleRow | 'new' | null>(null);
  const [deleting, setDeleting] = useState<RoleRow | null>(null);

  if (roles.isLoading || permissions.isLoading) return <Spinner />;
  if (roles.isError || permissions.isError) return <ErrorState error={roles.error ?? permissions.error} onRetry={() => void roles.refetch()} />;

  return (
    <div>
      <AdminHeader
        title={t('roles.title')}
        description={t('roles.description')}
        actions={
          <Button onClick={() => setEditing('new')} icon={<Plus className="size-4" aria-hidden />}>
            {t('roles.new')}
          </Button>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {roles.data?.map((role) => (
          <article key={role.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-mist-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-navy-950">{t(`roles.names.${role.key}`, { defaultValue: role.name })}</h2>
                <p className="text-xs text-ink-500">
                  <code>{role.key}</code> · {t('roles.userCount', { count: role.userCount })}
                </p>
              </div>
              {role.isSystem && <Badge tone="gray">{t('roles.system')}</Badge>}
            </div>
            {role.description && <p className="mt-2 text-sm">{role.description}</p>}
            {role.key === 'SUPER_ADMIN' ? (
              <p className="mt-3 flex items-center gap-2 text-sm text-ink-500">
                <Lock className="size-4" aria-hidden />
                {t('roles.superAdminFixed')}
              </p>
            ) : (
              <ul className="mt-3 flex flex-wrap gap-1">
                {role.permissions.length === 0 && <li className="text-sm text-ink-500">{t('roles.noPermissions')}</li>}
                {role.permissions.map((p) => (
                  <li key={p}>
                    <Badge tone="blue">{t(permissionLabelKey(p), { defaultValue: p })}</Badge>
                  </li>
                ))}
              </ul>
            )}
            {role.key !== 'SUPER_ADMIN' && (
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(role)}>
                  {t('roles.editPermissions')}
                </Button>
                {!role.isSystem && (
                  <Button size="sm" variant="ghost" className="text-red-700" icon={<Trash2 className="size-4" aria-hidden />} onClick={() => setDeleting(role)}>
                    {t('common.delete')}
                  </Button>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
      {editing && (
        <RoleModal
          role={editing === 'new' ? null : editing}
          permissions={permissions.data ?? []}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            await queryClient.invalidateQueries({ queryKey: ['admin'] });
            notify(t('common.saved'));
            setEditing(null);
          }}
        />
      )}
      <ConfirmDialog
        open={Boolean(deleting)}
        title={t('common.confirmTitle')}
        message={t('roles.deleteConfirm', { count: deleting?.userCount ?? 0 })}
        confirmLabel={t('common.delete')}
        danger
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await api.delete(`/roles/${deleting.id}`);
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

function RoleModal({ role, permissions, onClose, onSaved }: { role: RoleRow | null; permissions: Permission[]; onClose: () => void; onSaved: () => Promise<void> }) {
  const { t } = useTranslation('admin');
  const errorMessage = useErrorMessage();
  const [selected, setSelected] = useState<Set<string>>(new Set(role?.permissions ?? []));
  const [key, setKey] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const keyValid = /^[A-Z][A-Z0-9_]{1,40}$/.test(key);

  const toggle = (p: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });

  const save = async () => {
    setError(null);
    setSaving(true);
    try {
      const list = [...selected].sort();
      if (role) await api.put(`/roles/${role.id}/permissions`, { permissions: list });
      else await api.post('/roles', { key, name: name.trim(), description: description.trim() || null, permissions: list });
      await onSaved();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={role ? t(`roles.names.${role.key}`, { defaultValue: role.name }) : t('roles.new')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={() => void save()} loading={saving} disabled={!role && (!keyValid || name.trim().length < 2)}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {!role && (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label={t('roles.key')} required hint={t('roles.keyHint')} value={key} onChange={(e) => setKey(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'))} error={key && !keyValid ? t('roles.keyHint') : undefined} />
            <TextField label={t('common.name')} required value={name} onChange={(e) => setName(e.target.value)} />
            <TextField label={t('fields.description')} value={description} onChange={(e) => setDescription(e.target.value)} wrapperClassName="sm:col-span-2" />
          </div>
        )}
        <fieldset>
          <legend className="text-sm font-semibold text-navy-950">{t('roles.permissions')}</legend>
          <p className="text-xs text-ink-500">{t('roles.permissionsHint')}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {permissions.map((p) => (
              <label key={p.key} className="flex items-start gap-2 rounded-lg p-2 text-sm hover:bg-mist-50">
                <input type="checkbox" className="mt-0.5 size-4 accent-royal-600" checked={selected.has(p.key)} onChange={() => toggle(p.key)} />
                <span>
                  <span className="font-medium">{t(permissionLabelKey(p.key), { defaultValue: p.key })}</span>
                  <code className="block text-xs text-ink-500">{p.key}</code>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        {error && <Alert kind="error">{error}</Alert>}
      </div>
    </Modal>
  );
}
