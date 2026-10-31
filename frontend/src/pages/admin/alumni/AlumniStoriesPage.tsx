import { useQueryClient } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Alert, useErrorMessage } from '../../../components/common/States';
import { useToast } from '../../../components/common/Toast';
import { AdminHeader, DataTable, FilterSelect, SearchBox, Toolbar } from '../../../components/dashboard/AdminUi';
import { TextArea, TextField } from '../../../components/forms/Field';
import { applyServerErrors } from '../../../components/forms/formUtils';
import { useAdminList } from '../../../features/admin/useAdminList';
import { api } from '../../../lib/api';
import { formatDate } from '../../../lib/format';

type StoryStatus = 'SUBMITTED' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED';

interface Story {
  id: string;
  slug: string;
  titleEn: string | null;
  titleBn: string | null;
  excerptEn: string | null;
  excerptBn: string | null;
  bodyEn: string | null;
  bodyBn: string | null;
  status: StoryStatus;
  reviewNote: string | null;
  publishedAt: string | null;
  createdAt: string;
  author: { id: string; displayName: string; slug: string };
}

const TRANSITIONS: Record<'publish' | 'reject' | 'archive', StoryStatus[]> = {
  publish: ['SUBMITTED', 'REJECTED', 'ARCHIVED'],
  reject: ['SUBMITTED'],
  archive: ['PUBLISHED', 'SUBMITTED', 'REJECTED'],
};

type StoryForm = Pick<Story, 'titleEn' | 'titleBn' | 'excerptEn' | 'excerptBn' | 'bodyEn' | 'bodyBn'>;
const FIELDS = ['titleEn', 'titleBn', 'excerptEn', 'excerptBn', 'bodyEn', 'bodyBn'] as const;

