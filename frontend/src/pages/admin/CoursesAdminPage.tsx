import { useQueryClient } from '@tanstack/react-query';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm, type Control, type UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { CircleIcon, ICONS } from '../../components/common/Icon';
import { ConfirmDialog, Modal } from '../../components/common/Modal';
import { Alert, useErrorMessage } from '../../components/common/States';
import { useToast } from '../../components/common/Toast';
import { AdminHeader, DataTable, FilterSelect, SearchBox, Toolbar } from '../../components/dashboard/AdminUi';
import { inputClasses, SelectField, TextArea, TextField } from '../../components/forms/Field';
import { applyServerErrors } from '../../components/forms/formUtils';
import { useCategoryOptions } from '../../features/admin/lookups';
import { useAdminList } from '../../features/admin/useAdminList';
import { api } from '../../lib/api';
import { formatDate } from '../../lib/format';
import type { AdminCourse, AdminCourseTranslation } from '../../types/api';

type Item = { en: string; bn: string };
interface FormValues {
  slug: string;
  icon: string;
  categoryId: string;
  sortOrder: string;
  en: AdminCourseTranslation & { duration: string };
  bn: AdminCourseTranslation & { duration: string };
  topics: Item[];
  outcomes: Item[];
}

const emptyTranslation = { title: '', summary: '', description: '', duration: '' };

function toForm(course: AdminCourse | null): FormValues {
  const tr = (x: AdminCourseTranslation | null) => (x ? { ...x, duration: x.duration ?? '' } : { ...emptyTranslation });
  return {
    slug: course?.slug ?? '',
    icon: course?.icon ?? 'book-open',
    categoryId: course?.categoryId ?? '',
    sortOrder: String(course?.sortOrder ?? 0),
    en: tr(course?.translations.en ?? null),
    bn: tr(course?.translations.bn ?? null),
    topics: (course?.topics ?? []).map((i) => ({ en: i.en, bn: i.bn ?? '' })),
    outcomes: (course?.outcomes ?? []).map((i) => ({ en: i.en, bn: i.bn ?? '' })),
  };
}

function toPayload(v: FormValues) {
  const tr = (x: FormValues['en']) => ({ title: x.title.trim(), summary: x.summary.trim(), description: x.description.trim(), duration: x.duration.trim() || null });
  const hasBn = Boolean(v.bn.title.trim() || v.bn.summary.trim() || v.bn.description.trim());
  const items = (list: Item[]) => list.filter((i) => i.en.trim()).map((i) => ({ en: i.en.trim(), bn: i.bn.trim() || null }));
  return {
    ...(v.slug.trim() ? { slug: v.slug.trim() } : {}),
    icon: v.icon,
    categoryId: v.categoryId || null,
    sortOrder: Number(v.sortOrder) || 0,
    translations: { en: tr(v.en), ...(hasBn ? { bn: tr(v.bn) } : {}) },
    topics: items(v.topics),
    outcomes: items(v.outcomes),
  };
}

