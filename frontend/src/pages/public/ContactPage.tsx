import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '../../components/common/Button';
import { QrLinks } from '../../components/common/QrLinks';
import { photos } from '../../assets/photos';
import { PageHeader, Section } from '../../components/common/Section';
import { Alert, useErrorMessage } from '../../components/common/States';
import { SelectField, TextArea, TextField } from '../../components/forms/Field';
import { applyServerErrors, v } from '../../components/forms/formUtils';
import { BROCHURE_EMAIL, useSetting } from '../../features/cms/useSiteContent';
import { usePageMeta } from '../../hooks/usePageMeta';
import { api } from '../../lib/api';

const CATEGORIES = ['general', 'admission', 'partnership'] as const;

const schema = z.object({
  name: v.text(120).min(2, 'validation.min:2'),
  email: v.email(),
  category: z.enum(CATEGORIES),
  subject: v.text(200).min(2, 'validation.min:2'),
  message: z.string().trim().min(10, 'validation.min:10').max(5000, 'validation.max:5000'),
});
type FormValues = z.input<typeof schema>;

export function ContactPage() {
  const { t } = useTranslation('pages');
  const errorMessage = useErrorMessage();
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const general = useSetting('contact.generalEmail', BROCHURE_EMAIL);
  const admission = useSetting('contact.admissionEmail');
  const partnership = useSetting('contact.partnershipEmail');
  const phone = useSetting('contact.phone');
  const address = useSetting('contact.address');
  usePageMeta({ title: t('contact.metaTitle'), description: t('contact.metaDescription') });

  const { register, handleSubmit, formState, setError, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', category: 'general', subject: '', message: '' },
  });
  const errors = formState.errors;

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await api.post('/contact', values);
      setSent(true);
      reset();
    } catch (error) {
      if (!applyServerErrors(error, setError)) setFormError(errorMessage(error));
    }
  });

  const emails = [
    { label: t('contact.general'), value: general },
    { label: t('contact.admission'), value: admission },
    { label: t('contact.partnership'), value: partnership },
  ].filter((e) => e.value);

  return (
    <>
      <PageHeader title={t('contact.title')} subtitle={t('contact.intro')} image={photos.contact} />
      <Section tone="mist">
        <div className="grid gap-10 lg:grid-cols-[22rem_1fr]">
          <aside className="space-y-4">
            <h2 className="text-xl">{t('contact.detailsTitle')}</h2>
            {emails.map((e) => (
              <div key={e.label} className="card flex gap-3 p-4">
                <Mail className="mt-0.5 size-5 shrink-0 text-royal-600" aria-hidden />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy-950">{e.label}</p>
                  <a href={`mailto:${e.value}`} className="text-sm break-all text-royal-700 hover:underline">
                    {e.value}
                  </a>
                </div>
              </div>
            ))}
            {phone && (
              <div className="card flex gap-3 p-4">
                <Phone className="mt-0.5 size-5 shrink-0 text-royal-600" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-navy-950">{t('contact.phone')}</p>
                  <a href={`tel:${phone.replace(/[^+0-9]/g, '')}`} className="text-sm text-royal-700 hover:underline">
                    {phone}
                  </a>
                </div>
              </div>
            )}
            {address && (
              <div className="card flex gap-3 p-4">
                <MapPin className="mt-0.5 size-5 shrink-0 text-royal-600" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-navy-950">{t('contact.address')}</p>
                  <p className="text-sm whitespace-pre-line">{address}</p>
                </div>
              </div>
            )}
          </aside>

          {sent ? (
            <div className="card flex flex-col items-center justify-center gap-4 p-10 text-center" role="status">
              <CheckCircle2 className="size-12 text-emerald-600" aria-hidden />
              <p className="text-lg font-semibold text-navy-950">{t('contact.success')}</p>
              <Button variant="outline" onClick={() => setSent(false)}>
                {t('common:actions.back')}
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label={t('contact.fields.name')} required autoComplete="name" error={errors.name} {...register('name')} />
                <TextField label={t('contact.fields.email')} required type="email" autoComplete="email" error={errors.email} {...register('email')} />
                <SelectField
                  label={t('contact.fields.category')}
                  required
                  options={CATEGORIES.map((c) => ({ value: c, label: t(`contact.categories.${c}`) }))}
                  error={errors.category}
                  {...register('category')}
                />
                <TextField label={t('contact.fields.subject')} required error={errors.subject} {...register('subject')} />
              </div>
              <TextArea label={t('contact.fields.message')} required rows={6} error={errors.message} {...register('message')} />
              {formError && <Alert kind="error">{formError}</Alert>}
              <Button type="submit" size="lg" loading={formState.isSubmitting}>
                {formState.isSubmitting ? t('common:actions.submitting') : t('common:actions.submit')}
              </Button>
            </form>
          )}
        </div>
        <div className="mt-12">
          <QrLinks tone="dark" />
        </div>
      </Section>
    </>
  );
}
