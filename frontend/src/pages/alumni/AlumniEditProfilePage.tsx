import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { z } from 'zod';
import { StatusBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Alert, ErrorState, Spinner, useErrorMessage } from '../../components/common/States';
import { useToast } from '../../components/common/Toast';
import { Checkbox, TextArea, TextField } from '../../components/forms/Field';
import { applyServerErrors, v } from '../../components/forms/formUtils';
import { ChangePasswordForm } from '../../features/auth/AccountForms';
import { ALUMNI_ME_KEY, isVerifiedAlumni, useAlumniMe, type OwnAlumniProfile } from '../../features/alumni/useAlumniMe';
import { api, ApiError } from '../../lib/api';

const tags = z
  .string()
  .max(1000)
  .refine((s) => s.split(',').filter((x) => x.trim()).length <= 20, 'validation.invalid');

const schema = z.object({
  displayName: v.text(120).min(2, 'validation.min:2'),
  professionalTitle: v.optionalText(160),
  organization: v.optionalText(160),
  professionalField: v.optionalText(120),
  skills: tags,
  interests: tags,
  bioEn: v.optionalText(3000),
  bioBn: v.optionalText(3000),
  linkedinUrl: v.optionalUrl(),
  portfolioUrl: v.optionalUrl(),
  contactEmail: v.optionalEmail(),
  contactPhone: v.optionalPhone(),
});
type FormValues = z.infer<typeof schema>;

const toTags = (s: string) => [...new Set(s.split(',').map((x) => x.trim().slice(0, 40)).filter(Boolean))];
const orNull = (s: string) => (s.trim() ? s.trim() : null);

export function AlumniEditProfilePage() {
  const { t } = useTranslation('alumni');
  const me = useAlumniMe();
  if (me.isLoading) return <Spinner />;
  if (me.isError) return <ErrorState error={me.error} onRetry={() => void me.refetch()} />;
  if (!isVerifiedAlumni(me.data)) {
    return (
      <Alert>
        {t('portal.requiresVerification')}{' '}
        <Link to="/alumni/dashboard" className="font-semibold underline">
          {t('portal.nav.dashboard')}
        </Link>
      </Alert>
    );
  }
  const profile = me.data!.profile!;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl">{t('portal.nav.profile')}</h1>
      <VisibilityCard profile={profile} />
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <ProfileForm profile={profile} />
        <div className="space-y-6">
          <PhotoCard />
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}

