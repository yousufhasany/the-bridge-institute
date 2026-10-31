import { ArrowLeft, CheckCircle2, Clock, ListChecks } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { coursePhoto } from '../../assets/photos';
import { ButtonLink } from '../../components/common/Button';
import { CircleIcon } from '../../components/common/Icon';
import { Section } from '../../components/common/Section';
import { EmptyState, ErrorState, Spinner } from '../../components/common/States';
import { useCourse } from '../../features/courses/useCourses';
import { usePageMeta } from '../../hooks/usePageMeta';
import { ApiError } from '../../lib/api';

export function CourseDetailPage() {
  const { slug } = useParams();
  const { t } = useTranslation('pages');
  const course = useCourse(slug);
  usePageMeta({ title: course.data?.title, description: course.data?.summary });

  if (course.isLoading) return <Spinner className="min-h-[50vh]" />;
  if (course.isError) {
    const missing = course.error instanceof ApiError && course.error.status === 404;
    return (
      <Section>
        {missing ? (
          <EmptyState title={t('course.notFound')}>
            <Link to="/courses" className="font-semibold text-royal-700 hover:underline">
              {t('course.back')}
            </Link>
          </EmptyState>
        ) : (
          <ErrorState error={course.error} onRetry={() => void course.refetch()} />
        )}
      </Section>
    );
  }
  const c = course.data!;
  const photo = coursePhoto(c.slug);

  return (
    <>
      <header className="relative overflow-hidden bg-navy-950 py-14 text-white sm:py-16">
        {photo && <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/55" />
        <div className="container-page relative">
          <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-50/80 hover:text-white">
            <ArrowLeft className="size-4" aria-hidden />
            {t('course.back')}
          </Link>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            <CircleIcon name={c.icon} size="lg" className="ring-white/15" />
            <div>
              {c.category && <p className="eyebrow text-orange-400">{c.category.name}</p>}
              <h1 className="mt-1 text-3xl text-white sm:text-5xl">{c.title}</h1>
              <p className="mt-4 max-w-2xl text-lg text-sky-50/90">{c.summary}</p>
            </div>
          </div>
        </div>
      </header>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-10">
            <section aria-labelledby="about-course">
              <h2 id="about-course" className="text-2xl">
                {t('course.about')}
              </h2>
              <p className="mt-4 text-lg leading-relaxed whitespace-pre-line">{c.description}</p>
            </section>
            {c.topics.length > 0 && (
              <section aria-labelledby="topics">
                <h2 id="topics" className="flex items-center gap-2 text-2xl">
                  <ListChecks className="size-6 text-royal-600" aria-hidden />
                  {t('course.topics')}
                </h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {c.topics.map((topic) => (
                    <li key={topic} className="rounded-xl bg-sky-50 px-4 py-3 font-medium text-navy-900">
                      {topic}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {c.outcomes.length > 0 && (
              <section aria-labelledby="outcomes">
                <h2 id="outcomes" className="text-2xl">
                  {t('course.outcomes')}
                </h2>
                <ul className="mt-5 space-y-3">
                  {c.outcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-orange-500" aria-hidden />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <p className="flex items-center gap-2 text-sm font-semibold text-navy-950">
                <Clock className="size-4 text-royal-600" aria-hidden />
                {t('courses.duration')}
              </p>
              <p className="mt-1 text-lg font-bold text-navy-950">{c.duration || t('courses.durationTbc')}</p>
              <p className="mt-3 text-xs text-ink-500">{t('course.noFeesNote')}</p>
            </div>
            <div className="rounded-(--radius-card) bg-sky-50 p-6">
              <h2 className="text-lg">{t('course.applyTitle')}</h2>
              <p className="mt-2 text-sm">{t('course.applyBody')}</p>
              <ButtonLink to="/apply" className="mt-5 w-full">
                {t('common:actions.apply')}
              </ButtonLink>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
