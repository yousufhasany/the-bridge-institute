import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';

export function LanguageSwitcher({ tone = 'dark', className }: { tone?: 'dark' | 'light'; className?: string }) {
  const { t, i18n } = useTranslation();
  const current = i18n.language === 'bn' ? 'bn' : 'en';
  return (
    <div
      role="group"
      aria-label={t('language.label')}
      className={cn(
        'inline-flex h-10 items-center rounded-full p-1',
        tone === 'dark' ? 'bg-mist-50 ring-1 ring-inset ring-mist-200' : 'bg-white/10 ring-1 ring-inset ring-white/30',
        className,
      )}
    >
      {(['en', 'bn'] as const).map((lng) => (
        <button
          key={lng}
          type="button"
          lang={lng}
          aria-pressed={current === lng}
          onClick={() => void i18n.changeLanguage(lng)}
          className={cn(
            'inline-flex h-8 items-center rounded-full px-3 text-xs font-semibold transition-colors',
            current === lng
              ? 'bg-white text-navy-950 shadow-[0_1px_2px_rgb(9_43_76/0.14)]'
              : tone === 'dark'
                ? 'text-ink-500 hover:text-navy-950'
                : 'text-white/80 hover:text-white',
          )}
        >
          {lng === 'en' ? 'EN' : 'বাংলা'}
        </button>
      ))}
    </div>
  );
}
