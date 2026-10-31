import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../lib/api';
import { cn } from '../../lib/cn';
import { Button } from './Button';

export function Spinner({ label, className }: { label?: string; className?: string }) {
  const { t } = useTranslation();
  return (
    <div role="status" className={cn('flex items-center justify-center gap-3 py-12 text-ink-500', className)}>
      <Loader2 className="size-6 animate-spin text-royal-600" aria-hidden />
      <span>{label ?? t('states.loading')}</span>
    </div>
  );
}

/** Translates an API error into a user-facing message. */
export function useErrorMessage() {
  const { t } = useTranslation();
  return (error: unknown) => {
    if (error instanceof ApiError) {
      if (error.code === 'NETWORK_ERROR') return t('states.networkError');
      if (error.code === 'RATE_LIMITED') return t('states.rateLimited');
      return error.message;
    }
    return t('states.error');
  };
}

export function ErrorState({ error, onRetry, className }: { error?: unknown; onRetry?: () => void; className?: string }) {
  const { t } = useTranslation();
  const message = useErrorMessage();
  return (
    <div role="alert" className={cn('flex flex-col items-center gap-3 rounded-2xl bg-red-50 px-6 py-10 text-center text-red-900', className)}>
      <AlertTriangle className="size-8 text-red-600" aria-hidden />
      <p className="font-semibold">{t('states.error')}</p>
      <p className="text-sm">{error ? message(error) : t('states.errorDetail')}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t('actions.retry')}
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ title, children, icon }: { title: ReactNode; children?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-mist-200 bg-white px-6 py-12 text-center">
      {icon ?? <Inbox className="size-8 text-royal-500" aria-hidden />}
      <p className="font-semibold text-navy-950">{title}</p>
      {children && <div className="max-w-md text-sm text-ink-500">{children}</div>}
    </div>
  );
}

export function Alert({ kind = 'info', children, className }: { kind?: 'info' | 'success' | 'error' | 'warning'; children: ReactNode; className?: string }) {
  const styles = {
    info: 'bg-sky-50 text-navy-900 ring-royal-100',
    success: 'bg-emerald-50 text-emerald-900 ring-emerald-200',
    error: 'bg-red-50 text-red-900 ring-red-200',
    warning: 'bg-amber-50 text-amber-900 ring-amber-200',
  };
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={cn('rounded-xl px-4 py-3 text-sm ring-1', styles[kind], className)}>
      {children}
    </div>
  );
}
