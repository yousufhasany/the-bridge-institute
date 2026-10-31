import { useTranslation } from 'react-i18next';
import { PageHeader, Section } from '../../components/common/Section';
import { SimpleText } from '../../components/common/SimpleText';
import { useSection } from '../../features/cms/useSiteContent';
import { usePageMeta } from '../../hooks/usePageMeta';

function PolicyPage({ sectionKey }: { sectionKey: 'privacy' | 'terms' }) {
  const { t } = useTranslation('pages');
  const content = useSection<{ title: string; body: string }>(sectionKey);
  usePageMeta({ title: t(`${sectionKey}.metaTitle`) });
  return (
    <>
      <PageHeader title={content.title} />
      <Section>
        <SimpleText text={content.body} className="prose-content max-w-3xl text-lg" />
      </Section>
    </>
  );
}

export const PrivacyPage = () => <PolicyPage sectionKey="privacy" />;
export const TermsPage = () => <PolicyPage sectionKey="terms" />;
