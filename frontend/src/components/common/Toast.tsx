import { CheckCircle2, X, XCircle } from 'lucide-react';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';

type ToastKind = 'success' | 'error';
interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

const ToastContext = createContext<(message: string, kind?: ToastKind) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [items, setItems] = useState<ToastItem[]>([]);
  const dismiss = useCallback((id: number) => setItems((all) => all.filter((i) => i.id !== id)), []);
  const notify = useCallback(
    (message: string, kind: ToastKind = 'success') => {
      const id = Date.now() + Math.random();
      setItems((all) => [...all.slice(-3), { id, kind, message }]);
      setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl px-4 py-3 text-sm shadow-lg ring-1',
              item.kind === 'success' ? 'bg-white text-navy-950 ring-emerald-200' : 'bg-white text-navy-950 ring-red-200',
            )}
          >
            {item.kind === 'success' ? (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden />
            ) : (
              <XCircle className="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden />
            )}
            <p className="flex-1">{item.message}</p>
            <button type="button" onClick={() => dismiss(item.id)} className="rounded p-0.5 text-ink-500 hover:text-navy-950" aria-label={t('actions.close')}>
              <X className="size-4" aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
