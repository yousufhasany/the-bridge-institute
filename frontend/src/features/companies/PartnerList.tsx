import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';

export interface PublicPartner {
  name: string;
  industry: string | null;
  website: string | null;
}

export function usePartnerCompanies() {
  return useQuery({
    queryKey: ['companies', 'partners'],
    queryFn: () => api.get<PublicPartner[]>('/companies/partners'),
    staleTime: 60_000,
  });
}

/** Names of active companies marked for the public site. Renders nothing when the list is empty. */
export function PartnerList({ className }: { className?: string }) {
  const { t } = useTranslation('pages');
  const partners = usePartnerCompanies();
  const items = partners.data ?? [];
  if (items.length === 0) return null;

  return (
    <div className={className}>
      <h2 className="text-2xl text-navy-950">{t('companies.partnersTitle')}</h2>
      <p className="mt-2 text-ink-500">{t('companies.partnersLead')}</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((company, index) => (
          <li key={`${company.name}-${index}`} className="rounded-2xl bg-sky-50 px-5 py-4 ring-1 ring-mist-200">
            {company.website ? (
              <a href={company.website} className="font-semibold text-navy-950 hover:text-royal-700 hover:underline" target="_blank" rel="noopener noreferrer">
                {company.name}
              </a>
            ) : (
              <p className="font-semibold text-navy-950">{company.name}</p>
            )}
            {company.industry && <p className="mt-1 text-sm text-ink-500">{company.industry}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