export function AlumniStoriesPage() {
  const { t } = useTranslation('admin');
  const list = useAdminList<Story>('/admin/alumni/stories', { initialFilters: { status: 'SUBMITTED' } });
  const [open, setOpen] = useState<Story | null>(null);

  return (
    <div>
      <AdminHeader title={t('alumniAdmin.stories.title')} description={t('alumniAdmin.stories.description')} />
      <Toolbar>
        <SearchBox onSearch={list.setSearch} />
        <FilterSelect
          label={t('common.status')}
          value={list.params.filters.status ?? ''}
          onChange={(v) => list.setFilter('status', v)}
          options={['SUBMITTED', 'PUBLISHED', 'REJECTED', 'ARCHIVED'].map((s) => ({ value: s, label: t(`status.${s}`) }))}
        />
      </Toolbar>
      <DataTable
        rows={list.rows}
        isLoading={list.isLoading}
        error={list.error}
        onRetry={() => void list.refetch()}
        meta={list.meta}
        onPage={list.setPage}
        onRowClick={setOpen}
        columns={[
          {
            key: 'title',
            header: t('fields.title'),
            cell: (r) => (
              <button type="button" className="text-left font-semibold text-navy-950 hover:underline" onClick={() => setOpen(r)}>
                {r.titleEn || r.titleBn || t('alumniAdmin.stories.untitled')}
              </button>
            ),
          },
          { key: 'author', header: t('alumniAdmin.stories.author'), cell: (r) => r.author.displayName },
          { key: 'created', header: t('fields.submitted'), cell: (r) => formatDate(r.createdAt) },
          { key: 'status', header: t('common.status'), cell: (r) => <StatusBadge status={r.status} label={t(`status.${r.status}`)} /> },
        ]}
      />
      {open && <StoryModal story={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function StoryModal({ story, onClose }: { story: Story; onClose: () => void }) {
  const { t } = useTranslation('admin');
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const [note, setNote] = useState(story.reviewNote ?? '');
  const [busy, setBusy] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, formState, setError } = useForm<Record<(typeof FIELDS)[number], string>>({
    defaultValues: Object.fromEntries(FIELDS.map((f) => [f, story[f] ?? ''])) as Record<(typeof FIELDS)[number], string>,
  });

  const save = (values: Record<(typeof FIELDS)[number], string>) =>
    api.patch(`/admin/alumni/stories/${story.id}`, Object.fromEntries(FIELDS.map((f) => [f, values[f].trim() || null])) as StoryForm);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin'] });
    await queryClient.invalidateQueries({ queryKey: ['alumni'] });
  };

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await save(values);
      await refresh();
      notify(t('common.saved'));
    } catch (error) {
      if (!applyServerErrors(error, setError)) setFormError(errorMessage(error));
    }
  });

  const act = (action: keyof typeof TRANSITIONS) =>
    handleSubmit(async (values) => {
      setBusy(action);
      try {
        if (formState.isDirty) await save(values);
        await api.post(`/admin/alumni/stories/${story.id}/${action}`, { note: note.trim() || null });
        await refresh();
        notify(t(`alumniAdmin.stories.done.${action}`));
        onClose();
      } catch (error) {
        notify(errorMessage(error), 'error');
      } finally {
        setBusy(null);
      }
    })();

  return (
    <Modal
      open
      onClose={onClose}
      size="xl"
      title={story.titleEn || story.titleBn || t('alumniAdmin.stories.untitled')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.close')}
          </Button>
          <Button type="submit" form="story-form" variant="secondary" loading={formState.isSubmitting && !busy}>
            {t('alumniAdmin.stories.saveEdits')}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <StatusBadge status={story.status} label={t(`status.${story.status}`)} />
          <span className="text-ink-500">
            {t('alumniAdmin.stories.by', { name: story.author.displayName })} · {formatDate(story.createdAt)}
          </span>
          {story.status === 'PUBLISHED' && (
            <a href={`/alumni/story/${story.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-royal-700 hover:underline">
              {t('alumniAdmin.stories.viewPublic')}
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          )}
        </div>
        <Alert>{t('alumniAdmin.stories.reviewHelp')}</Alert>
        <form id="story-form" onSubmit={submit} noValidate className="grid gap-4 lg:grid-cols-2">
          <TextField label={t('alumniAdmin.stories.titleEn')} error={formState.errors.titleEn?.message} {...register('titleEn')} />
          <TextField label={t('alumniAdmin.stories.titleBn')} lang="bn" error={formState.errors.titleBn?.message} {...register('titleBn')} />
          <TextArea label={t('alumniAdmin.stories.excerptEn')} rows={2} {...register('excerptEn')} />
          <TextArea label={t('alumniAdmin.stories.excerptBn')} rows={2} lang="bn" {...register('excerptBn')} />
          <TextArea label={t('alumniAdmin.stories.bodyEn')} rows={10} error={formState.errors.bodyEn?.message} {...register('bodyEn')} />
          <TextArea label={t('alumniAdmin.stories.bodyBn')} rows={10} lang="bn" error={formState.errors.bodyBn?.message} {...register('bodyBn')} />
        </form>
        {formError && <Alert kind="error">{formError}</Alert>}
        <section className="space-y-3 border-t border-mist-200 pt-4">
          <TextArea label={t('alumniAdmin.reviewNote')} hint={t('alumniAdmin.reviewNoteHint')} rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            {TRANSITIONS.publish.includes(story.status) && (
              <Button loading={busy === 'publish'} disabled={busy !== null} onClick={() => void act('publish')}>
                {t('alumniAdmin.stories.publish')}
              </Button>
            )}
            {TRANSITIONS.reject.includes(story.status) && (
              <Button variant="danger" loading={busy === 'reject'} disabled={busy !== null} onClick={() => void act('reject')}>
                {t('alumniAdmin.stories.reject')}
              </Button>
            )}
            {TRANSITIONS.archive.includes(story.status) && (
              <Button variant="ghost" loading={busy === 'archive'} disabled={busy !== null} onClick={() => void act('archive')}>
                {t('alumniAdmin.archive')}
              </Button>
            )}
          </div>
        </section>
      </div>
    </Modal>
  );
}
