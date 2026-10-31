import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { z } from 'zod';
import { StatusBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Alert, EmptyState, ErrorState, Spinner, useErrorMessage } from '../../components/common/States';
import { useToast } from '../../components/common/Toast';
import { TextArea, TextField } from '../../components/forms/Field';
import { applyServerErrors, v } from '../../components/forms/formUtils';
import { isVerifiedAlumni, useAlumniMe } from '../../features/alumni/useAlumniMe';
import { api } from '../../lib/api';
import { formatDate } from '../../lib/format';

interface MyStory {
  id: string;
  slug: string;
  titleEn: string | null;
  titleBn: string | null;
  excerptEn: string | null;
  excerptBn: string | null;
  bodyEn: string | null;
  bodyBn: string | null;
  status: 'SUBMITTED' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED';
  publishedAt: string | null;
  createdAt: string;
}

const schema = z
  .object({
    titleEn: v.optionalText(200),
    titleBn: v.optionalText(200),
    excerptEn: v.optionalText(500),
    excerptBn: v.optionalText(500),
    bodyEn: v.optionalText(20000),
    bodyBn: v.optionalText(20000),
  })
  .refine((s) => (s.titleEn && s.bodyEn) || (s.titleBn && s.bodyBn), { path: ['titleEn'], message: 'validation.required' });
type FormValues = z.infer<typeof schema>;
const empty: FormValues = { titleEn: '', titleBn: '', excerptEn: '', excerptBn: '', bodyEn: '', bodyBn: '' };

export function AlumniMyStoriesPage() {
  const { t } = useTranslation('alumni');
  const me = useAlumniMe();
  const verified = isVerifiedAlumni(me.data);
  const stories = useQuery({ queryKey: ['alumni', 'my-stories'], queryFn: () => api.get<MyStory[]>('/alumni/me/stories'), enabled: verified });
  const [editing, setEditing] = useState<MyStory | 'new' | null>(null);

  if (me.isLoading) return <Spinner />;
  if (!verified) {
    return (
      <Alert>
        {t('portal.requiresVerification')}{' '}
        <Link to="/alumni/dashboard" className="font-semibold underline">
          {t('portal.nav.dashboard')}
        </Link>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl">{t('portal.stories.title')}</h1>
          <p className="mt-1 text-sm text-ink-500">{t('portal.stories.intro')}</p>
        </div>
        <Button onClick={() => setEditing('new')} icon={<Plus className="size-4" aria-hidden />}>
          {t('portal.stories.new')}
        </Button>
      </div>
      {stories.isLoading ? (
        <Spinner />
      ) : stories.isError ? (
        <ErrorState error={stories.error} onRetry={() => void stories.refetch()} />
      ) : stories.data?.length === 0 ? (
        <EmptyState title={t('portal.stories.empty')} />
      ) : (
        <ul className="space-y-4">
          {stories.data?.map((s) => (
            <li key={s.id} className="card flex flex-wrap items-start justify-between gap-4 p-5">
              <div className="min-w-0">
                <h2 className="text-lg">{s.titleEn || s.titleBn}</h2>
                <p className="text-sm text-ink-500">{formatDate(s.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={s.status} label={t(`portal.stories.status.${s.status}`)} />
                {s.status === 'PUBLISHED' ? (
                  <Link to={`/alumni/story/${s.slug}`} className="text-sm font-semibold text-royal-700 hover:underline">
                    {t('common:actions.readMore')}
                  </Link>
                ) : (
                  s.status !== 'ARCHIVED' && (
                    <Button size="sm" variant="outline" onClick={() => setEditing(s)}>
                      {t('common:actions.edit')}
                    </Button>
                  )
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {editing && <StoryForm story={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function StoryForm({ story, onClose }: { story: MyStory | null; onClose: () => void }) {
  const { t } = useTranslation('alumni');
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const { register, handleSubmit, formState, setError } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: story
      ? {
          titleEn: story.titleEn ?? '',
          titleBn: story.titleBn ?? '',
          excerptEn: story.excerptEn ?? '',
          excerptBn: story.excerptBn ?? '',
          bodyEn: story.bodyEn ?? '',
          bodyBn: story.bodyBn ?? '',
        }
      : empty,
  });
  const errors = formState.errors;

  const onSubmit = handleSubmit(async (values) => {
    const payload = Object.fromEntries(Object.entries(values).map(([k, val]) => [k, val.trim() || null]));
    try {
      if (story) await api.put(`/alumni/me/stories/${story.id}`, payload);
      else await api.post('/alumni/me/stories', payload);
      await queryClient.invalidateQueries({ queryKey: ['alumni', 'my-stories'] });
      notify(t('portal.stories.submitted'));
      onClose();
    } catch (error) {
      if (!applyServerErrors(error, setError)) notify(errorMessage(error), 'error');
    }
  });

  return (
    <Modal
      open
      onClose={onClose}
      size="xl"
      title={story ? t('common:actions.edit') : t('portal.stories.new')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common:actions.cancel')}
          </Button>
          <Button type="submit" form="story-form" loading={formState.isSubmitting}>
            {t('common:actions.submit')}
          </Button>
        </>
      }
    >
      <form id="story-form" onSubmit={onSubmit} noValidate className="space-y-5">
        <Alert>{t('portal.stories.languageHint')}</Alert>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-4">
            <TextField label={t('portal.stories.titleEn')} error={errors.titleEn} {...register('titleEn')} />
            <TextArea label={t('portal.stories.excerptEn')} rows={2} error={errors.excerptEn} {...register('excerptEn')} />
            <TextArea label={t('portal.stories.bodyEn')} rows={10} error={errors.bodyEn} {...register('bodyEn')} />
          </div>
          <div className="space-y-4" lang="bn">
            <TextField label={t('portal.stories.titleBn')} error={errors.titleBn} {...register('titleBn')} />
            <TextArea label={t('portal.stories.excerptBn')} rows={2} error={errors.excerptBn} {...register('excerptBn')} />
            <TextArea label={t('portal.stories.bodyBn')} rows={10} error={errors.bodyBn} {...register('bodyBn')} />
          </div>
        </div>
      </form>
    </Modal>
  );
}
