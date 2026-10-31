import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Badge, StatusBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ConfirmDialog, Modal } from '../../components/common/Modal';
import { Alert, useErrorMessage } from '../../components/common/States';
import { useToast } from '../../components/common/Toast';
import { AdminHeader, DataTable, FilterSelect, SearchBox, Toolbar } from '../../components/dashboard/AdminUi';
import { Checkbox, TextField } from '../../components/forms/Field';
import { applyServerErrors } from '../../components/forms/formUtils';
import { useAdminList } from '../../features/admin/useAdminList';
import { useAuth } from '../../features/auth/AuthProvider';
import { api } from '../../lib/api';
import { formatDateTime } from '../../lib/format';

interface Role {
  id: string;
  key: string;
  name: string;
}

interface UserRow {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  roles: { key: string; name: string }[];
}

interface Invite {
  emailSent: boolean;
  inviteUrl: string | null;
}

export function useRoles() {
  return useQuery({ queryKey: ['admin', 'roles'], queryFn: () => api.get<Role[]>('/roles'), staleTime: 60_000 });
}

export function InviteNotice({ invite }: { invite: Invite }) {
  const { t } = useTranslation('admin');
  if (invite.emailSent) return <Alert kind="success">{t('users.inviteSent')}</Alert>;
  return (
    <Alert kind="warning">
      <p>{t('users.inviteManual')}</p>
      {invite.inviteUrl && <code className="mt-2 block text-xs break-all select-all">{invite.inviteUrl}</code>}
    </Alert>
  );
}

export function UsersPage() {
  const { t } = useTranslation('admin');
  const { user: me } = useAuth();
  const list = useAdminList<UserRow>('/users');
  const roles = useRoles();
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const [editing, setEditing] = useState<UserRow | 'new' | null>(null);
  const [revoking, setRevoking] = useState<UserRow | null>(null);
  const [deleting, setDeleting] = useState<UserRow | null>(null);
  const [invite, setInvite] = useState<Invite | null>(null);
  const roleName = (key: string, fallback: string) => t(`roles.names.${key}`, { defaultValue: fallback });

  return (
    <div>
      <AdminHeader
        title={t('users.title')}
        description={t('users.description')}
        actions={
          <Button onClick={() => setEditing('new')} icon={<UserPlus className="size-4" aria-hidden />}>
            {t('users.invite')}
          </Button>
        }
      />
      {invite && (
        <div className="mb-4">
          <InviteNotice invite={invite} />
        </div>
      )}
      <Toolbar>
        <SearchBox onSearch={list.setSearch} />
        <FilterSelect label={t('fields.role')} value={list.params.filters.role ?? ''} onChange={(v) => list.setFilter('role', v)} options={(roles.data ?? []).map((r) => ({ value: r.key, label: roleName(r.key, r.name) }))} />
        <FilterSelect
          label={t('common.status')}
          value={list.params.filters.isActive ?? ''}
          onChange={(v) => list.setFilter('isActive', v)}
          options={[
            { value: 'true', label: t('status.ACTIVE') },
            { value: 'false', label: t('status.INACTIVE') },
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
            key: 'name',
            header: t('common.name'),
            cell: (r) => (
              <div>
                <p className="font-semibold text-navy-950">{r.fullName}</p>
                <p className="text-xs text-ink-500">{r.email}</p>
              </div>
            ),
          },
          {
            key: 'roles',
            header: t('fields.roles'),
            cell: (r) => (
              <div className="flex flex-wrap gap-1">
                {r.roles.map((role) => (
                  <Badge key={role.key} tone={role.key === 'SUPER_ADMIN' ? 'orange' : 'blue'}>
                    {roleName(role.key, role.name)}
                  </Badge>
                ))}
              </div>
            ),
          },
          { key: 'last', header: t('fields.lastLogin'), cell: (r) => (r.lastLoginAt ? formatDateTime(r.lastLoginAt) : t('users.never')) },
          { key: 'status', header: t('common.status'), cell: (r) => <StatusBadge status={r.isActive ? 'ACTIVE' : 'INACTIVE'} label={t(r.isActive ? 'status.ACTIVE' : 'status.INACTIVE')} /> },
          {
            key: 'actions',
            header: <span className="sr-only">{t('common.actions')}</span>,
            className: 'text-right whitespace-nowrap',
            cell: (r) => (
              <div className="flex justify-end gap-1">
                <Button size="sm" variant="ghost" onClick={() => setEditing(r)}>
                  {t('common.edit')}
                </Button>
                {!r.lastLoginAt && r.isActive && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      try {
                        setInvite(await api.post<Invite>(`/users/${r.id}/invite`));
                      } catch (error) {
                        notify(errorMessage(error), 'error');
                      }
                    }}
                  >
                    {t('users.resendInvite')}
                  </Button>
                )}
                {r.id !== me?.id && (
                  <Button size="sm" variant="ghost" onClick={() => setRevoking(r)}>
                    {t('users.revokeSessions')}
                  </Button>
                )}
                {r.id !== me?.id && (!r.roles.some((role) => role.key === 'SUPER_ADMIN') || me?.roles.includes('SUPER_ADMIN')) && (
                  <Button size="sm" variant="ghost" className="text-red-700" onClick={() => setDeleting(r)}>
                    {t('common.delete')}
                  </Button>
                )}
              </div>
            ),
          },
        ]}
      />
      {editing && (
        <UserModal
          user={editing === 'new' ? null : editing}
          roles={roles.data ?? []}
          canGrantSuper={Boolean(me?.roles.includes('SUPER_ADMIN'))}
          isSelf={editing !== 'new' && editing.id === me?.id}
          onClose={() => setEditing(null)}
          onSaved={async (result) => {
            await queryClient.invalidateQueries({ queryKey: ['admin'] });
            notify(t('common.saved'));
            if (result) setInvite(result);
            setEditing(null);
          }}
        />
      )}
      <ConfirmDialog
        open={Boolean(revoking)}
        title={t('users.revokeSessions')}
        message={t('users.revokeConfirm', { name: revoking?.fullName ?? '' })}
        confirmLabel={t('users.revokeSessions')}
        danger
        onCancel={() => setRevoking(null)}
        onConfirm={async () => {
          if (!revoking) return;
          try {
            await api.post(`/users/${revoking.id}/revoke-sessions`);
            notify(t('users.sessionsRevoked'));
          } catch (error) {
            notify(errorMessage(error), 'error');
          }
          setRevoking(null);
        }}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title={t('common.delete')}
        message={t('users.deleteConfirm', { name: deleting?.fullName ?? '' })}
        confirmLabel={t('common.delete')}
        danger
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await api.delete(`/users/${deleting.id}`);
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

