import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Badge, StatusBadge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Alert, ErrorState, Spinner, useErrorMessage } from '../../../components/common/States';
import { useToast } from '../../../components/common/Toast';
import { AdminHeader, DataTable, DetailList, FilterSelect, SearchBox, Toolbar } from '../../../components/dashboard/AdminUi';
import { SelectField, TextArea, TextField } from '../../../components/forms/Field';
import { applyServerErrors } from '../../../components/forms/formUtils';
import { useCohortOptions, useCourseOptions } from '../../../features/admin/lookups';
import { useAdminList } from '../../../features/admin/useAdminList';
import { useAuth } from '../../../features/auth/AuthProvider';
import { api } from '../../../lib/api';
import { formatDate } from '../../../lib/format';

interface ProfileRow {
  id: string;
  slug: string;
  displayName: string;
  graduationYear: number | null;
  verificationStatus: string;
  publicationStatus: string;
  isPublic: boolean;
  pendingChanges: Record<string, unknown> | null;
  archivedAt: string | null;
  updatedAt: string;
  user: { email: string };
  cohort: { name: string } | null;
}

interface ProfileDetail extends ProfileRow {
  cohortId: string | null;
  courseId: string | null;
  programName: string | null;
  professionalTitle: string | null;
  organization: string | null;
  professionalField: string | null;
  skills: string[];
  interests: string[];
  bioEn: string | null;
  bioBn: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  publicConsentAt: string | null;
  reviewNote: string | null;
  user: { email: string; fullName: string };
  stories: { id: string; titleEn: string | null; status: string }[];
}

const show = (v: unknown) => (Array.isArray(v) ? v.join(', ') : v == null || v === '' ? '—' : String(v));

export function AlumniProfilesPage() {
  const { t } = useTranslation('admin');
  const list = useAdminList<ProfileRow>('/admin/alumni/profiles', { initialFilters: { archived: 'false' } });
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      <AdminHeader title={t('alumniAdmin.profiles.title')} description={t('alumniAdmin.profiles.description')} />
      <Toolbar>
        <SearchBox onSearch={list.setSearch} />
        <FilterSelect
          label={t('alumniAdmin.verification')}
          value={list.params.filters.verificationStatus ?? ''}
          onChange={(v) => list.setFilter('verificationStatus', v)}
          options={['PENDING', 'VERIFIED', 'REJECTED'].map((s) => ({ value: s, label: t(`status.${s}`) }))}
        />
        <FilterSelect
          label={t('alumniAdmin.publication')}
          value={list.params.filters.publicationStatus ?? ''}
          onChange={(v) => list.setFilter('publicationStatus', v)}
          options={['NOT_SUBMITTED', 'PENDING', 'APPROVED', 'REJECTED'].map((s) => ({ value: s, label: t(`status.${s}`) }))}
        />
        <FilterSelect
          label={t('alumniAdmin.archived')}
          value={list.params.filters.archived ?? ''}
          onChange={(v) => list.setFilter('archived', v)}
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
        onRowClick={(r) => setOpenId(r.id)}
        columns={[
          {
            key: 'name',
            header: t('common.name'),
            cell: (r) => (
              <button type="button" className="text-left font-semibold text-navy-950 hover:underline" onClick={() => setOpenId(r.id)}>
                {r.displayName}
                <span className="block text-xs font-normal text-ink-500">{r.user.email}</span>
              </button>
            ),
          },
          { key: 'year', header: t('fields.graduationYear'), cell: (r) => r.graduationYear ?? '—' },
          { key: 'cohort', header: t('fields.cohort'), cell: (r) => r.cohort?.name ?? '—' },
          { key: 'verification', header: t('alumniAdmin.verification'), cell: (r) => <StatusBadge status={r.verificationStatus} label={t(`status.${r.verificationStatus}`)} /> },
          {
            key: 'publication',
            header: t('alumniAdmin.publication'),
            cell: (r) => (
              <div className="flex flex-wrap gap-1">
                <StatusBadge status={r.publicationStatus} label={t(`status.${r.publicationStatus}`)} />
                {r.pendingChanges && <Badge tone="orange">{t('alumniAdmin.profiles.changesPending')}</Badge>}
                {r.archivedAt && <Badge tone="gray">{t('alumniAdmin.archived')}</Badge>}
              </div>
            ),
          },
          { key: 'updated', header: t('common.updated'), cell: (r) => formatDate(r.updatedAt) },
        ]}
      />
      {openId && <ProfileModal id={openId} onClose={() => setOpenId(null)} />}
    </div>
  );
}