export function CoursesAdminPage() {
  const { t } = useTranslation('admin');
  const list = useAdminList<AdminCourse>('/courses/admin', { pageSize: 50 });
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const [editing, setEditing] = useState<AdminCourse | 'new' | null>(null);
  const [deleting, setDeleting] = useState<AdminCourse | null>(null);
  const statuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'].map((s) => ({ value: s, label: t(`status.${s}`) }));

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin'] }).then(() => queryClient.invalidateQueries({ queryKey: ['courses'] }));

  const setStatus = async (course: AdminCourse, status: string) => {
    try {
      await api.post(`/courses/admin/${course.id}/status`, { status });
      await refresh();
      notify(t('common.saved'));
    } catch (error) {
      notify(errorMessage(error), 'error');
    }
  };

  return (
    <div>
      <AdminHeader
        title={t('courses.title')}
        actions={
          <Button onClick={() => setEditing('new')} icon={<Plus className="size-4" aria-hidden />}>
            {t('courses.new')}
          </Button>
        }
      />
      <Toolbar>
        <SearchBox onSearch={list.setSearch} />
        <FilterSelect label={t('common.status')} value={list.params.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={statuses} />
      </Toolbar>
      <DataTable
        rows={list.rows}
        isLoading={list.isLoading}
        error={list.error}
        onRetry={() => void list.refetch()}
        meta={list.meta}
        onPage={list.setPage}
        columns={[
          { key: 'order', header: '#', cell: (r) => r.sortOrder, className: 'w-0' },
          {
            key: 'title',
            header: t('fields.title'),
            cell: (r) => (
              <div className="flex items-center gap-3">
                <CircleIcon name={r.icon} size="sm" />
                <div>
                  <p className="font-semibold text-navy-950">{r.translations.en?.title ?? r.slug}</p>
                  <p className="text-xs text-ink-500" lang="bn">
                    {r.translations.bn?.title ?? `${t('common.bangla')}: —`}
                  </p>
                </div>
              </div>
            ),
          },
          { key: 'slug', header: t('fields.slug'), cell: (r) => <code className="text-xs">{r.slug}</code> },
          { key: 'updated', header: t('common.updated'), cell: (r) => formatDate(r.updatedAt) },
          { key: 'status', header: t('common.status'), cell: (r) => <StatusBadge status={r.status} label={t(`status.${r.status}`)} /> },
          {
            key: 'actions',
            header: <span className="sr-only">{t('common.actions')}</span>,
            className: 'text-right whitespace-nowrap',
            cell: (r) => (
              <div className="flex justify-end gap-1">
                <Button size="sm" variant="ghost" onClick={() => setEditing(r)}>
                  {t('common.edit')}
                </Button>
                {r.status !== 'PUBLISHED' && (
                  <Button size="sm" variant="outline" onClick={() => void setStatus(r, 'PUBLISHED')}>
                    {t('courses.publish')}
                  </Button>
                )}
                {r.status === 'PUBLISHED' && (
                  <Button size="sm" variant="ghost" onClick={() => void setStatus(r, 'DRAFT')}>
                    {t('courses.draft')}
                  </Button>
                )}
                {r.status !== 'ARCHIVED' && (
                  <Button size="sm" variant="ghost" onClick={() => void setStatus(r, 'ARCHIVED')}>
                    {t('courses.archive')}
                  </Button>
                )}
                {r.status === 'DRAFT' && (
                  <Button size="sm" variant="ghost" className="text-red-700" aria-label={t('common.delete')} onClick={() => setDeleting(r)}>
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                )}
              </div>
            ),
          },
        ]}
      />
      {editing && (
        <CourseEditor
          course={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            await refresh();
            notify(t('common.saved'));
            setEditing(null);
          }}
        />
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
            await api.delete(`/courses/admin/${deleting.id}`);
            await refresh();
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

function CourseEditor({ course, onClose, onSaved }: { course: AdminCourse | null; onClose: () => void; onSaved: () => Promise<void> }) {
  const { t } = useTranslation('admin');
  const categories = useCategoryOptions();
  const errorMessage = useErrorMessage();
  const [formError, setFormError] = useState<string | null>(null);
  const { register, control, handleSubmit, formState, setError, watch } = useForm<FormValues>({ defaultValues: toForm(course) });
  const req = { required: t('common:validation.required') };
  const icon = watch('icon');

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const payload = toPayload(values);
      if (course) await api.put(`/courses/admin/${course.id}`, payload);
      else await api.post('/courses/admin', payload);
      await onSaved();
    } catch (error) {
      if (!applyServerErrors(error, (name, e) => setError(String(name).replace('translations.', '') as never, e))) setFormError(errorMessage(error));
    }
  });

  const e = formState.errors;
  return (
    <Modal
      open
      onClose={onClose}
      size="xl"
      title={course ? t('courses.editTitle') : t('courses.new')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="course-form" loading={formState.isSubmitting}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <form id="course-form" onSubmit={submit} noValidate className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-4">
          <TextField label={t('fields.slug')} hint="lowercase-with-hyphens" error={e.slug?.message} wrapperClassName="sm:col-span-2" {...register('slug')} />
          <TextField label={t('fields.sortOrder')} type="number" min={0} {...register('sortOrder')} />
          <div className="flex items-end gap-2">
            <SelectField label={t('fields.icon')} required options={Object.keys(ICONS).map((k) => ({ value: k, label: k }))} wrapperClassName="flex-1" {...register('icon')} />
            <CircleIcon name={icon} size="sm" />
          </div>
          <SelectField label={t('fields.category')} placeholder="—" options={categories.data ?? []} wrapperClassName="sm:col-span-2" {...register('categoryId')} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <fieldset className="space-y-4 rounded-xl p-4 ring-1 ring-mist-200">
            <legend className="px-1 text-sm font-bold text-navy-950">{t('common.english')}</legend>
            <TextField label={t('fields.title')} required error={e.en?.title?.message} {...register('en.title', req)} />
            <TextArea label={t('courses.summary')} required rows={2} error={e.en?.summary?.message} {...register('en.summary', req)} />
            <TextArea label={t('courses.description')} required rows={5} error={e.en?.description?.message} {...register('en.description', req)} />
            <TextField label={t('courses.duration')} {...register('en.duration')} />
          </fieldset>
          <fieldset className="space-y-4 rounded-xl p-4 ring-1 ring-mist-200" lang="bn">
            <legend className="px-1 text-sm font-bold text-navy-950">{t('courses.banglaOptional')}</legend>
            <TextField label={t('fields.title')} error={e.bn?.title?.message} {...register('bn.title')} />
            <TextArea label={t('courses.summary')} rows={2} error={e.bn?.summary?.message} {...register('bn.summary')} />
            <TextArea label={t('courses.description')} rows={5} error={e.bn?.description?.message} {...register('bn.description')} />
            <TextField label={t('courses.duration')} {...register('bn.duration')} />
          </fieldset>
        </div>

        <ItemList name="topics" title={t('courses.topics')} control={control} register={register} />
        <ItemList name="outcomes" title={t('courses.outcomes')} control={control} register={register} />
        {formError && <Alert kind="error">{formError}</Alert>}
      </form>
    </Modal>
  );
}

function ItemList({ name, title, control, register }: { name: 'topics' | 'outcomes'; title: string; control: Control<FormValues>; register: UseFormRegister<FormValues> }) {
  const { t } = useTranslation('admin');
  const { fields, append, remove, move } = useFieldArray({ control, name });
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-bold text-navy-950">{title}</legend>
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col gap-2 rounded-xl bg-mist-50 p-3 sm:flex-row sm:items-center">
          <span className="w-6 text-sm font-bold text-ink-500">{index + 1}</span>
          <input aria-label={`${title} ${index + 1} (${t('courses.itemEn')})`} placeholder={t('courses.itemEn')} className={`${inputClasses} py-2`} {...register(`${name}.${index}.en`)} />
          <input aria-label={`${title} ${index + 1} (${t('courses.itemBn')})`} placeholder={t('courses.itemBn')} lang="bn" className={`${inputClasses} py-2`} {...register(`${name}.${index}.bn`)} />
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" aria-label={t('courses.moveUp')} disabled={index === 0} onClick={() => move(index, index - 1)}>
              <ArrowUp className="size-4" aria-hidden />
            </Button>
            <Button size="sm" variant="ghost" aria-label={t('courses.moveDown')} disabled={index === fields.length - 1} onClick={() => move(index, index + 1)}>
              <ArrowDown className="size-4" aria-hidden />
            </Button>
            <Button size="sm" variant="ghost" className="text-red-700" aria-label={t('courses.remove')} onClick={() => remove(index)}>
              <Trash2 className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      ))}
      <Button size="sm" variant="outline" icon={<Plus className="size-4" aria-hidden />} onClick={() => append({ en: '', bn: '' })}>
        {t('courses.addItem')}
      </Button>
    </fieldset>
  );
}
