import { X } from 'lucide-react';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';
import { Button } from './Button';

/** Accessible dialog built on the native <dialog> element (focus trap, Escape to close). */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'md' | 'lg' | 'xl';
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { t } = useTranslation();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className={cn(
        'm-auto max-h-[90vh] w-[calc(100%-2rem)] overflow-hidden rounded-2xl p-0 shadow-2xl backdrop:bg-navy-950/50',
        { md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size],
      )}
    >
      {open && (
        <div className="flex max-h-[90vh] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-mist-200 px-6 py-4">
            <h2 id={titleId} className="text-lg">
              {title}
            </h2>
            <button type="button" onClick={onClose} className="rounded-full p-1.5 text-ink-500 hover:bg-mist-50 hover:text-navy-950" aria-label={t('actions.close')}>
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-5">{children}</div>
          {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-mist-200 bg-mist-50 px-6 py-4">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  loading,
  danger,
}: {
  open: boolean;
  title: ReactNode;
  message: ReactNode;
  confirmLabel?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  danger?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onCancel}>
            {t('actions.cancel')}
          </Button>
          <Button variant={danger ? 'danger' : 'secondary'} onClick={onConfirm} loading={loading}>
            {confirmLabel ?? t('actions.confirm')}
          </Button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  );
}
