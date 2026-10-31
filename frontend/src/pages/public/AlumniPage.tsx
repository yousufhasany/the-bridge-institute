import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Search, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { AlumniCard, StoryCard } from '../../components/alumni/AlumniCards';
import { ButtonLink } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { photos } from '../../assets/photos';
import { PageHeader, Section, SectionHeading } from '../../components/common/Section';
import { EmptyState, ErrorState, Spinner } from '../../components/common/States';
import { inputClasses } from '../../components/forms/Field';
import { useSection } from '../../features/cms/useSiteContent';
import { usePageMeta } from '../../hooks/usePageMeta';
import { request } from '../../lib/api';
import type { PublicAlumniProfile, PublicStory } from '../../types/api';

interface Filters {
  years: number[];
  fields: string[];
  cohorts: { slug: string; name: string }[];
  courses: { slug: string; title: string }[];
}

export function AlumniPage() {
  const { t, i18n } = useTranslation('alumni');
  const intro = useSection<{ title: string; description: string }>('alumniIntro');
  const lang = i18n.language === 'bn' ? 'bn' : 'en';
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') ?? '');
  usePageMeta({ title: t('public.metaTitle'), description: t('public.metaDescription') });

  const query = {
    q: params.get('q') ?? '',
    cohort: params.get('cohort') ?? '',
    course: params.get('course') ?? '',
    year: params.get('year') ?? '',
    field: params.get('field') ?? '',
    page: Number(params.get('page') ?? 1) || 1,
  };
  const filtered = Boolean(query.q || query.cohort || query.course || query.year || query.field);

  useEffect(() => setSearch(params.get('q') ?? ''), [params]);

  const filters = useQuery({ queryKey: ['alumni', 'filters', lang], queryFn: async () => (await request<Filters>('/alumni/directory/filters', { query: { locale: lang } })).data });
  const directory = useQuery({
    queryKey: ['alumni', 'directory', lang, query],
    queryFn: () => request<PublicAlumniProfile[]>('/alumni/directory', { query: { ...query, locale: lang, pageSize: 12 } }),
    placeholderData: keepPreviousData,
  });
  const stories = useQuery({ queryKey: ['alumni', 'stories', lang], queryFn: () => request<PublicStory[]>('/alumni/stories', { query: { locale: lang } }) });

  const update = (changes: Record<string, string | number>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (value === '' || value === 1) next.delete(key);
      else next.set(key, String(value));
    }
    if (!('page' in changes)) next.delete('page');
    setParams(next, { replace: true });
  };

  const f = filters.data;
  const selectClass = `${inputClasses} sm:w-auto`;

  return (
    <>
      <PageHeader title={intro.title} subtitle={intro.description} image={photos.alumni}>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/alumni/join">{t('public.join')}</ButtonLink>
          <ButtonLink to="/alumni/login" variant="light">
            {t('public.signIn')}
          </ButtonLink>
        </div>
      </PageHeader>

      <Section tone="mist" labelledBy="directory-title">
        <SectionHeading id="directory-title" title={t('public.directory')} />
        <p className="-mt-6 mb-8 flex items-center gap-2 text-sm text-ink-500">
          <ShieldCheck className="size-4 text-royal-600" aria-hidden />
          {t('public.privacyNote')}
        </p>

        <form
          role="search"
          className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            update({ q: search.trim() });
          }}
        >
          <div className="relative flex-1">
            <label htmlFor="alumni-search" className="sr-only">
              {t('common:actions.search')}
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-500" aria-hidden />
            <input id="alumni-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('public.searchPlaceholder')} className={`${inputClasses} pl-10`} />
          </div>
          <div className="flex flex-wrap gap-3">
            {f && f.cohorts.length > 0 && (
              <FilterSelect label={t('public.filters.cohort')} value={query.cohort} onChange={(v) => update({ cohort: v })} options={f.cohorts.map((c) => ({ value: c.slug, label: c.name }))} className={selectClass} />
            )}
            {f && f.courses.length > 0 && (
              <FilterSelect label={t('public.filters.course')} value={query.course} onChange={(v) => update({ course: v })} options={f.courses.map((c) => ({ value: c.slug, label: c.title }))} className={selectClass} />
            )}
            {f && f.years.length > 0 && (
              <FilterSelect label={t('public.filters.year')} value={query.year} onChange={(v) => update({ year: v })} options={f.years.map((y) => ({ value: String(y), label: String(y) }))} className={selectClass} />
            )}
            {f && f.fields.length > 0 && (
              <FilterSelect label={t('public.filters.field')} value={query.field} onChange={(v) => update({ field: v })} options={f.fields.map((x) => ({ value: x, label: x }))} className={selectClass} />
            )}
          </div>
        </form>

        {directory.isLoading ? (
          <Spinner />
        ) : directory.isError ? (
          <ErrorState error={directory.error} onRetry={() => void directory.refetch()} />
        ) : directory.data?.data.length === 0 ? (
          <EmptyState title={filtered ? t('public.emptyFiltered') : t('public.empty')} />
        ) : (
          <>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy={directory.isFetching}>
              {directory.data?.data.map((p) => (
                <li key={p.slug}>
                  <AlumniCard profile={p} />
                </li>
              ))}
            </ul>
            <Pagination meta={directory.data?.meta} onPage={(page) => update({ page })} />
          </>
        )}
      </Section>

      <Section tone="white" labelledBy="stories-title">
        <SectionHeading id="stories-title" title={t('public.storiesTitle')} />
        {stories.isLoading ? (
          <Spinner />
        ) : stories.isError ? (
          <ErrorState error={stories.error} onRetry={() => void stories.refetch()} />
        ) : stories.data?.data.length === 0 ? (
          <EmptyState title={t('public.storiesEmpty')} />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stories.data?.data.map((s) => (
              <li key={s.slug}>
                <StoryCard story={s} />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}

function FilterSelect({ label, value, onChange, options, className }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; className?: string }) {
  const { t } = useTranslation('alumni');
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-navy-950">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className={className}>
        <option value="">{t('public.filters.all')}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
