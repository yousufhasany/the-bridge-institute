import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { Section } from '../../components/common/Section';
import { SimpleText } from '../../components/common/SimpleText';
import { EmptyState, ErrorState, Spinner } from '../../components/common/States';
import { usePageMeta } from '../../hooks/usePageMeta';
import { api, ApiError } from '../../lib/api';
import type { PublicStory } from '../../types/api';

export function AlumniStoryPage() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation('alumni');
  const lang = i18n.language === 'bn' ? 'bn' : 'en';
  const story = useQuery({
    queryKey: ['alumni', 'story', slug, lang],
    queryFn: () => api.get<PublicStory>(`/alumni/stories/${encodeURIComponent(slug!)}`, { locale: lang }),
  });
  const s = story.data;
  usePageMeta({ title: s?.title ?? t('public.storiesTitle'), description: s?.excerpt ?? undefined });

  if (story.isLoading) return <Spinner className="min-h-[50vh]" />;
  if (story.isError || !s) {
    return (
      <Section>
        {story.error instanceof ApiError && story.error.status === 404 ? (
          <EmptyState title={t('public.storyNotFound')}>
            <Link to="/alumni" className="font-semibold text-royal-700 hover:underline">
              {t('public.back')}
            </Link>
          </EmptyState>
        ) : (
          <ErrorState error={story.error} onRetry={() => void story.refetch()} />
        )}
      </Section>
    );
  }

  return (
    <article>
      <header className="bg-navy-950 py-12 text-white">
        <div className="container-page max-w-3xl">
          <Link to="/alumni" className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-50/80 hover:text-white">
            <ArrowLeft className="size-4" aria-hidden />
            {t('public.back')}
          </Link>
          <h1 className="mt-6 text-3xl text-white sm:text-4xl">{s.title}</h1>
          <p className="mt-3 text-sm text-sky-50/80">
            {s.author ? (
              <Link to={`/alumni/${s.author.slug}`} className="font-semibold text-white hover:underline">
                {s.author.displayName}
              </Link>
            ) : (
              t('public.alumnus')
            )}
            {s.publishedAt && ` · ${new Date(s.publishedAt).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', { dateStyle: 'long' })}`}
          </p>
        </div>
      </header>
      <Section>
        <div className="mx-auto max-w-3xl">
          {s.imageUrl && <img src={s.imageUrl} alt={s.imageAlt ?? ''} className="mb-8 w-full rounded-2xl object-cover" />}
          {s.excerpt && <p className="mb-6 text-xl font-semibold text-navy-900">{s.excerpt}</p>}
          {s.body && <SimpleText text={s.body} className="prose-content text-lg" />}
        </div>
      </Section>
    </article>
  );
}
