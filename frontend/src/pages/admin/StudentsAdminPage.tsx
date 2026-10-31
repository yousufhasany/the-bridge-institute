import { useTranslation } from 'react-i18next';
import { StatusBadge } from '../../components/common/Badge';
import { ResourcePage } from '../../components/dashboard/ResourcePage';
import { useAuth } from '../../features/auth/AuthProvider';
import { formatDate } from '../../lib/format';

interface Student {
  id: string;
  studentCode: string;
  status: string;
  educationLevel: string | null;
  currentStatus: string | null;
  createdAt: string;
  user: { id: string; fullName: string; email: string; phone: string | null };
  _count: { enrollments: number };
}

export function StudentsAdminPage() {
  const { t } = useTranslation('admin');
  const { can } = useAuth();
  const statuses = ['ACTIVE', 'INACTIVE', 'GRADUATED', 'WITHDRAWN'].map((s) => ({ value: s, label: t(`status.${s}`) }));
  return (
    <ResourcePage<Student>
      title={t('students.title')}
      endpoint="/students"
      canCreate={false}
      canDelete={false}
      canEdit={can('students.manage')}
      filters={[{ name: 'status', label: t('common.status'), options: statuses }]}
      columns={[
        { key: 'code', header: t('fields.studentCode'), cell: (r) => <span className="font-mono text-xs">{r.studentCode}</span> },
        {
          key: 'name',
          header: t('common.name'),
          cell: (r) => (
            <>
              <span className="font-semibold text-navy-950">{r.user.fullName}</span>
              <span className="block text-xs text-ink-500">{r.user.email}</span>
            </>
          ),
        },
        { key: 'edu', header: t('fields.educationLevel'), cell: (r) => r.educationLevel ?? '—' },
        { key: 'enr', header: t('fields.enrollments'), cell: (r) => r._count.enrollments },
        { key: 'created', header: t('common.created'), cell: (r) => formatDate(r.createdAt) },
        { key: 'status', header: t('common.status'), cell: (r) => <StatusBadge status={r.status} label={t(`status.${r.status}`)} /> },
      ]}
      fields={[
        { name: 'status', label: t('common.status'), type: 'select', required: true, options: statuses },
        { name: 'educationLevel', label: t('fields.educationLevel') },
        { name: 'currentStatus', label: t('fields.currentStatus'), full: true },
      ]}
    />
  );
}
