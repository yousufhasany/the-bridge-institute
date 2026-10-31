import { ArrowRight, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import type { PublicAlumniProfile, PublicStory } from '../../types/api';

export function Avatar({ name, photoUrl, alt, size = 'md' }: { name: string; photoUrl?: string | null; alt?: string; size?: 'md' | 'lg' }) {
  const dims = size === 'lg' ? 'size-28 text-3xl' : 'size-16 text-xl';
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
  if (photoUrl) return <img src={photoUrl} alt={alt ?? name} className={`${dims} shrink-0 rounded-full object-cover ring-4 ring-sky-50`} loading="lazy" />;
  return (
    <span aria-hidden className={`${dims} grid shrink-0 place-items-center rounded-full bg-royal-600 font-bold text-white ring-4 ring-sky-50`}>
      {initials}
    </span>
  );
}

export function AlumniCard({ profile }: { profile: PublicAlumniProfile }) {
  const { t } = useTranslation('alumni');
  return (
    <article className="card relative flex h-full flex-col p-6">
      <div className="flex items-center gap-4">
        <Avatar name={profile.displayName} photoUrl={profile.photoUrl} alt={profile.photoAlt} />
        <div className="min-w-0">
          <h3 className="text-lg">
            <Link to={`/alumni/${profile.slug}`} className="after:absolute after:inset-0 after:rounded-(--radius-card)">
              {profile.displayName}
            </Link>
          </h3>
          {profile.graduationYear && <p className="text-sm text-ink-500">{t('public.graduated', { year: profile.graduationYear })}</p>}
        </div>
      </div>
      {(profile.professionalTitle || profile.organization) && (
        <p className="mt-4 flex items-start gap-2 text-sm font-semibold text-navy-900">
          <Briefcase className="mt-0.5 size-4 shrink-0 text-royal-600" aria-hidden />
          {[profile.professionalTitle, profile.organization].filter(Boolean).join(' · ')}
        </p>
      )}
      {(profile.course?.title || profile.cohort) && <p className="mt-2 text-sm">{[profile.course?.title, profile.cohort?.name].filter(Boolean).join(' · ')}</p>}
      {profile.skills.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={t('public.skills')}>
          {profile.skills.slice(0, 5).map((s) => (
            <li key={s} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-royal-700">
              {s}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function StoryCard({ story }: { story: PublicStory }) {
  const { t, i18n } = useTranslation(['alumni', 'common']);
  return (
    <article className="card relative flex h-full flex-col overflow-hidden">
      {story.imageUrl && <img src={story.imageUrl} alt={story.imageAlt ?? ''} className="aspect-video w-full object-cover" loading="lazy" />}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg">
          <Link to={`/alumni/story/${story.slug}`} className="after:absolute after:inset-0">
            {story.title}
          </Link>
        </h3>
        {story.excerpt && <p className="mt-2 flex-1 text-sm leading-relaxed">{story.excerpt}</p>}
        <p className="mt-4 text-xs text-ink-500">
          {[story.author?.displayName, story.publishedAt && new Date(story.publishedAt).toLocaleDateString(i18n.language === 'bn' ? 'bn-BD' : 'en-GB', { dateStyle: 'medium' })]
            .filter(Boolean)
            .join(' · ')}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-royal-700">
          {t('common:actions.readMore')}
          <ArrowRight className="size-4" aria-hidden />
        </span>
      </div>
    </article>
  );
}
