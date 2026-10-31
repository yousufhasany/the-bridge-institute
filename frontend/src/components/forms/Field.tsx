import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';

export const inputClasses =
  'block w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-navy-950 ring-1 ring-inset ring-mist-200 placeholder:text-ink-500/70 focus:ring-2 focus:ring-inset focus:ring-royal-600 disabled:bg-mist-50 aria-[invalid=true]:ring-red-500';

/** Validation messages are i18n keys (e.g. "validation.required") or literal server messages. */
export function useFieldMessage() {
  const { t } = useTranslation();
  return (error?: FieldError | string) => {
    const message = typeof error === 'string' ? error : error?.message;
    if (!message) return undefined;
    if (message.startsWith('validation.')) {
      const [key, count] = message.split(':');
      return t(key, { count: count ? Number(count) : undefined });
    }
    return message;
  };
}

interface FieldShellProps {
  label: ReactNode;
  error?: FieldError | string;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
}

export function FieldShell({ label, error, hint, required, className, children }: FieldShellProps) {
  const id = useId();
  const { t } = useTranslation();
  const message = useFieldMessage()(error);
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = message ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy-950">
        {label}
        {required ? (
          <span className="ml-0.5 text-red-600" aria-hidden>
            *
          </span>
        ) : (
          <span className="ml-1.5 text-xs font-normal text-ink-500">({t('misc.optional')})</span>
        )}
      </label>
      {children({ id, describedBy, invalid: Boolean(message) })}
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-ink-500">
          {hint}
        </p>
      )}
      {message && (
        <p id={errorId} className="mt-1.5 text-sm text-red-700">
          {message}
        </p>
      )}
    </div>
  );
}

type Common = { label: ReactNode; error?: FieldError | string; hint?: ReactNode; wrapperClassName?: string };

export const TextField = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & Common>(function TextField(
  { label, error, hint, wrapperClassName, className, required, ...rest },
  ref,
) {
  return (
    <FieldShell label={label} error={error} hint={hint} required={required} className={wrapperClassName}>
      {({ id, describedBy, invalid }) => (
        <input ref={ref} id={id} aria-describedby={describedBy} aria-invalid={invalid} aria-required={required} className={cn(inputClasses, className)} {...rest} />
      )}
    </FieldShell>
  );
});

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & Common>(function TextArea(
  { label, error, hint, wrapperClassName, className, required, rows = 4, ...rest },
  ref,
) {
  return (
    <FieldShell label={label} error={error} hint={hint} required={required} className={wrapperClassName}>
      {({ id, describedBy, invalid }) => (
        <textarea ref={ref} id={id} rows={rows} aria-describedby={describedBy} aria-invalid={invalid} aria-required={required} className={cn(inputClasses, className)} {...rest} />
      )}
    </FieldShell>
  );
});

export const SelectField = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & Common & { options: { value: string; label: string }[]; placeholder?: string }>(
  function SelectField({ label, error, hint, wrapperClassName, className, required, options, placeholder, ...rest }, ref) {
    return (
      <FieldShell label={label} error={error} hint={hint} required={required} className={wrapperClassName}>
        {({ id, describedBy, invalid }) => (
          <select ref={ref} id={id} aria-describedby={describedBy} aria-invalid={invalid} aria-required={required} className={cn(inputClasses, 'pr-9', className)} {...rest}>
            {placeholder !== undefined && <option value="">{placeholder}</option>}
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )}
      </FieldShell>
    );
  },
);

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; error?: FieldError | string }>(function Checkbox(
  { label, error, className, ...rest },
  ref,
) {
  const id = useId();
  const message = useFieldMessage()(error);
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          aria-invalid={Boolean(message)}
          aria-describedby={message ? `${id}-error` : undefined}
          className="mt-0.5 size-5 shrink-0 rounded border-mist-200 text-royal-600 focus:ring-royal-600"
          {...rest}
        />
        <label htmlFor={id} className="text-sm text-ink-700">
          {label}
        </label>
      </div>
      {message && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">
          {message}
        </p>
      )}
    </div>
  );
});
