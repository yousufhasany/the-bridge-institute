import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';

/** Official mark from the institute logo, without the wordmark. */
export function BridgeMark({ className, tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  return (
    <img
      src="/logo-mark.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={cn('object-contain', tone === 'light' && 'rounded-lg bg-white p-1', className)}
    />
  );
}

export function Logo({
  tone = 'dark',
  className,
  imageClassName,
  compact = false,
}: {
  tone?: 'light' | 'dark';
  className?: string;
  imageClassName?: string;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <span className={cn('inline-flex max-w-full items-center', tone === 'light' && 'rounded-xl bg-white px-2.5 py-1.5', className)}>
      <img
        src="/logo.png"
        alt={t('brand.name')}
        draggable={false}
        className={imageClassName ?? (compact ? 'h-10 w-auto' : 'h-12 w-auto sm:h-14')}
      />
    </span>
  );
}
