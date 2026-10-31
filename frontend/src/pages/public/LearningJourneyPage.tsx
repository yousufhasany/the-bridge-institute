import { ArrowRight, CalendarClock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Alert } from '../../components/common/States';
import { photos } from '../../assets/photos';
import { PageHeader, Section, SectionHeading } from '../../components/common/Section';
import { Roadmap, type RoadmapYear } from '../../components/roadmap/Roadmap';
import { usePublicSettings, useSection } from '../../features/cms/useSiteContent';
import { usePageMeta } from '../../hooks/usePageMeta';

interface SixMonthProgram {
  status?: string;
  enabled?: boolean;
  relationship?: string;
}

export function LearningJourneyPage() {
  const { t } = useTranslation('pages');
  const journey = useSection<{ title: string; intro: string; stages: { title: string; body: string }[]; note: string }>('journey');
  const roadmap = useSection<{ title: string; subtitle: string; intro: string; years: RoadmapYear[] }>('roadmap');
  const settings = usePublicSettings();
  // The API only exposes this setting once an administrator has confirmed and enabled it.
  const program = settings.data?.['program.sixMonthProgram'] as SixMonthProgram | undefined;
  usePageMeta({ title: t('journey.metaTitle'), description: t('journey.metaDescription') });

  return (
    <>
      <PageHeader title={journey.title} subtitle={journey.intro} image={photos.journey}>
        <Link to="#roadmap" className="mt-8 inline-flex items-center gap-1.5 font-semibold text-orange-400 hover:underline">
          {t('journey.roadmapLink')}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </PageHeader>

      <Section tone="white">
        <ol className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {journey.stages.map((stage, i) => (
            <li key={stage.title} className="card relative p-6">
              <span className="text-4xl font-extrabold text-royal-100" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="mt-2 text-lg">{stage.title}</h2>
              <p className="mt-2 text-sm leading-relaxed">{stage.body}</p>
            </li>
          ))}
        </ol>
        <Alert className="mt-8">{journey.note}</Alert>
      </Section>

      {program?.status === 'confirmed' && program.enabled && program.relationship && (
        <Section tone="sky">
          <div className="card flex flex-col gap-4 p-8 sm:flex-row">
            <CalendarClock className="size-10 shrink-0 text-royal-600" aria-hidden />
            <div>
              <h2 className="text-2xl">{t('journey.programmeTitle')}</h2>
              <p className="mt-3 leading-relaxed whitespace-pre-line">{program.relationship}</p>
            </div>
          </div>
        </Section>
      )}

      <Section tone="mist" id="roadmap" labelledBy="journey-roadmap">
        <SectionHeading id="journey-roadmap" title={roadmap.title} eyebrow={roadmap.subtitle} subtitle={roadmap.intro} align="center" />
        <Roadmap years={roadmap.years} />
      </Section>
    </>
  );
}
