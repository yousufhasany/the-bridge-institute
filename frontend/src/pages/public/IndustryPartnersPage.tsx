import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { photos } from '../../assets/photos';
import { PageHeader, Section } from '../../components/common/Section';
import { EmptyState, ErrorState, Spinner } from '../../components/common/States';
import { usePartnerCompanies } from '../../features/companies/PartnerList';
import { usePageMeta } from '../../hooks/usePageMeta';

export function IndustryPartnersPage() {
  const { t } = useTranslation('pages');
  const partners = usePartnerCompanies();
  usePageMeta({ title: t('companies.industryTitle'), description: t('companies.industrySubtitle') });

  return (
    <>
      <PageHeader title={t('companies.industryTitle')} subtitle={t('companies.industrySubtitle')} image={photos.partners} />
      <Section tone="mist">
        {partners.isLoading ? (
          <Spinner />
        ) : partners.isError ? (
          <ErrorState error={partners.error} onRetry={() => void partners.refetch()} />
        ) : !partners.data?.length ? (
          <EmptyState title={t('companies.industryEmpty')} />
        ) : (
          <ul className="grid gap-5 lg:grid-cols-2">
            {partners.data.map((company, index) => (
              <li key={`${company.name}-${index}`} className="card p-6 sm:p-8">
                <h2 className="text-2xl text-navy-950">{company.name}</h2>
                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="font-semibold tracking-wide text-ink-500 uppercase">{t('companies.industryLabel')}</dt>
                    <dd className="mt-1 text-base text-navy-950">{company.industry || '—'}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold tracking-wide text-ink-500 uppercase">{t('companies.websiteLabel')}</dt>
                    <dd className="mt-1 text-base">
                      {company.website ? (
                        <a href={company.website} className="inline-flex items-center gap-1.5 font-semibold break-all text-royal-700 hover:underline" target="_blank" rel="noopener noreferrer">
                          {company.website}
                          <ExternalLink className="size-4 shrink-0" aria-hidden />
                          <span className="sr-only">{t('companies.visitWebsite')}</span>
                        </a>
                      ) : (
                        <span className="text-ink-500">{t('companies.noWebsite')}</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
