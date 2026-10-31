import { useTranslation } from 'react-i18next';
import { ButtonLink } from '../../components/common/Button';
import { BridgeMark } from '../../components/common/Logo';
import { usePageMeta } from '../../hooks/usePageMeta';

export function NotFoundPage() {
  const { t } = useTranslation();
  usePageMeta({ title: t('notFound.title'), noIndex: true });
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <BridgeMark className="w-24" tone="dark" />
      <p className="mt-6 text-6xl font-extrabold text-royal-600">{t('notFound.code')}</p>
      <h1 className="mt-4 text-3xl">{t('notFound.title')}</h1>
      <p className="mt-3 max-w-md text-ink-500">{t('notFound.body')}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink to="/">{t('actions.goHome')}</ButtonLink>
        <ButtonLink to="/contact" variant="outline">
          {t('actions.contactUs')}
        </ButtonLink>
      </div>
    </div>
  );
}
