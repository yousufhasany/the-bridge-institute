import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { coursePhoto } from '../../assets/photos';
import type { Course } from '../../types/api';
import { CircleIcon } from '../common/Icon';

export function CourseCard({ course }: { course: Course }) {
  const { t } = useTranslation();
  const photo = coursePhoto(course.slug);
  return (
    <article className="card group relative flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {photo ? (
        <div className="relative h-36 overflow-hidden">
          <img src={photo} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/55 to-transparent" />
          <CircleIcon name={course.icon} size="sm" className="absolute bottom-3 left-3 ring-white/40" />
        </div>
      ) : (
        <div className="p-6 pb-0">
          <CircleIcon name={course.icon} />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg">
          <Link to={`/courses/${course.slug}`} className="after:absolute after:inset-0 after:rounded-(--radius-card) focus-visible:outline-none">
            {course.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed">{course.summary}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-royal-700 group-hover:gap-2.5 group-has-[a:focus-visible]:underline">
          {t('actions.viewCourse')}
          <ArrowRight className="size-4 transition-all" aria-hidden />
        </span>
      </div>
    </article>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="card animate-pulse overflow-hidden" aria-hidden>
      <div className="h-36 bg-mist-200" />
      <div className="p-5">
        <div className="h-5 w-2/3 rounded bg-mist-200" />
        <div className="mt-4 h-3 w-full rounded bg-mist-50" />
        <div className="mt-2 h-3 w-5/6 rounded bg-mist-50" />
      </div>
    </div>
  );
}
