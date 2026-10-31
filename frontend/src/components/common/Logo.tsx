import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';

/** Cable-stayed bridge mark inspired by the brochure. */
export function BridgeMark({ className, tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  const stroke = tone === 'light' ? '#FFFFFF' : '#10365B';
  return (
    <svg viewBox="0 0 64 48" className={className} aria-hidden="true" focusable="false">
      <g stroke={stroke} strokeLinecap="round" fill="none">
        <path d="M26 4 L24 38" strokeWidth="3.5" />
        <path d="M26 6 L4 34 M26 6 L11 34 M26 6 L18 34 M26 6 L33 34 M26 6 L41 34 M26 6 L49 34 M26 6 L57 34" strokeWidth="1.5" />
        <path d="M2 34 H62" strokeWidth="3.5" />
      </g>
      <path d="M6 43 Q32 37 58 43" stroke="#F7941D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Logo({ tone = 'dark', className, compact = false }: { tone?: 'light' | 'dark'; className?: string; compact?: boolean }) {
  const { t } = useTranslation();
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl', tone === 'dark' ? 'bg-navy-950' : 'bg-white/10')}>
        <BridgeMark className="w-8" tone="light" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-tight">
          <span className={cn('text-base font-extrabold tracking-tight sm:text-lg', tone === 'dark' ? 'text-navy-950' : 'text-white')}>{t('brand.name')}</span>
          <span className={cn('text-[0.7rem] font-medium', tone === 'dark' ? 'text-ink-500' : 'text-sky-50/80')}>{t('brand.parent')}</span>
        </span>
      )}
    </span>
  );
}
