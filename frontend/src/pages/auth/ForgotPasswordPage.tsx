import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { z } from 'zod';
import { Button } from '../../components/common/Button';
import { Alert, useErrorMessage } from '../../components/common/States';
import { TextField } from '../../components/forms/Field';
import { v } from '../../components/forms/formUtils';
import { usePageMeta } from '../../hooks/usePageMeta';
import { api } from '../../lib/api';
import { STAFF_LOGIN_PATH } from '../../lib/authPaths';
import { AuthCard } from './AuthCard';

const schema = z.object({ email: v.email() });

export function ForgotPasswordPage() {
  const { t } = useTranslation('portal');
  const errorMessage = useErrorMessage();
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  usePageMeta({ title: t('auth.forgotTitle'), noIndex: true });
  const { register, handleSubmit, formState } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: '' } });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await api.post('/auth/forgot-password', values);
      setSent(true);
    } catch (error) {
      setFormError(errorMessage(error));
    }
  });

  return (
    <AuthCard
      title={t('auth.forgotTitle')}
      intro={t('auth.forgotIntro')}
      footer={
        <Link to={STAFF_LOGIN_PATH} className="font-semibold text-royal-700 hover:underline">
          {t('auth.backToLogin')}
        </Link>
      }
    >
      {sent ? (
        <Alert kind="success">{t('auth.forgotSent')}</Alert>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <TextField label={t('auth.email')} type="email" autoComplete="email" required error={formState.errors.email} {...register('email')} />
          {formError && <Alert kind="error">{formError}</Alert>}
          <Button type="submit" variant="navy" className="auth-submit w-full" loading={formState.isSubmitting}>
            {t('auth.sendLink')}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