function VisibilityCard({ profile }: { profile: OwnAlumniProfile }) {
  const { t } = useTranslation('alumni');
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);

  const setVisibility = async (isPublic: boolean) => {
    setBusy(true);
    try {
      const updated = await api.put<OwnAlumniProfile>('/alumni/me/visibility', isPublic ? { isPublic, consent } : { isPublic });
      queryClient.setQueryData(ALUMNI_ME_KEY, (old: { profile: OwnAlumniProfile } | undefined) => (old ? { ...old, profile: updated } : old));
      setConsent(false);
      notify(t('portal.profileSaved'));
    } catch (error) {
      notify(errorMessage(error), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card space-y-4 p-6" aria-labelledby="visibility-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="visibility-title" className="flex items-center gap-2 text-lg">
          {profile.isPublic ? <Eye className="size-5 text-royal-600" aria-hidden /> : <EyeOff className="size-5 text-ink-500" aria-hidden />}
          {t('portal.visibilityTitle')}
        </h2>
        <StatusBadge status={profile.publicationStatus} label={t(`portal.publication.${profile.publicationStatus}`)} />
      </div>
      {profile.isPublic ? (
        <>
          {profile.publicationStatus === 'APPROVED' && (
            <p className="text-sm">
              <Link to={`/alumni/${profile.slug}`} className="font-semibold text-royal-700 underline">
                /alumni/{profile.slug}
              </Link>
            </p>
          )}
          {profile.pendingChanges && Object.keys(profile.pendingChanges).length > 0 && <Alert kind="warning">{t('portal.pendingChanges')}</Alert>}
          <Button variant="outline" onClick={() => void setVisibility(false)} loading={busy}>
            {t('portal.makePrivate')}
          </Button>
        </>
      ) : (
        <>
          <p className="text-sm">{t('portal.visibilityPrivate')}</p>
          <Checkbox label={t('portal.visibilityConsent')} checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <Button onClick={() => void setVisibility(true)} disabled={!consent} loading={busy}>
            {t('portal.makePublic')}
          </Button>
        </>
      )}
    </section>
  );
}

function ProfileForm({ profile }: { profile: OwnAlumniProfile }) {
  const { t } = useTranslation('alumni');
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  // Show pending (unreviewed) edits so the alumnus continues from their latest version.
  const current = { ...profile, ...(profile.pendingChanges ?? {}) } as OwnAlumniProfile;
  const { register, handleSubmit, formState, setError } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      displayName: current.displayName,
      professionalTitle: current.professionalTitle ?? '',
      organization: current.organization ?? '',
      professionalField: current.professionalField ?? '',
      skills: (current.skills ?? []).join(', '),
      interests: (current.interests ?? []).join(', '),
      bioEn: current.bioEn ?? '',
      bioBn: current.bioBn ?? '',
      linkedinUrl: current.linkedinUrl ?? '',
      portfolioUrl: current.portfolioUrl ?? '',
      contactEmail: profile.contactEmail ?? '',
      contactPhone: profile.contactPhone ?? '',
    },
  });
  const errors = formState.errors;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const updated = await api.patch<OwnAlumniProfile>('/alumni/me', {
        displayName: values.displayName,
        professionalTitle: orNull(values.professionalTitle),
        organization: orNull(values.organization),
        professionalField: orNull(values.professionalField),
        skills: toTags(values.skills),
        interests: toTags(values.interests),
        bioEn: orNull(values.bioEn),
        bioBn: orNull(values.bioBn),
        linkedinUrl: orNull(values.linkedinUrl),
        portfolioUrl: orNull(values.portfolioUrl),
        contactEmail: orNull(values.contactEmail),
        contactPhone: orNull(values.contactPhone),
      });
      queryClient.setQueryData(ALUMNI_ME_KEY, (old: { profile: OwnAlumniProfile } | undefined) => (old ? { ...old, profile: updated } : old));
      notify(updated.publicationStatus === 'APPROVED' ? t('portal.pendingChanges') : t('portal.profileSaved'));
    } catch (error) {
      if (!applyServerErrors(error, setError)) notify(errorMessage(error), 'error');
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label={t('portal.fields.displayName')} required error={errors.displayName} {...register('displayName')} />
        <TextField label={t('portal.fields.professionalTitle')} error={errors.professionalTitle} {...register('professionalTitle')} />
        <TextField label={t('portal.fields.organization')} error={errors.organization} {...register('organization')} />
        <TextField label={t('portal.fields.professionalField')} error={errors.professionalField} {...register('professionalField')} />
        <TextField label={t('portal.fields.skills')} error={errors.skills} {...register('skills')} />
        <TextField label={t('portal.fields.interests')} error={errors.interests} {...register('interests')} />
      </div>
      <TextArea label={t('portal.fields.bioEn')} rows={4} error={errors.bioEn} {...register('bioEn')} />
      <TextArea label={t('portal.fields.bioBn')} rows={4} lang="bn" error={errors.bioBn} {...register('bioBn')} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label={t('portal.fields.linkedinUrl')} type="url" placeholder="https://" error={errors.linkedinUrl} {...register('linkedinUrl')} />
        <TextField label={t('portal.fields.portfolioUrl')} type="url" placeholder="https://" error={errors.portfolioUrl} {...register('portfolioUrl')} />
      </div>
      <fieldset className="space-y-4 rounded-xl bg-mist-50 p-4">
        <legend className="flex items-center gap-1.5 px-1 text-sm font-semibold text-navy-950">
          <Lock className="size-4" aria-hidden />
          {t('portal.privateNote')}
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label={t('portal.fields.contactEmail')} type="email" error={errors.contactEmail} {...register('contactEmail')} />
          <TextField label={t('portal.fields.contactPhone')} type="tel" error={errors.contactPhone} {...register('contactPhone')} />
        </div>
      </fieldset>
      <Button type="submit" loading={formState.isSubmitting}>
        {t('common:actions.save')}
      </Button>
    </form>
  );
}

function PhotoCard() {
  const { t } = useTranslation('alumni');
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const [busy, setBusy] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const form = new FormData();
      form.append('purpose', 'alumni-photo');
      form.append('altText', t('portal.fields.photo'));
      form.append('file', file);
      const asset = await api.post<{ id: string }>('/media', form);
      await api.patch('/alumni/me', { photoAssetId: asset.id });
      await queryClient.invalidateQueries({ queryKey: ALUMNI_ME_KEY });
      notify(t('portal.profileSaved'));
    } catch (error) {
      if (error instanceof ApiError && error.code === 'STORAGE_NOT_CONFIGURED') setUnavailable(true);
      else notify(errorMessage(error), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card space-y-3 p-6">
      <h2 className="text-lg">{t('portal.fields.photo')}</h2>
      {unavailable ? (
        <Alert kind="warning">{t('portal.photoUnavailable')}</Alert>
      ) : (
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={busy}
          aria-label={t('portal.fields.photo')}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
            e.target.value = '';
          }}
          className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-sky-50 file:px-4 file:py-2 file:font-semibold file:text-royal-700"
        />
      )}
    </div>
  );
}
