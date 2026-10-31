import { useTranslation } from 'react-i18next';
import { photos } from '../../assets/photos';
import { PageHeader, Section } from '../../components/common/Section';
import { EmptyState, ErrorState } from '../../components/common/States';
import { CourseCard, CourseCardSkeleton } from '../../components/courses/CourseCard';
import { useCourses } from '../../features/courses/useCourses';
import { usePageMeta } from '../../hooks/usePageMeta';

export function CoursesPage() {
  const { t } = useTranslation('pages');
  const courses = useCourses();
  usePageMeta({ title: t('courses.metaTitle'), description: t('courses.metaDescription') });

  return (
    <>
      <PageHeader title={t('courses.title')} subtitle={t('courses.subtitle')} image={photos.courses} />
      <Section tone="mist">
        {courses.isError ? (
          <ErrorState error={courses.error} onRetry={() => void courses.refetch()} />
        ) : courses.data && courses.data.length === 0 ? (
          <EmptyState title={t('courses.empty')} />
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.isLoading
              ? Array.from({ length: 5 }, (_, i) => (
                  <li key={i}>
                    <CourseCardSkeleton />
                  </li>
                ))
              : courses.data?.map((course) => (
                  <li key={course.id}>
                    <CourseCard course={course} />
                  </li>
                ))}
          </ul>
        )}
      </Section>
    </>
  );
}
