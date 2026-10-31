import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Megaphone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { z } from 'zod';
import { StatusBadge } from '../../components/common/Badge';
import { Button, ButtonLink } from '../../components/common/Button';
import { Alert, EmptyState, ErrorState, Spinner, useErrorMessage } from '../../components/common/States';
import { useToast } from '../../components/common/Toast';
import { TextArea, TextField } from '../../components/forms/Field';
import { applyServerErrors, v } from '../../components/forms/formUtils';
import { isVerifiedAlumni, useAlumniMe } from '../../features/alumni/useAlumniMe';
import { useAuth } from '../../features/auth/AuthProvider';
import { api } from '../../lib/api';
import { formatDate } from '../../lib/format';
import { SimpleText } from '../../components/common/SimpleText';

export function AlumniDashboardPage() {
  const { t } = useTranslation('alumni');
  const { user } = useAuth();
  const me = useAlumniMe();

  if (me.isLoading) return <Spinner />;
  if (me.isError) return <ErrorState error={me.error} onRetry={() => void me.refetch()} />;

  const latest = me.data?.requests[0];
  const profile = me.data?.profile;

  if (!isVerifiedAlumni(me.data)) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl sm:text-3xl">{t('portal.welcome', { name: user?.fullName })}</h1>
        <div className="card space-y-4 p-6">
          <h2 className="text-lg">{t('portal.requestStatus')}</h2>
          {!latest ? (
            <>
              <p>{t('portal.noRequest')}</p>
              <ButtonLink to="/alumni/join">{t('portal.requestCta')}</ButtonLink>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <StatusBadge status={latest.status} label={t(`portal.status.${latest.status}`)} />
                <span className="text-sm text-ink-500">{formatDate(latest.createdAt)}</span>
              </div>
              {latest.status === 'PENDING' && <p>{t('portal.pendingBody')}</p>}
              {latest.status === 'REJECTED' && (
                <>
                  <p>{t('portal.rejectedBody')}</p>
                  <div className="flex flex-wrap gap-3">
                    <ButtonLink to="/contact" variant="outline">
                      {t('common:actions.contactUs')}
                    </ButtonLink>
                    <ButtonLink to="/alumni/join">{t('portal.requestCta')}</ButtonLink>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        {profile?.archivedAt && <Alert kind="warning">{t('admin:alumni.archived')}</Alert>}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl">{t('portal.welcome', { name: profile!.displayName })}</h1>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="VERIFIED" label={t('portal.verification.VERIFIED')} />
          <StatusBadge status={profile!.publicationStatus} label={t(`portal.publication.${profile!.publicationStatus}`)} />
        </div>
      </div>
      {!profile!.isPublic && (
        <Alert>
          {t('portal.visibilityPrivate')}{' '}
          <Link to="/alumni/profile" className="font-semibold underline">
            {t('portal.nav.profile')}
          </Link>
        </Alert>
      )}
      <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
        <Announcements />
        <AssistanceForm />
      </div>
    </div>
  );
}

function Announcements() {
  const { t, i18n } = useTranslation('alumni');
  const lang = i18n.language === 'bn' ? 'bn' : 'en';
  const items = useQuery({
    queryKey: ['alumni', 'announcements', lang],
    queryFn: () => api.get<{ id: string; title: string; body: string; publishedAt: string | null }[]>('/alumni/announcements', { locale: lang }),
  });
  return (
    <section aria-labelledby="announcements-title">
      <h2 id="announcements-title" className="mb-4 flex items-center gap-2 text-xl">
        <Megaphone className="size-5 text-orange-700" aria-hidden />
        {t('portal.announcements')}
      </h2>
      {items.isLoading ? (
        <Spinner />
      ) : items.isError ? (
        <ErrorState error={items.error} />
      ) : items.data?.length === 0 ? (
        <EmptyState title={t('portal.noAnnouncements')} />
      ) : (
        <ul className="space-y-4">
          {items.data?.map((a) => (
            <li key={a.id} className="card p-5">
              <p className="text-xs text-ink-500">{formatDate(a.publishedAt)}</p>
              <h3 className="mt-1 text-lg">{a.title}</h3>
              <SimpleText text={a.body} className="prose-content mt-2 text-sm" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const assistanceSchema = z.object({ subject: v.text(200).min(2, 'validation.min:2'), message: z.string().trim().min(10, 'validation.min:10').max(5000) });

function AssistanceForm() {
  const { t } = useTranslation('alumni');
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const { register, handleSubmit, formState, setError, reset } = useForm<z.infer<typeof assistanceSchema>>({
    resolver: zodResolver(assistanceSchema),
    defaultValues: { subject: '', message: '' },
  });
  const onSubmit = handleSubmit(async (values) => {
    try {
      await api.post('/alumni/me/assistance', values);
      reset();
      notify(t('portal.assistanceSuccess'));
    } catch (error) {
      if (!applyServerErrors(error, setError)) notify(errorMessage(error), 'error');
    }
  });
  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-4 self-start p-6">
      <h2 className="text-lg">{t('portal.assistanceTitle')}</h2>
      <p className="text-sm text-ink-500">{t('portal.assistanceBody')}</p>
      <TextField label={t('portal.subject')} required error={formState.errors.subject} {...register('subject')} />
      <TextArea label={t('portal.message')} required rows={4} error={formState.errors.message} {...register('message')} />
      <Button type="submit" variant="secondary" loading={formState.isSubmitting}>
        {t('common:actions.submit')}
      </Button>
    </form>
  );
}
