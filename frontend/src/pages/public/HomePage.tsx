import { useEffect, useState } from 'react';
import { ArrowRight, Check, GraduationCap, Mail, Quote, ScrollText, Send, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { photos } from '../../assets/photos';
import { ButtonLink } from '../../components/common/Button';
import { Reveal } from '../../components/common/Reveal';
import { CircleIcon } from '../../components/common/Icon';
import { QrLinks } from '../../components/common/QrLinks';
import { Section, SectionHeading } from '../../components/common/Section';
import { ErrorState } from '../../components/common/States';
import { CourseCard, CourseCardSkeleton } from '../../components/courses/CourseCard';
import { Pathway, type PathwayStep } from '../../components/roadmap/Pathway';
import { Roadmap, type RoadmapYear } from '../../components/roadmap/Roadmap';
import { BROCHURE_EMAIL, useSection, useSetting } from '../../features/cms/useSiteContent';
import { useCourses } from '../../features/courses/useCourses';
import { PartnerList } from '../../features/companies/PartnerList';
import { usePageMeta } from '../../hooks/usePageMeta';

type Item = { title: string; body: string };

export function HomePage() {
  usePageMeta({});
  return (
    <>
      <Hero />
      <Intro />
      <Goal />
      <Why />
      <Courses />
      <RoadmapSection />
      <PathwaySection />
      <Eligibility />
      <Collaborate />
      <Contact />
    </>
  );
}

const heroLine = (delay: number) => ({ className: 'hero-in', style: { animationDelay: `${delay}s` } });

function HeroMedia() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener?.('change', apply);
    return () => media.removeEventListener?.('change', apply);
  }, []);

  if (reduced) return <img src="/media/hero-poster.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />;
  return (
    <video className="pointer-events-none absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline poster="/media/hero-poster.jpg" aria-hidden>
      <source src="/media/hero.mp4?v=3" type="video/mp4" />
    </video>
  );
}

function Hero() {
  const hero = useSection<Record<string, string>>('hero');
  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden bg-navy-950 text-white">
      <HeroMedia />
      <div aria-hidden className="absolute inset-0 bg-navy-950/55" />
      <div className="container-page relative px-4 py-20 text-center">
        <p {...heroLine(0.05)} className="hero-in text-xl font-bold tracking-[0.12em] text-orange-400 uppercase sm:text-2xl lg:text-4xl">
          {hero.eyebrow}
        </p>
        <h1 id="hero-title" {...heroLine(0.2)} className="hero-in mx-auto mt-5 max-w-4xl text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
          {hero.titleBefore ? <>{hero.titleBefore} </> : null}
          <span className="text-orange-500">{hero.titleHighlight}</span> {hero.titleAfter}
        </h1>
        <p {...heroLine(0.45)} className="hero-in mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/95 sm:text-xl">
          {hero.description}
        </p>
        <p {...heroLine(0.6)} className="hero-in mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/25">
          <span className="size-2 rounded-full bg-orange-500" aria-hidden />
          {hero.tagline}
        </p>
        <div {...heroLine(0.8)} className="hero-in mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/courses" size="lg" icon={<ArrowRight className="size-5" aria-hidden />} className="flex-row-reverse">
            {hero.ctaCourses}
          </ButtonLink>
          <ButtonLink to="/industry-partners" variant="outline" size="lg">
            {hero.ctaIndustryPartners}
          </ButtonLink>
          <ButtonLink to="/companies" variant="light" size="lg">
            {hero.ctaPartner}
          </ButtonLink>
          <ButtonLink to="/apply" variant="light" size="lg">
            {hero.ctaAdmission}
          </ButtonLink>
        </div>
        <p {...heroLine(0.95)} className="hero-in mt-8 text-sm text-white/80">
          {hero.parent}
        </p>
      </div>
    </section>
  );
}

