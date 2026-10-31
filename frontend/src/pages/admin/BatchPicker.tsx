import { useTranslation } from 'react-i18next';
import { SelectField } from '../../components/forms/Field';
import { useBatchOptions } from '../../features/admin/lookups';

export function BatchPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const { t } = useTranslation('admin');
  const batches = useBatchOptions();
  return (
    <SelectField
      label={t('fields.batch')}
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t('enrollments.selectBatch')}
      options={batches.data ?? []}
      wrapperClassName="max-w-md"
    />
  );
}

export interface StudentSummary {
  id: string;
  studentCode: string;
  user: { fullName: string; email: string };
}

export const studentLabel = (s: StudentSummary) => `${s.user.fullName} · ${s.studentCode}`;
