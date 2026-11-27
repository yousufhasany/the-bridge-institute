import { QRCodeSVG } from 'qrcode.react';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SITE_FACEBOOK_URL, SITE_INSTAGRAM_URL, usePublicSettings } from '../../features/cms/useSiteContent';
import { FacebookFavicon, InstagramFavicon } from './SocialIcon';

const QR_ITEMS = [
  { setting: 'qr.employmentSeekers', label: 'qr.employmentSeekers' },
  { setting: 'qr.admissionInformation', label: 'qr.admissionInformation' },
  { setting: 'qr.industryQueries', label: 'qr.industryQueries' },
  { setting: 'qr.universityFoundationCourses', label: 'qr.universityFoundationCourses' },
  { setting: 'social.facebookUrl', label: 'qr.facebook' },
  { setting: 'social.instagramUrl', label: 'qr.instagram' },
] as const;

const SOCIAL_FALLBACKS: Record<string, string> = {
  'social.facebookUrl': SITE_FACEBOOK_URL,
  'social.instagramUrl': SITE_INSTAGRAM_URL,
};

const isSafeUrl = (url: unknown): url is string => typeof url === 'string' && /^https?:\/\/\S+$/i.test(url);

/**
 * The brochure's QR codes. Destinations come only from admin settings; nothing is
 * shown for a QR item until its real destination has been configured.
 */
export function QrLinks({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { t } = useTranslation();
  const settings = usePublicSettings();
  const items = QR_ITEMS.flatMap((item) => {
    const configured = settings.data?.[item.setting];
    const url = isSafeUrl(configured) ? configured : SOCIAL_FALLBACKS[item.setting];
    return isSafeUrl(url) ? [{ ...item, url }] : [];
  });
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className={tone === 'light' ? 'text-lg text-white' : 'text-lg'}>{t('qr.title')}</h3>
      <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => {
          const label = t(item.label);
          return (
            <li key={item.setting} className="flex flex-col items-center gap-2 rounded-2xl bg-white p-3 text-center text-navy-950 ring-1 ring-mist-200">
              <QRCodeSVG value={item.url} size={112} level="M" title={t('qr.qrAlt', { label })} className="h-auto w-full max-w-28" />
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                {item.setting === 'social.facebookUrl' && <FacebookFavicon className="size-4" />}
                {item.setting === 'social.instagramUrl' && <InstagramFavicon className="size-4" />}
                {label}
              </span>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-royal-700">
                {t('qr.open')}
                <ExternalLink className="size-3" aria-hidden />
                <span className="sr-only">: {label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
