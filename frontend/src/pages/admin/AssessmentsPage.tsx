import { useTranslation } from 'react-i18next';
import { ResourcePage } from '../../components/dashboard/ResourcePage';
import { useBatchOptions } from '../../features/admin/lookups';
import { formatDate } from '../../lib/format';

interface Assessment {
  id: string;
  batchId: string;
  title: string;
  type: string;
  maxScore: number;
  dueDate: string | null;
  batch: { id: string; code: string; name: string };
  _count: { results: number };
}

export function AssessmentsPage() {
  const { t } = useTranslation('admin');
  const batches = useBatchOptions();
  const types = ['assignment', 'quiz', 'exam', 'project', 'practical'].map((v) => ({ value: v, label: t(`fields.assessmentTypes.${v}`) }));
  return (
    <ResourcePage<Assessment>
      title={t('assessments.title')}
      endpoint="/assessments"
      searchable={false}
      filters={[{ name: 'batchId', label: t('fields.batch'), options: batches.data ?? [] }]}
      columns={[
        { key: 'title', header: t('fields.title'), cell: (r) => <span className="font-semibold text-navy-950">{r.title}</span> },
        { key: 'batch', header: t('fields.batch'), cell: (r) => r.batch.code },
        { key: 'type', header: t('fields.type'), cell: (r) => t(`fields.assessmentTypes.${r.type}`, { defaultValue: r.type }) },
        { key: 'max', header: t('fields.maxScore'), cell: (r) => r.maxScore },
        { key: 'due', header: t('fields.dueDate'), cell: (r) => formatDate(r.dueDate) },
        { key: 'results', header: t('nav.results'), cell: (r) => r._count.results },
      ]}
      fields={[
        { name: 'batchId', label: t('fields.batch'), type: 'select', required: true, options: batches.data ?? [], createOnly: true },
        { name: 'title', label: t('fields.title'), required: true },
        { name: 'type', label: t('fields.type'), type: 'select', required: true, options: types },
        { name: 'maxScore', label: t('fields.maxScore'), type: 'number', required: true },
        { name: 'dueDate', label: t('fields.dueDate'), type: 'date' },
      ]}
    />
  );
}
