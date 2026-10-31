import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, GraduationCap, ScrollText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { z } from 'zod';
import { Button, ButtonLink } from '../../components/common/Button';
import { PageHeader, Section } from '../../components/common/Section';
import { Alert, useErrorMessage } from '../../components/common/States';
import { Checkbox, SelectField, TextArea, TextField } from '../../components/forms/Field';
import { applyServerErrors, compact, v } from '../../components/forms/formUtils';
import { useAuth } from '../../features/auth/AuthProvider';
import { useSection } from '../../features/cms/useSiteContent';
import { usePageMeta } from '../../hooks/usePageMeta';
import { api, ApiError } from '../../lib/api';

const STATUSES = ['graduate_seeking_employment', 'hsc_qualified', 'student', 'employed', 'other'] as const;

const schema = z.object({
  fullName: v.text(120).min(2, 'validation.min:2'),
  email: v.email(),
  phone: v.phone(),
  currentStatus: z.enum(STATUSES, { error: 'validation.required' }),
  highestEducation: v.optionalText(120),
  motivation: z.string().trim().min(20, 'validation.min:20').max(2000, 'validation.max:2000'),
  preferredContact: z.union([z.literal(''), z.enum(['email', 'phone', 'either'])]),
  privacyConsent: v.consent(),
});
type FormValues = z.input<typeof schema>;

export function ApplyPage() {
  const { t, i18n } = useTranslation('pages');
  const { user } = useAuth();
  const eligibility = useSection<{ title: string; statement: string; groups: { title: string; body: string }[] }>('eligibility');
  const errorMessage = useErrorMessage();
  const idempotencyKey = useRef(crypto.randomUUID());
  const [result, setResult] = useState<{ referenceCode: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  usePageMeta({ title: t('apply.metaTitle'), description: t('apply.metaDescription') });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', phone: '', highestEducation: '', motivation: '', preferredContact: '', privacyConsent: false },
  });
  const { register, handleSubmit, formState, setError, reset, setValue, getValues } = form;
  const errors = formState.errors;

  useEffect(() => {
    if (user && !getValues('email')) {
      setValue('fullName', user.fullName);
      setValue('email', user.email);
      if (user.phone) setValue('phone', user.phone);
    }
  }, [user, getValues, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const data = await api.post<{ referenceCode: string }>('/applications', {
        ...compact(values),
        locale: i18n.language === 'bn' ? 'bn' : 'en',
        idempotencyKey: idempotencyKey.current,
      });
      setResult(data);
      window.scrollTo({ top: 0 });
    } catch (error) {
      if (applyServerErrors(error, setError)) return;
      setFormError(error instanceof ApiError && error.code === 'DUPLICATE_APPLICATION' ? t('apply.duplicate') : errorMessage(error));
    }
  });

  if (result) {
    return (
      <Section>
        <div className="mx-auto max-w-xl text-center" role="status">
          <CheckCircle2 className="mx-auto size-16 text-emerald-600" aria-hidden />
          <h1 className="mt-6 text-3xl">{t('apply.successTitle')}</h1>
          <p className="mt-3 text-lg">{t('apply.successBody')}</p>
          <p className="mt-6 text-sm font-semibold text-ink-500">{t('apply.reference')}</p>
          <p className="mt-1 inline-block rounded-xl bg-sky-50 px-5 py-3 font-mono text-2xl font-bold tracking-wider text-navy-950">{result.referenceCode}</p>
          {user && <p className="mt-6 text-sm">{t('apply.signedInNote')}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {user && <ButtonLink to="/student/applications">{t('common:nav.dashboard')}</ButtonLink>}
            <Button
              variant="outline"
              onClick={() => {
                idempotencyKey.current = crypto.randomUUID();
                reset();
                setResult(null);
              }}
            >
              {t('apply.another')}
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <>
      <PageHeader title={t('apply.title')} subtitle={t('apply.intro')} />
      <Section tone="mist">
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
          <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 sm:p-8" aria-describedby={formError ? 'apply-error' : undefined}>
            {!user && (
              <Alert>
                {t('apply.signInHint')}{' '}
                <Link to="/login" state={{ from: '/apply' }} className="font-semibold text-royal-700 underline">
                  {t('common:nav.login')}
                </Link>
              </Alert>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label={t('apply.fields.fullName')} required autoComplete="name" error={errors.fullName} {...register('fullName')} />
              <TextField label={t('apply.fields.email')} required type="email" autoComplete="email" error={errors.email} {...register('email')} />
              <TextField label={t('apply.fields.phone')} required type="tel" autoComplete="tel" error={errors.phone} {...register('phone')} />
              <SelectField
                label={t('apply.fields.currentStatus')}
                required
                placeholder={t('apply.selectStatus')}
                options={STATUSES.map((s) => ({ value: s, label: t(`apply.statuses.${s}`) }))}
                error={errors.currentStatus}
                {...register('currentStatus')}
              />
              <TextField label={t('apply.fields.highestEducation')} error={errors.highestEducation} {...register('highestEducation')} />
            </div>
            <div className="rounded-xl bg-sky-50 px-4 py-3 text-sm leading-relaxed text-navy-900">
              <p className="font-semibold">{t('apply.programmeTitle')}</p>
              <p className="mt-1">{t('apply.programmeBody')}</p>
            </div>
            <TextArea label={t('apply.fields.motivation')} required rows={5} hint={t('apply.fields.motivationHint')} error={errors.motivation} {...register('motivation')} />
            <SelectField
              label={t('apply.fields.preferredContact')}
              placeholder="—"
              options={(['email', 'phone', 'either'] as const).map((m) => ({ value: m, label: t(`apply.contactMethods.${m}`) }))}
              error={errors.preferredContact}
              {...register('preferredContact')}
              wrapperClassName="sm:max-w-xs"
            />
            <Checkbox
              label={
                <>
                  {t('apply.fields.privacyConsent')}{' '}
                  <Link to="/privacy" target="_blank" className="font-semibold text-royal-700 underline">
                    {t('common:footer.privacy')}
                  </Link>
                </>
              }
              error={errors.privacyConsent}
              {...register('privacyConsent')}
            />
            {formError && (
              <Alert kind="error">
                <span id="apply-error">{formError}</span>
              </Alert>
            )}
            <Button type="submit" size="lg" loading={formState.isSubmitting}>
              {formState.isSubmitting ? t('common:actions.submitting') : t('common:actions.submit')}
            </Button>
          </form>

          <aside className="space-y-4">
            <h2 className="text-xl">{eligibility.title}</h2>
            <p className="text-sm leading-relaxed">{eligibility.statement}</p>
            {eligibility.groups.map((group, i) => {
              const GroupIcon = i === 0 ? GraduationCap : ScrollText;
              return (
                <div key={group.title} className="card flex gap-3 p-4">
                  <GroupIcon className="size-6 shrink-0 text-royal-600" aria-hidden />
                  <div>
                    <h3 className="text-sm">{group.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed">{group.body}</p>
                  </div>
                </div>
              );
            })}
          </aside>
        </div>
      </Section>
    </>
  );
}