interface UserForm {
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  roleKeys: string[];
}

function UserModal({
  user,
  roles,
  canGrantSuper,
  isSelf,
  onClose,
  onSaved,
}: {
  user: UserRow | null;
  roles: Role[];
  canGrantSuper: boolean;
  isSelf: boolean;
  onClose: () => void;
  onSaved: (invite: Invite | null) => Promise<void>;
}) {
  const { t } = useTranslation('admin');
  const errorMessage = useErrorMessage();
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, formState, setError } = useForm<UserForm>({
    defaultValues: {
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      isActive: user?.isActive ?? true,
      roleKeys: user?.roles.map((r) => r.key) ?? [],
    },
  });
  const targetIsSuper = Boolean(user?.roles.some((r) => r.key === 'SUPER_ADMIN'));
  const locked = targetIsSuper && !canGrantSuper;

  const submit = handleSubmit(async (v) => {
    setFormError(null);
    const roleKeys = Array.isArray(v.roleKeys) ? v.roleKeys : v.roleKeys ? [v.roleKeys] : [];
    if (isSelf && targetIsSuper && !roleKeys.includes('SUPER_ADMIN')) roleKeys.push('SUPER_ADMIN');
    try {
      if (user) {
        await api.patch(`/users/${user.id}`, { fullName: v.fullName.trim(), phone: v.phone.trim() || null, ...(isSelf ? {} : { isActive: Boolean(v.isActive) }), roleKeys });
        await onSaved(null);
      } else {
        const result = await api.post<Invite>('/users', { fullName: v.fullName.trim(), email: v.email.trim(), phone: v.phone.trim() || null, roleKeys });
        await onSaved(result);
      }
    } catch (error) {
      if (!applyServerErrors(error, setError)) setFormError(errorMessage(error));
    }
  });

  return (
    <Modal
      open
      onClose={onClose}
      title={user ? t('users.editTitle') : t('users.invite')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="user-form" loading={formState.isSubmitting} disabled={locked}>
            {user ? t('common.save') : t('users.sendInvite')}
          </Button>
        </>
      }
    >
      <form id="user-form" onSubmit={submit} noValidate className="space-y-4">
        {locked && <Alert kind="info">{t('users.superLocked')}</Alert>}
        <TextField label={t('fields.fullName')} required error={formState.errors.fullName?.message} {...register('fullName', { required: t('common:validation.required') })} />
        <TextField label={t('fields.email')} type="email" required={!user} disabled={Boolean(user)} error={formState.errors.email?.message} {...register('email', { required: user ? false : t('common:validation.required') })} />
        <TextField label={t('fields.phone')} type="tel" {...register('phone')} />
        <fieldset>
          <legend className="text-sm font-semibold text-navy-950">{t('fields.roles')}</legend>
          <p className="text-xs text-ink-500">{t('users.rolesHint')}</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {roles.map((role) => (
              <Checkbox
                key={role.key}
                value={role.key}
                label={t(`roles.names.${role.key}`, { defaultValue: role.name })}
                disabled={role.key === 'SUPER_ADMIN' && (!canGrantSuper || isSelf)}
                {...register('roleKeys')}
              />
            ))}
          </div>
        </fieldset>
        {user && <Checkbox label={t('fields.active')} disabled={isSelf} {...register('isActive')} />}
        {formError && <Alert kind="error">{formError}</Alert>}
      </form>
    </Modal>
  );
}
