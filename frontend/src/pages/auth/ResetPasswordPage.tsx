import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';
import { z } from 'zod';
import { Button, ButtonLink } from '../../components/common/Button';
import { Alert, useErrorMessage } from '../../components/common/States';
import { TextField } from '../../components/forms/Field';
import { applyServerErrors, v } from '../../components/forms/formUtils';
import { usePageMeta } from '../../hooks/usePageMeta';
import { api } from '../../lib/api';
import { AuthCard } from './AuthCard';

const schema = z
  .object({ password: v.password(), confirmPassword: z.string() })
  .refine((d) => d.password === d.confirmPassword, { path: ['confirmPassword'], message: 'validation.passwordMatch' });
type FormValues = z.infer<typeof schema>;

/** Handles both password resets and first-time password setup from staff invitations. */
export function ResetPasswordPage() {
  const { t } = useTranslation('portal');
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const invite = params.get('invite') === '1';
  const errorMessage = useErrorMessage();
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const title = invite ? t('auth.inviteTitle') : t('auth.resetTitle');
  usePageMeta({ title, noIndex: true });

  const { register, handleSubmit, formState, setError } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { password: '', confirmPassword: '' } });

  const onSubmit = handleSubmit(async ({ password }) => {
    setFormError(null);
    try {
      await api.post('/auth/reset-password', { token, password });
      setDone(true);
    } catch (error) {
      if (!applyServerErrors(error, setError)) setFormError(errorMessage(error));
    }
  });

  return (
    <AuthCard
      title={title}
      footer={
        <Link to="/login" className="font-semibold text-royal-700 hover:underline">
          {t('auth.backToLogin')}
        </Link>
      }
    >
      {!token ? (
        <Alert kind="error">
          {t('auth.resetMissing')}{' '}
          <Link to="/forgot-password" className="font-semibold underline">
            {t('auth.forgotTitle')}
          </Link>
        </Alert>
      ) : done ? (
        <div className="space-y-5">
          <Alert kind="success">{t('auth.resetDone')}</Alert>
          <ButtonLink to="/login" variant="navy" className="auth-submit w-full">
            {t('auth.signIn')}
          </ButtonLink>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <TextField label={t('auth.newPassword')} type="password" autoComplete="new-password" required hint={t('common:validation.passwordMin')} error={formState.errors.password} {...register('password')} />
          <TextField label={t('auth.confirmPassword')} type="password" autoComplete="new-password" required error={formState.errors.confirmPassword} {...register('confirmPassword')} />
          {formError && <Alert kind="error">{formError}</Alert>}
          <Button type="submit" variant="navy" className="auth-submit w-full" loading={formState.isSubmitting}>
            {t('common:actions.save')}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
