import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, CheckCircle2, Handshake } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '../../components/common/Button';
import { photos } from '../../assets/photos';
import { PageHeader, Section, SectionHeading } from '../../components/common/Section';
import { Alert, useErrorMessage } from '../../components/common/States';
import { Checkbox, SelectField, TextArea, TextField } from '../../components/forms/Field';
import { applyServerErrors, compact, v } from '../../components/forms/formUtils';
import { useSection } from '../../features/cms/useSiteContent';
import { PartnerList } from '../../features/companies/PartnerList';
import { usePageMeta } from '../../hooks/usePageMeta';
import { api } from '../../lib/api';

const INTERESTS = [
  'skill_requirements',
  'training_collaboration',
  'guest_sessions_mentoring',
  'practical_projects',
  'workplace_learning',
  'internships',
  'employment',
  'reskilling_upskilling',
  'other',
] as const;

const schema = z.object({
  organizationName: v.text(160).min(2, 'validation.min:2'),
  contactName: v.text(120).min(2, 'validation.min:2'),
  workEmail: v.email(),
  phone: v.optionalPhone(),
  website: v.optionalUrl(),
  interest: z.enum(INTERESTS, { error: 'validation.required' }),
  message: z.string().trim().min(10, 'validation.min:10').max(5000, 'validation.max:5000'),
  consent: v.consent(),
});
type FormValues = z.input<typeof schema>;

export function CompaniesPage() {
  const { t } = useTranslation('pages');
  const page = useSection<Record<string, string> & { areas: string[] }>('companies');
  const errorMessage = useErrorMessage();
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  usePageMeta({ title: t('companies.metaTitle'), description: t('companies.metaDescription') });

  const { register, handleSubmit, formState, setError, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { organizationName: '', contactName: '', workEmail: '', phone: '', website: '', message: '', consent: false },
  });
  const errors = formState.errors;

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await api.post('/partnership-inquiries', compact(values));
      setSent(true);
      reset();
    } catch (error) {
      if (!applyServerErrors(error, setError)) setFormError(errorMessage(error));
    }
  });

  return (
    <>
      <PageHeader title={page.title} subtitle={page.subtitle} image={photos.companies}>
        <p className="mt-4 max-w-2xl text-sky-50/85">{page.body}</p>
      </PageHeader>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading title={page.partnerTitle} eyebrow={page.partnerLead} />
            <p className="text-lg leading-relaxed">{page.partnerBody}</p>
          </div>
          <div className="rounded-(--radius-card) bg-sky-50 p-8">
            <h2 className="flex items-center gap-2 text-xl">
              <Handshake className="size-6 text-royal-600" aria-hidden />
              {page.areasTitle}
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {page.areas.map((area) => (
                <li key={area} className="flex items-start gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-navy-900">
                  <Building2 className="mt-0.5 size-4 shrink-0 text-orange-700" aria-hidden />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <PartnerList className="mt-14" />
      </Section>

      <Section tone="mist" id="inquiry" labelledBy="inquiry-title">
        <div className="mx-auto max-w-3xl">
          <SectionHeading id="inquiry-title" title={page.formTitle} subtitle={page.formIntro} />
          {sent ? (
            <div className="card flex flex-col items-center gap-4 p-10 text-center" role="status">
              <CheckCircle2 className="size-12 text-emerald-600" aria-hidden />
              <p className="text-lg font-semibold text-navy-950">{t('companies.success')}</p>
              <Button variant="outline" onClick={() => setSent(false)}>
                {t('common:actions.back')}
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label={t('companies.fields.organizationName')} required autoComplete="organization" error={errors.organizationName} {...register('organizationName')} />
                <TextField label={t('companies.fields.contactName')} required autoComplete="name" error={errors.contactName} {...register('contactName')} />
                <TextField label={t('companies.fields.workEmail')} required type="email" autoComplete="email" error={errors.workEmail} {...register('workEmail')} />
                <TextField label={t('companies.fields.phone')} type="tel" autoComplete="tel" error={errors.phone} {...register('phone')} />
                <TextField label={t('companies.fields.website')} type="url" placeholder="https://" error={errors.website} {...register('website')} />
                <SelectField
                  label={t('companies.fields.interest')}
                  required
                  placeholder={t('companies.selectInterest')}
                  options={INTERESTS.map((i) => ({ value: i, label: t(`companies.interests.${i}`) }))}
                  error={errors.interest}
                  {...register('interest')}
                />
              </div>
              <TextArea label={t('companies.fields.message')} required rows={5} error={errors.message} {...register('message')} />
              <Checkbox label={t('companies.fields.consent')} error={errors.consent} {...register('consent')} />
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
