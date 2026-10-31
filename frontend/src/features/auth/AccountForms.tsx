import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '../../components/common/Button';
import { useErrorMessage } from '../../components/common/States';
import { useToast } from '../../components/common/Toast';
import { SelectField, TextField } from '../../components/forms/Field';
import { applyServerErrors, v } from '../../components/forms/formUtils';
import { api, ApiError } from '../../lib/api';
import type { Me } from '../../types/api';
import { ME_QUERY_KEY, useAuth } from './AuthProvider';

const accountSchema = z.object({ fullName: v.text(120).min(2, 'validation.min:2'), phone: v.optionalPhone(), preferredLocale: z.enum(['en', 'bn']) });

export function AccountDetailsForm() {
  const { t, i18n } = useTranslation('portal');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const { register, handleSubmit, formState, setError } = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    values: { fullName: user?.fullName ?? '', phone: user?.phone ?? '', preferredLocale: user?.preferredLocale ?? 'en' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const me = await api.patch<Me>('/auth/me', { ...values, phone: values.phone || null });
      queryClient.setQueryData(ME_QUERY_KEY, me);
      if (values.preferredLocale !== i18n.language) void i18n.changeLanguage(values.preferredLocale);
      notify(t('student.saved'));
    } catch (error) {
      if (!applyServerErrors(error, setError)) notify(errorMessage(error), 'error');
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6">
      <h2 className="text-lg">{t('student.accountDetails')}</h2>
      <TextField label={t('auth.email')} value={user?.email ?? ''} readOnly disabled />
      <TextField label={t('auth.fullName')} required error={formState.errors.fullName} {...register('fullName')} />
      <TextField label={t('student.phone')} type="tel" error={formState.errors.phone} {...register('phone')} />
      <SelectField
        label={t('student.preferredLocale')}
        required
        options={[
          { value: 'en', label: 'English' },
          { value: 'bn', label: 'বাংলা' },
        ]}
        {...register('preferredLocale')}
      />
      <Button type="submit" loading={formState.isSubmitting}>
        {t('common:actions.save')}
      </Button>
    </form>
  );
}

const passwordSchema = z
  .object({ currentPassword: z.string().min(1, 'validation.required'), newPassword: v.password(), confirmPassword: z.string() })
  .refine((d) => d.newPassword === d.confirmPassword, { path: ['confirmPassword'], message: 'validation.passwordMatch' });

export function ChangePasswordForm() {
  const { t } = useTranslation('portal');
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const { register, handleSubmit, formState, setError, reset } = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async ({ currentPassword, newPassword }) => {
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      reset();
      notify(t('student.passwordChanged'));
    } catch (error) {
      if (error instanceof ApiError && error.code === 'INVALID_PASSWORD') setError('currentPassword', { message: error.message });
      else if (!applyServerErrors(error, setError)) notify(errorMessage(error), 'error');
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6">
      <h2 className="text-lg">{t('student.changePassword')}</h2>
      <TextField label={t('student.currentPassword')} type="password" autoComplete="current-password" required error={formState.errors.currentPassword} {...register('currentPassword')} />
      <TextField label={t('student.newPassword')} type="password" autoComplete="new-password" required hint={t('common:validation.passwordMin')} error={formState.errors.newPassword} {...register('newPassword')} />
      <TextField label={t('auth.confirmPassword')} type="password" autoComplete="new-password" required error={formState.errors.confirmPassword} {...register('confirmPassword')} />
      <Button type="submit" variant="secondary" loading={formState.isSubmitting}>
        {t('student.changePassword')}
      </Button>
    </form>
  );
}
