import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '../../components/common/Button';
import { useErrorMessage } from '../../components/common/States';
import { useToast } from '../../components/common/Toast';
import { TextField } from '../../components/forms/Field';
import { v } from '../../components/forms/formUtils';
import { AccountDetailsForm, ChangePasswordForm } from '../../features/auth/AccountForms';
import { api } from '../../lib/api';
import { useStudentMe } from './StudentDashboardPage';

const schema = z.object({ educationLevel: v.optionalText(120), currentStatus: v.optionalText(120) });

export function StudentProfilePage() {
  const { t } = useTranslation('portal');
  const me = useStudentMe();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl">{t('student.profileTitle')}</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <AccountDetailsForm />
        <div className="space-y-6">
          {me.data && <StudentDetailsForm educationLevel={me.data.educationLevel} currentStatus={me.data.currentStatus} />}
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}

function StudentDetailsForm(props: { educationLevel: string | null; currentStatus: string | null }) {
  const { t } = useTranslation('portal');
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: { educationLevel: props.educationLevel ?? '', currentStatus: props.currentStatus ?? '' },
  });
  const onSubmit = handleSubmit(async (values) => {
    try {
      await api.patch('/students/me', { educationLevel: values.educationLevel || null, currentStatus: values.currentStatus || null });
      await queryClient.invalidateQueries({ queryKey: ['student', 'me'] });
      notify(t('student.saved'));
    } catch (error) {
      notify(errorMessage(error), 'error');
    }
  });
  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6">
      <h2 className="text-lg">{t('student.studentDetails')}</h2>
      <TextField label={t('student.educationLevel')} error={formState.errors.educationLevel} {...register('educationLevel')} />
      <TextField label={t('student.currentStatus')} error={formState.errors.currentStatus} {...register('currentStatus')} />
      <Button type="submit" loading={formState.isSubmitting}>
        {t('common:actions.save')}
      </Button>
    </form>
  );
}
