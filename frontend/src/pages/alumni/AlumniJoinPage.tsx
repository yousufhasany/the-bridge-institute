import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button, ButtonLink } from '../../components/common/Button';
import { PageHeader, Section } from '../../components/common/Section';
import { Alert, useErrorMessage } from '../../components/common/States';
import { SelectField, TextArea, TextField } from '../../components/forms/Field';
import { applyServerErrors, v } from '../../components/forms/formUtils';
import { ME_QUERY_KEY, useAuth } from '../../features/auth/AuthProvider';
import { ALUMNI_ME_KEY } from '../../features/alumni/useAlumniMe';
import { usePageMeta } from '../../hooks/usePageMeta';
import { api } from '../../lib/api';

interface Options {
  cohorts: { id: string; name: string; graduationYear: number | null }[];
  courses: { id: string; translations: { locale: string; title: string }[] }[];
}

const schema = z.object({
  fullName: v.text(120).min(2, 'validation.min:2'),
  email: v.email(),
  graduationYear: z.union([z.literal(''), z.string().regex(/^(20\d{2}|2100)$/, 'validation.invalid')]),
  cohortId: z.string(),
  studentCode: v.optionalText(40),
  message: v.optionalText(2000),
});
type FormValues = z.infer<typeof schema>;

/** Signed-in alumni submit a verification request (accounts are created by staff). */
export function AlumniJoinPage() {
  const { t } = useTranslation('alumni');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const errorMessage = useErrorMessage();
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  usePageMeta({ title: t('join.metaTitle') });

  const options = useQuery({ queryKey: ['alumni', 'registration-options'], queryFn: () => api.get<Options>('/alumni/registration-options') });
  const { register, handleSubmit, formState, setError } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: { fullName: user?.fullName ?? '', email: user?.email ?? '', graduationYear: '', cohortId: '', studentCode: '', message: '' },
    resetOptions: { keepDirtyValues: true },
  });
  const errors = formState.errors;

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await api.post('/alumni/register', {
        fullName: values.fullName,
        email: values.email,
        graduationYear: values.graduationYear ? Number(values.graduationYear) : null,
        cohortId: values.cohortId || null,
        studentCode: values.studentCode || null,
        message: values.message || null,
      });
      await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: ALUMNI_ME_KEY });
      setDone(true);
    } catch (error) {
      if (!applyServerErrors(error, setError)) setFormError(errorMessage(error));
    }
  });

  return (
    <>
      <PageHeader title={t('join.title')} subtitle={t('join.intro')} />
      <Section tone="mist">
        <div className="mx-auto max-w-2xl">
          {done ? (
            <div className="card flex flex-col items-center gap-4 p-10 text-center" role="status">
              <CheckCircle2 className="size-12 text-emerald-600" aria-hidden />
              <p className="text-lg font-semibold text-navy-950">{t('join.success')}</p>
              <ButtonLink to="/alumni/dashboard">{t('join.goDashboard')}</ButtonLink>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 sm:p-8">
              <Alert>{t('join.signedInAs', { email: user?.email ?? '' })}</Alert>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label={t('join.fields.fullName')} required autoComplete="name" error={errors.fullName} {...register('fullName')} />
                <TextField label={t('join.fields.email')} required type="email" autoComplete="email" readOnly error={errors.email} {...register('email')} />
                <TextField label={t('join.fields.graduationYear')} inputMode="numeric" placeholder="2027" error={errors.graduationYear} {...register('graduationYear')} />
                <TextField label={t('join.fields.studentCode')} error={errors.studentCode} {...register('studentCode')} />
                {(options.data?.cohorts.length ?? 0) > 0 && (
                  <SelectField label={t('join.fields.cohort')} placeholder={t('join.selectCohort')} options={(options.data?.cohorts ?? []).map((c) => ({ value: c.id, label: c.name }))} {...register('cohortId')} />
                )}
              </div>
              <TextArea label={t('join.fields.message')} rows={4} error={errors.message} {...register('message')} />
              {formError && <Alert kind="error">{formError}</Alert>}
              <Button type="submit" size="lg" loading={formState.isSubmitting}>
                {formState.isSubmitting ? t('common:actions.submitting') : t('common:actions.submit')}
              </Button>
            </form>
          )}
        </div>
      </Section>
    </>
  );
}
