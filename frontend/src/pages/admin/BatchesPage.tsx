import { useQueryClient } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState, Spinner, useErrorMessage } from '../../components/common/States';
import { useToast } from '../../components/common/Toast';
import { ResourcePage } from '../../components/dashboard/ResourcePage';
import { useCourseOptions, useTeachers } from '../../features/admin/lookups';
import { useAuth } from '../../features/auth/AuthProvider';
import { api } from '../../lib/api';
import { formatDate } from '../../lib/format';

interface Batch {
  id: string;
  code: string;
  name: string;
  courseId: string | null;
  startDate: string | null;
  endDate: string | null;
  capacity: number | null;
  status: string;
  course: { id: string; slug: string; translations: { title: string }[] } | null;
  teachers: { user: { id: string; fullName: string } }[];
  _count: { enrollments: number };
}

export function BatchesPage() {
  const { t } = useTranslation('admin');
  const { can } = useAuth();
  const manage = can('training.manage');
  const courses = useCourseOptions(manage);
  const [assigning, setAssigning] = useState<Batch | null>(null);
  const statuses = ['PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((s) => ({ value: s, label: t(`status.${s}`) }));

  return (
    <>
      <ResourcePage<Batch>
        title={t('batches.title')}
        endpoint="/batches"
        canCreate={manage}
        canEdit={manage}
        canDelete={manage}
        filters={[{ name: 'status', label: t('common.status'), options: statuses }]}
        rowActions={(row) =>
          manage && (
            <Button size="sm" variant="ghost" onClick={() => setAssigning(row)} icon={<Users className="size-4" aria-hidden />}>
              {t('fields.teachers')}
            </Button>
          )
        }
        columns={[
          {
            key: 'code',
            header: t('fields.code'),
            cell: (r) => (
              <>
                <span className="font-semibold text-navy-950">{r.code}</span>
                <span className="block text-xs text-ink-500">{r.name}</span>
              </>
            ),
          },
          { key: 'course', header: t('fields.course'), cell: (r) => r.course?.translations[0]?.title ?? '—' },
          { key: 'dates', header: t('fields.startDate'), cell: (r) => `${formatDate(r.startDate)} – ${formatDate(r.endDate)}` },
          { key: 'enr', header: t('fields.enrollments'), cell: (r) => `${r._count.enrollments}${r.capacity ? ` / ${r.capacity}` : ''}` },
          { key: 'teachers', header: t('fields.teachers'), cell: (r) => r.teachers.map((x) => x.user.fullName).join(', ') || '—' },
          { key: 'status', header: t('common.status'), cell: (r) => <StatusBadge status={r.status} label={t(`status.${r.status}`)} /> },
        ]}
        fields={[
          { name: 'code', label: t('fields.code'), required: true, hint: 'e.g. CT-2027-A' },
          { name: 'name', label: t('fields.name'), required: true },
          { name: 'courseId', label: t('fields.course'), type: 'select', options: courses.data ?? [] },
          { name: 'status', label: t('common.status'), type: 'select', required: true, options: statuses },
          { name: 'startDate', label: t('fields.startDate'), type: 'date' },
          { name: 'endDate', label: t('fields.endDate'), type: 'date' },
          { name: 'capacity', label: t('fields.capacity'), type: 'number' },
        ]}
      />
      {assigning && <TeachersModal batch={assigning} onClose={() => setAssigning(null)} />}
    </>
  );
}

function TeachersModal({ batch, onClose }: { batch: Batch; onClose: () => void }) {
  const { t } = useTranslation('admin');
  const teachers = useTeachers();
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const [selected, setSelected] = useState(() => new Set(batch.teachers.map((x) => x.user.id)));
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await api.put(`/batches/${batch.id}/teachers`, { userIds: [...selected] });
      await queryClient.invalidateQueries({ queryKey: ['admin'] });
      notify(t('batches.teachersSaved'));
      onClose();
    } catch (error) {
      notify(errorMessage(error), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`${t('batches.assignTeachers')} · ${batch.code}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={() => void save()} loading={busy}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      {teachers.isLoading ? (
        <Spinner />
      ) : !teachers.data?.length ? (
        <EmptyState title={t('batches.noTeachers')} />
      ) : (
        <fieldset className="space-y-2">
          <legend className="sr-only">{t('fields.teachers')}</legend>
          {teachers.data.map((u) => (
            <label key={u.id} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-mist-50">
              <input
                type="checkbox"
                className="size-4"
                checked={selected.has(u.id)}
                onChange={(e) =>
                  setSelected((s) => {
                    const next = new Set(s);
                    if (e.target.checked) next.add(u.id);
                    else next.delete(u.id);
                    return next;
                  })
                }
              />
              <span>
                <span className="font-semibold text-navy-950">{u.fullName}</span>
                <span className="block text-xs text-ink-500">{u.email}</span>
              </span>
            </label>
          ))}
        </fieldset>
      )}
    </Modal>
  );
}