function Intro() {
  const { t } = useTranslation();
  const intro = useSection<{ title: string; lead: string; body: string; skillsTitle: string; skills: string[]; goalStatement: string }>('intro');
  return (
    <Section tone="white" labelledBy="intro-title" reveal>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <figure className="relative order-last lg:order-first">
          <div className="relative overflow-hidden rounded-3xl shadow-(--shadow-card) ring-1 ring-mist-200">
            <img src={photos.learning} alt={t('photos.learning')} className="aspect-[4/3] w-full object-cover object-top" />
            <span aria-hidden className="absolute bottom-0 left-0 h-1.5 w-20 bg-orange-500" />
          </div>
        </figure>
        <div>
          <SectionHeading id="intro-title" title={intro.title} />
          <p className="text-lg leading-relaxed text-navy-900">{intro.lead}</p>
          <p className="mt-4 leading-relaxed">{intro.body}</p>
          <blockquote className="mt-8 flex gap-4 rounded-2xl bg-sky-50 p-6">
            <Quote className="size-8 shrink-0 text-orange-500" aria-hidden />
            <p className="font-semibold text-navy-950">{intro.goalStatement}</p>
          </blockquote>
          <div className="card mt-8 p-8">
            <h3 className="text-lg">{intro.skillsTitle}</h3>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {intro.skills.map((skill) => (
                <li key={skill} className="flex items-center gap-3 rounded-xl bg-mist-50 px-4 py-3 text-sm font-semibold text-navy-900">
                  <Check className="size-4 shrink-0 text-royal-600" aria-hidden />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Goal() {
  const { t } = useTranslation();
  const goal = useSection<{ title: string; statement: string; objectives: string[] }>('goal');
  return (
    <Section tone="sky" labelledBy="goal-title" reveal>
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <CircleIcon name="target" size="lg" tone="navy" />
          <h2 id="goal-title" className="orange-underline mt-6 text-3xl sm:text-4xl">
            {goal.title}
          </h2>
          <p className="mt-6 text-xl leading-relaxed font-semibold text-navy-900">{goal.statement}</p>
          <figure className="mt-8">
            <div className="overflow-hidden rounded-3xl shadow-(--shadow-card) ring-1 ring-white">
              <img src={photos.workplace} alt={t('photos.workplace')} className="aspect-[16/10] w-full object-cover" />
            </div>
          </figure>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2">
          {goal.objectives.map((objective, i) => (
            <li key={objective} className="card flex gap-4 p-5">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-orange-500 text-sm font-bold text-navy-950">{i + 1}</span>
              <span className="font-semibold text-navy-950">{objective}</span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

const WHY_ICONS = ['lightbulb', 'brain', 'users', 'briefcase', 'handshake', 'refresh'];

function Why() {
  const why = useSection<{ title: string; subtitle: string; description: string; features: Item[] }>('why');
  return (
    <Section tone="white" labelledBy="why-title" reveal>
      <SectionHeading id="why-title" title={why.title} eyebrow={why.subtitle} subtitle={why.description} />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {why.features.map((feature, i) => (
          <li key={feature.title} className="card flex gap-4 p-6">
            <CircleIcon name={WHY_ICONS[i] ?? 'target'} size="sm" />
            <div>
              <h3 className="text-base">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed">{feature.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Courses() {
  const section = useSection<{ title: string; subtitle: string; viewAll: string }>('courses');
  const courses = useCourses();
  return (
    <Section tone="mist" id="courses" labelledBy="courses-title" reveal>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading id="courses-title" title={section.title} subtitle={section.subtitle} />
        <Link to="/courses" className="mb-10 inline-flex items-center gap-1.5 font-semibold text-royal-700 hover:underline">
          {section.viewAll}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
      {courses.isError ? (
        <ErrorState error={courses.error} onRetry={() => void courses.refetch()} />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
  );
}

function RoadmapSection() {
  const roadmap = useSection<{ title: string; subtitle: string; intro: string; years: RoadmapYear[] }>('roadmap');
  return (
    <Section tone="white" id="roadmap" labelledBy="roadmap-title" reveal>
      <SectionHeading id="roadmap-title" title={roadmap.title} eyebrow={roadmap.subtitle} subtitle={roadmap.intro} align="center" />
      <Roadmap years={roadmap.years} />
    </Section>
  );
}

function PathwaySection() {
  const pathway = useSection<{ title: string; subtitle: string; steps: PathwayStep[]; partnersTitle: string; partnersBody: string; disclaimer: string }>('pathway');
  return (
    <Section tone="navy" labelledBy="pathway-title" reveal>
      <SectionHeading id="pathway-title" title={pathway.title} subtitle={pathway.subtitle} tone="light" />
      <Pathway steps={pathway.steps} partnersTitle={pathway.partnersTitle} partnersBody={pathway.partnersBody} />
      <p className="mt-6 text-sm text-sky-50/75">{pathway.disclaimer}</p>
    </Section>
  );
}

function Eligibility() {
  const eligibility = useSection<{ title: string; statement: string; groups: Item[]; cta: string }>('eligibility');
  const icons = [GraduationCap, ScrollText];
  return (
    <Section tone="sky" labelledBy="eligibility-title" reveal>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading id="eligibility-title" title={eligibility.title} />
          <p className="text-lg leading-relaxed text-navy-900">{eligibility.statement}</p>
          <ButtonLink to="/apply" size="lg" className="mt-8">
            {eligibility.cta}
          </ButtonLink>
        </div>
        <ul className="grid gap-5">
          {eligibility.groups.map((group, i) => {
            const GroupIcon = icons[i] ?? Target;
            return (
              <li key={group.title} className="card flex gap-5 p-6">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-navy-950 text-white">
                  <GroupIcon className="size-7" aria-hidden />
                </span>
                <div>
                  <h3 className="text-lg">{group.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed">{group.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

function Collaborate() {
  const { t } = useTranslation();
  const partners = useSection<{ title: string; subtitle: string; body: string; cta: string }>('partners');
  return (
    <section aria-labelledby="collab-title" className="bg-white py-16 sm:py-20">
      <div className="container-page">
        <Reveal className="grid overflow-hidden rounded-3xl bg-royal-600 text-white lg:grid-cols-2">
          <div className="px-6 py-12 sm:px-12">
            <h2 id="collab-title" className="text-3xl text-white sm:text-4xl">
              {partners.title}
            </h2>
            <p className="mt-3 text-xl font-semibold text-orange-400">{partners.subtitle}</p>
            <p className="mt-5 text-lg text-sky-50/95">{partners.body}</p>
            <ButtonLink to="/companies" size="lg" className="mt-8">
              {partners.cta}
            </ButtonLink>
          </div>
          <figure className="relative min-h-64">
            <img src={photos.collaborate} alt={t('photos.collaborate')} className="absolute inset-0 h-full w-full object-cover" />
          </figure>
        </Reveal>
        <PartnerList className="mt-10" />
      </div>
    </section>
  );
}

function Contact() {
  const { t } = useTranslation('home');
  const contact = useSection<{ title: string; body: string }>('contact');
  const email = useSetting('contact.generalEmail', BROCHURE_EMAIL);
  return (
    <Section tone="navy" id="contact" labelledBy="contact-title" reveal>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading id="contact-title" title={contact.title} subtitle={contact.body} tone="light" />
          <a href={`mailto:${email}`} className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 text-lg font-semibold break-all text-white ring-1 ring-white/20 hover:bg-white/15">
            <Mail className="size-6 shrink-0 text-orange-400" aria-hidden />
            <span>
              <span className="sr-only">{t('contact.emailLabel')}: </span>
              {email}
            </span>
          </a>
        </div>
        <ul className="grid content-center gap-3">
          {(
            [
              ['/apply', 'contact.admissionLink'],
              ['/companies', 'contact.partnershipLink'],
              ['/contact', 'contact.contactLink'],
            ] as const
          ).map(([to, key]) => (
            <li key={to}>
              <Link to={to} className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 font-semibold text-navy-950 hover:bg-sky-50">
                <span className="flex items-center gap-3">
                  <Send className="size-5 text-royal-600" aria-hidden />
                  {t(key)}
                </span>
                <ArrowRight className="size-5 text-orange-700" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-12">
        <QrLinks />
      </div>
    </Section>
  );
}
