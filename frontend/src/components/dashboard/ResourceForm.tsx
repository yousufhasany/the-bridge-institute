import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toDateInput } from '../../lib/format';
import { cn } from '../../lib/cn';
import { Checkbox, SelectField, TextArea, TextField } from '../forms/Field';
import { applyServerErrors } from '../forms/formUtils';

export interface FieldSpec {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'email' | 'url';
  required?: boolean;
  options?: { value: string; label: string }[];
  hint?: string;
  full?: boolean;
  lang?: 'bn';
  /** Excluded from create/update payloads when editing (e.g. immutable keys). */
  createOnly?: boolean;
}

type Values = Record<string, string | boolean>;

/** Converts an API record into string form values. */
function toFormValues(fields: FieldSpec[], record?: Record<string, unknown> | null): Values {
  const values: Values = {};
  for (const f of fields) {
    const raw = record?.[f.name];
    if (f.type === 'checkbox') values[f.name] = Boolean(raw);
    else if (f.type === 'date') values[f.name] = typeof raw === 'string' ? toDateInput(raw) : '';
    else values[f.name] = raw === null || raw === undefined ? '' : String(raw);
  }
  return values;
}

/** Converts form values into an API payload: empty optional values become null, numbers are parsed. */
function toPayload(fields: FieldSpec[], values: Values, editing: boolean) {
  const payload: Record<string, unknown> = {};
  for (const f of fields) {
    if (editing && f.createOnly) continue;
    const v = values[f.name];
    if (f.type === 'checkbox') payload[f.name] = Boolean(v);
    else if (typeof v === 'string' && v.trim() === '') payload[f.name] = f.required ? '' : null;
    else if (f.type === 'number') payload[f.name] = Number(v);
    else payload[f.name] = typeof v === 'string' ? v.trim() : v;
  }
  return payload;
}

export function ResourceForm({
  id,
  fields,
  record,
  onSubmit,
  onError,
}: {
  id: string;
  fields: FieldSpec[];
  record?: Record<string, unknown> | null;
  onSubmit: (payload: Record<string, unknown>) => Promise<unknown>;
  onError: (error: unknown) => void;
}) {
  const { t } = useTranslation('common');
  const editing = Boolean(record);
  const { register, handleSubmit, formState, setError } = useForm<Values>({ defaultValues: toFormValues(fields, record) });

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(toPayload(fields, values, editing));
    } catch (error) {
      if (!applyServerErrors(error, setError)) onError(error);
    }
  });

  return (
    <form id={id} onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => {
        const error = formState.errors[f.name];
        const rules = { required: f.required && f.type !== 'checkbox' ? t('validation.required') : false };
        const common = { label: f.label, required: f.required, hint: f.hint, error: error?.message as string | undefined, wrapperClassName: cn(f.full && 'sm:col-span-2') };
        const disabled = editing && f.createOnly;
        switch (f.type) {
          case 'textarea':
            return <TextArea key={f.name} {...common} rows={4} lang={f.lang} {...register(f.name, rules)} />;
          case 'select':
            return <SelectField key={f.name} {...common} placeholder="—" options={f.options ?? []} disabled={disabled} {...register(f.name, rules)} />;
          case 'checkbox':
            return (
              <div key={f.name} className="self-end sm:col-span-2">
                <Checkbox label={f.label} {...register(f.name)} />
                {f.hint && <p className="mt-1 text-sm text-ink-500">{f.hint}</p>}
              </div>
            );
          default:
            return (
              <TextField
                key={f.name}
                {...common}
                type={f.type ?? 'text'}
                lang={f.lang}
                disabled={disabled}
                {...(f.type === 'url' ? { placeholder: 'https://' } : {})}
                {...register(f.name, rules)}
              />
            );
        }
      })}
    </form>
  );
}
