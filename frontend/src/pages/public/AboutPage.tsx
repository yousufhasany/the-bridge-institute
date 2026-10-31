import { BookOpenCheck, Compass, Eye, Handshake, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ButtonLink } from '../../components/common/Button';
import { photos } from '../../assets/photos';
import { PageHeader, Section } from '../../components/common/Section';
import { useSection } from '../../features/cms/useSiteContent';
import { usePageMeta } from '../../hooks/usePageMeta';

const BLOCKS = [
  { key: 'mission', icon: Target },
  { key: 'vision', icon: Eye },
  { key: 'philosophy', icon: BookOpenCheck },
  { key: 'approach', icon: Compass },
  { key: 'alignment', icon: Handshake },
] as const;

export function AboutPage() {
  const { t } = useTranslation('pages');
  const about = useSection<Record<string, string>>('about');
  usePageMeta({ title: t('about.metaTitle'), description: t('about.metaDescription') });

  return (
    <>
      <PageHeader title={about.title} subtitle={about.intro} image={photos.about} />
      <Section tone="white">
        <div className="grid gap-6 md:grid-cols-2">
          {BLOCKS.map(({ key, icon: BlockIcon }, i) => (
            <article key={key} className={i === 0 ? 'card p-8 md:col-span-2' : 'card p-8'}>
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-royal-600 text-white">
                  <BlockIcon className="size-5" aria-hidden />
                </span>
                <h2 className="text-xl">{t(`about.headings.${key}`)}</h2>
              </div>
              <p className={i === 0 ? 'mt-5 text-xl leading-relaxed font-semibold text-navy-900' : 'mt-5 leading-relaxed'}>{about[key]}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink to="/courses" variant="secondary">
            {t('common:nav.courses')}
          </ButtonLink>
          <ButtonLink to="/companies" variant="outline">
            {t('common:nav.companies')}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