interface AdminForm {
  displayName: string;
  cohortId: string;
  courseId: string;
  graduationYear: string;
  programName: string;
}

function ProfileModal({ id, onClose }: { id: string; onClose: () => void }) {
  const { t } = useTranslation('admin');
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const detail = useQuery({ queryKey: ['admin', 'alumni-profile', id], queryFn: () => api.get<ProfileDetail>(`/admin/alumni/profiles/${id}`) });
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (name: string, fn: () => Promise<unknown>, message: string) => {
    setBusy(name);
    try {
      await fn();
      await queryClient.invalidateQueries({ queryKey: ['admin'] });
      await queryClient.invalidateQueries({ queryKey: ['alumni'] });
      notify(message);
      setNote('');
    } catch (error) {
      notify(errorMessage(error), 'error');
    } finally {
      setBusy(null);
    }
  };

  const p = detail.data;
  const pending = p?.pendingChanges ? Object.entries(p.pendingChanges) : [];
  const awaitingReview = Boolean(p && (p.publicationStatus === 'PENDING' || pending.length));
  const consented = Boolean(p?.isPublic && p.publicConsentAt);
  const isLive = Boolean(p && p.verificationStatus === 'VERIFIED' && consented && p.publicationStatus === 'APPROVED' && !p.archivedAt);

  return (
    <Modal open onClose={onClose} size="xl" title={p?.displayName ?? t('alumniAdmin.profiles.title')}>
      {detail.isLoading ? (
        <Spinner />
      ) : detail.isError || !p ? (
        <ErrorState error={detail.error} />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={p.verificationStatus} label={t(`status.${p.verificationStatus}`)} />
            <StatusBadge status={p.publicationStatus} label={t(`status.${p.publicationStatus}`)} />
            <Badge tone={consented ? 'green' : 'gray'}>{consented ? t('alumniAdmin.profiles.consentGiven', { date: formatDate(p.publicConsentAt!) }) : t('alumniAdmin.profiles.noConsent')}</Badge>
            {p.archivedAt && <Badge tone="gray">{t('alumniAdmin.archived')}</Badge>}
            {isLive && (
              <a href={`/alumni/${p.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-royal-700 hover:underline">
                {t('alumniAdmin.profiles.viewPublic')}
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            )}
          </div>

          {awaitingReview && (
            <section className="space-y-3 rounded-xl bg-orange-50 p-4 ring-1 ring-orange-200">
              <h3 className="font-bold text-navy-950">{t('alumniAdmin.profiles.reviewTitle')}</h3>
              {!consented && <Alert kind="warning">{t('alumniAdmin.profiles.consentRequired')}</Alert>}
              {pending.length > 0 && (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs text-ink-500 uppercase">
                      <th className="py-1 pr-3">{t('alumniAdmin.profiles.field')}</th>
                      <th className="py-1 pr-3">{t('alumniAdmin.profiles.current')}</th>
                      <th className="py-1">{t('alumniAdmin.profiles.proposed')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pending.map(([field, value]) => (
                      <tr key={field} className="border-t border-orange-200 align-top">
                        <td className="py-2 pr-3 font-medium">{t(`alumniAdmin.profileFields.${field}`, { defaultValue: field })}</td>
                        <td className="py-2 pr-3 whitespace-pre-line text-ink-500">{show((p as unknown as Record<string, unknown>)[field])}</td>
                        <td className="py-2 whitespace-pre-line">{show(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <TextArea label={t('alumniAdmin.reviewNote')} hint={t('alumniAdmin.reviewNoteHint')} rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
              <div className="flex flex-wrap gap-2">
                <Button
                  loading={busy === 'approve'}
                  disabled={busy !== null || !consented || p.verificationStatus !== 'VERIFIED'}
                  onClick={() => void run('approve', () => api.post(`/admin/alumni/profiles/${id}/publication/approve`, { note: note.trim() || null }), t('alumniAdmin.profiles.approved'))}
                >
                  {t('alumniAdmin.profiles.approve')}
                </Button>
                <Button
                  variant="danger"
                  loading={busy === 'reject'}
                  disabled={busy !== null}
                  onClick={() => void run('reject', () => api.post(`/admin/alumni/profiles/${id}/publication/reject`, { note: note.trim() || null }), t('alumniAdmin.profiles.rejected'))}
                >
                  {t('alumniAdmin.profiles.reject')}
                </Button>
              </div>
            </section>
          )}

          <DetailList
            items={[
              { label: t('fields.email'), value: p.user.email },
              { label: t('alumniAdmin.profileFields.professionalTitle'), value: p.professionalTitle },
              { label: t('alumniAdmin.profileFields.organization'), value: p.organization },
              { label: t('alumniAdmin.profileFields.professionalField'), value: p.professionalField },
              { label: t('alumniAdmin.profileFields.skills'), value: p.skills.join(', ') || null },
              { label: t('alumniAdmin.profileFields.contactEmail'), value: p.contactEmail },
              { label: t('alumniAdmin.profileFields.linkedinUrl'), value: p.linkedinUrl },
              { label: t('alumniAdmin.profileFields.portfolioUrl'), value: p.portfolioUrl },
            ]}
          />
          {(p.bioEn || p.bioBn) && (
            <div className="grid gap-3 sm:grid-cols-2">
              {p.bioEn && <p className="rounded-xl bg-mist-50 p-3 text-sm whitespace-pre-line">{p.bioEn}</p>}
              {p.bioBn && (
                <p lang="bn" className="rounded-xl bg-mist-50 p-3 text-sm whitespace-pre-line">
                  {p.bioBn}
                </p>
              )}
            </div>
          )}

          <AdminEditForm profile={p} />

          <div className="flex flex-wrap items-center gap-2 border-t border-mist-200 pt-4">
            {p.archivedAt ? (
              <Button variant="outline" loading={busy === 'unarchive'} onClick={() => void run('unarchive', () => api.post(`/admin/alumni/profiles/${id}/unarchive`), t('common.saved'))}>
                {t('alumniAdmin.unarchive')}
              </Button>
            ) : (
              <Button variant="ghost" className="text-red-700" loading={busy === 'archive'} onClick={() => void run('archive', () => api.post(`/admin/alumni/profiles/${id}/archive`), t('common.saved'))}>
                {t('alumniAdmin.archive')}
              </Button>
            )}
            <p className="text-xs text-ink-500">{t('alumniAdmin.archiveHelp')}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}

function AdminEditForm({ profile }: { profile: ProfileDetail }) {
  const { t } = useTranslation('admin');
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const { can } = useAuth();
  const canCourses = can('courses.manage');
  const cohorts = useCohortOptions();
  const courses = useCourseOptions(canCourses);
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, formState, setError } = useForm<AdminForm>({
    defaultValues: {
      displayName: profile.displayName,
      cohortId: profile.cohortId ?? '',
      courseId: profile.courseId ?? '',
      graduationYear: profile.graduationYear ? String(profile.graduationYear) : '',
      programName: profile.programName ?? '',
    },
  });

  const submit = handleSubmit(async (v) => {
    setFormError(null);
    try {
      await api.patch(`/admin/alumni/profiles/${profile.id}`, {
        displayName: v.displayName.trim(),
        cohortId: v.cohortId || null,
        ...(canCourses ? { courseId: v.courseId || null } : {}),
        graduationYear: v.graduationYear ? Number(v.graduationYear) : null,
        programName: v.programName.trim() || null,
      });
      await queryClient.invalidateQueries({ queryKey: ['admin'] });
      notify(t('common.saved'));
    } catch (error) {
      if (!applyServerErrors(error, setError)) setFormError(errorMessage(error));
    }
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-4 rounded-xl p-4 ring-1 ring-mist-200">
      <h3 className="font-bold text-navy-950">{t('alumniAdmin.profiles.recordTitle')}</h3>
      <p className="text-xs text-ink-500">{t('alumniAdmin.profiles.recordHelp')}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label={t('alumniAdmin.profileFields.displayName')} required error={formState.errors.displayName?.message} {...register('displayName', { required: t('common:validation.required') })} />
        <TextField label={t('fields.graduationYear')} type="number" min={1990} max={2100} error={formState.errors.graduationYear?.message} {...register('graduationYear')} />
        <SelectField label={t('fields.cohort')} placeholder="—" options={cohorts.data ?? []} {...register('cohortId')} />
        {canCourses && <SelectField label={t('fields.course')} placeholder="—" options={courses.data ?? []} {...register('courseId')} />}
        <TextField label={t('alumniAdmin.profileFields.programName')} wrapperClassName="sm:col-span-2" {...register('programName')} />
      </div>
      {formError && <Alert kind="error">{formError}</Alert>}
      <Button type="submit" size="sm" variant="secondary" loading={formState.isSubmitting}>
        {t('common.save')}
      </Button>
    </form>
  );
}
