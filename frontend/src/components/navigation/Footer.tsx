import { Mail, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { BROCHURE_EMAIL, usePublicSettings, useSection, useSetting } from '../../features/cms/useSiteContent';
import { Logo } from '../common/Logo';

const SAFE_URL = /^https?:\/\//i;

export function Footer() {
  const { t } = useTranslation();
  const footer = useSection<{ about: string }>('footer');
  const settings = usePublicSettings();
  const email = useSetting('contact.generalEmail', BROCHURE_EMAIL);
  const phone = useSetting('contact.phone');
  const address = useSetting('contact.address');
  const facebook = useSetting('social.facebookUrl');
  const otherLinks = ((settings.data?.['social.links'] as { label: string; url: string }[] | undefined) ?? []).filter((l) => SAFE_URL.test(l.url));
  const social = [...(SAFE_URL.test(facebook) ? [{ label: t('qr.facebook'), url: facebook }] : []), ...otherLinks];
  const year = new Date().getFullYear();

  const explore = [
    ['/courses', 'nav.courses'],
    ['/industry-partners', 'nav.industryPartners'],
    ['/learning-journey', 'nav.learningJourney'],
    ['/about', 'nav.about'],
    ['/alumni', 'nav.alumni'],
  ] as const;
  const involved = [
    ['/apply', 'nav.apply'],
    ['/companies', 'nav.companies'],
    ['/alumni/join', 'footer.joinAlumni'],
    ['/contact', 'nav.contact'],
  ] as const;

  return (
    <footer className="bg-navy-950 text-sky-50/90">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo tone="light" />
          <p className="mt-5 text-sm leading-relaxed">{footer.about}</p>
        </div>
        <FooterLinks title={t('footer.explore')} links={explore} />
        <FooterLinks title={t('footer.getInvolved')} links={involved} />
        <div>
          <h2 className="mb-4 text-sm font-bold tracking-wide text-white uppercase">{t('footer.contact')}</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-orange-400" aria-hidden />
              <a href={`mailto:${email}`} className="break-all hover:text-white hover:underline">
                {email}
              </a>
            </li>
            {phone && (
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-orange-400" aria-hidden />
                <a href={`tel:${phone.replace(/[^+0-9]/g, '')}`} className="hover:text-white hover:underline">
                  {phone}
                </a>
              </li>
            )}
            {address && (
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-orange-400" aria-hidden />
                <span className="whitespace-pre-line">{address}</span>
              </li>
            )}
          </ul>
          {social.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold tracking-wide text-white uppercase">{t('footer.followUs')}</p>
              <ul className="flex flex-wrap gap-2">
                {social.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-white/30 hover:bg-white/10">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {t('brand.name')} · {t('brand.parent')}. {t('footer.rights')}
          </p>
          <ul className="flex gap-4">
            <li>
              <Link to="/privacy" className="hover:text-white hover:underline">
                {t('footer.privacy')}
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white hover:underline">
                {t('footer.terms')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: readonly (readonly [string, string])[] }) {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="mb-4 text-sm font-bold tracking-wide text-white uppercase">{title}</h2>
      <ul className="space-y-2.5 text-sm">
        {links.map(([to, key]) => (
          <li key={to}>
            <Link to={to} className="hover:text-white hover:underline">
              {t(key)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
