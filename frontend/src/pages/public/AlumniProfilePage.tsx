import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Briefcase, ExternalLink, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { Avatar, StoryCard } from '../../components/alumni/AlumniCards';
import { Section } from '../../components/common/Section';
import { EmptyState, ErrorState, Spinner } from '../../components/common/States';
import { usePageMeta } from '../../hooks/usePageMeta';
import { api, ApiError } from '../../lib/api';
import type { PublicAlumniProfile, PublicStory } from '../../types/api';

export function AlumniProfilePage() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation('alumni');
  const lang = i18n.language === 'bn' ? 'bn' : 'en';
  const profile = useQuery({
    queryKey: ['alumni', 'profile', slug, lang],
    queryFn: () => api.get<PublicAlumniProfile & { stories: PublicStory[] }>(`/alumni/directory/${encodeURIComponent(slug!)}`, { locale: lang }),
  });
  const p = profile.data;
  usePageMeta({ title: p?.displayName ?? t('public.metaTitle'), description: p ? [p.professionalTitle, p.organization].filter(Boolean).join(' · ') || t('public.alumnus') : undefined });

  if (profile.isLoading) return <Spinner className="min-h-[50vh]" />;
  if (profile.isError || !p) {
    return (
      <Section>
        {profile.error instanceof ApiError && profile.error.status === 404 ? (
          <EmptyState title={t('public.notFound')}>
            <Link to="/alumni" className="font-semibold text-royal-700 hover:underline">
              {t('public.back')}
            </Link>
          </EmptyState>
        ) : (
          <ErrorState error={profile.error} onRetry={() => void profile.refetch()} />
        )}
      </Section>
    );
  }

  const links = [
    { label: t('public.linkedin'), url: p.linkedinUrl },
    { label: t('public.portfolio'), url: p.portfolioUrl },
  ].filter((l): l is { label: string; url: string } => Boolean(l.url && /^https?:\/\//i.test(l.url)));

  return (
    <>
      <header className="bg-navy-950 py-12 text-white">
        <div className="container-page">
          <Link to="/alumni" className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-50/80 hover:text-white">
            <ArrowLeft className="size-4" aria-hidden />
            {t('public.back')}
          </Link>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            <Avatar name={p.displayName} photoUrl={p.photoUrl} alt={p.photoAlt} size="lg" />
            <div>
              <h1 className="text-3xl text-white sm:text-4xl">{p.displayName}</h1>
              {(p.professionalTitle || p.organization) && (
                <p className="mt-2 flex items-center gap-2 text-lg text-sky-50/90">
                  <Briefcase className="size-5 text-orange-400" aria-hidden />
                  {[p.professionalTitle, p.organization].filter(Boolean).join(' · ')}
                </p>
              )}
              <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-sky-50/80">
                <GraduationCap className="size-4 text-orange-400" aria-hidden />
                {[p.course?.title ?? p.programName, p.cohort?.name, p.graduationYear && t('public.graduated', { year: p.graduationYear })].filter(Boolean).join(' · ') || t('public.alumnus')}
              </p>
            </div>
          </div>
        </div>
      </header>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
          <div>
            {p.bio && <p className="text-lg leading-relaxed whitespace-pre-line">{p.bio}</p>}
            {p.stories.length > 0 && (
              <section className="mt-10" aria-labelledby="profile-stories">
                <h2 id="profile-stories" className="text-2xl">
                  {t('public.storiesBy')}
                </h2>
                <ul className="mt-5 grid gap-5 sm:grid-cols-2">
                  {p.stories.map((s) => (
                    <li key={s.slug}>
                      <StoryCard story={s} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
          <aside className="space-y-5">
            {p.professionalField && <p className="card p-5 text-sm font-semibold text-navy-950">{p.professionalField}</p>}
            {[
              { title: t('public.skills'), items: p.skills },
              { title: t('public.interests'), items: p.interests },
            ]
              .filter((g) => g.items.length > 0)
              .map((g) => (
                <div key={g.title} className="card p-5">
                  <h2 className="text-sm font-bold">{g.title}</h2>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {g.items.map((item) => (
                      <li key={item} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-royal-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            {links.length > 0 && (
              <ul className="card space-y-2 p-5">
                {links.map((l) => (
                  <li key={l.url}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal-700 hover:underline">
                      {l.label}
                      <ExternalLink className="size-3.5" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </Section>
    </>
  );
}
