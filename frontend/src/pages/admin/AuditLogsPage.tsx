import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { AdminHeader, DataTable, DetailList, FilterSelect, SearchBox, Toolbar } from '../../components/dashboard/AdminUi';
import { useAdminList } from '../../features/admin/useAdminList';
import { formatDateTime } from '../../lib/format';

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: unknown;
  ipAddress: string | null;
  createdAt: string;
  actor: { fullName: string; email: string } | null;
}

const ENTITY_TYPES = [
  'User',
  'Role',
  'Course',
  'CourseCategory',
  'LearningMaterial',
  'StudentApplication',
  'StudentProfile',
  'TrainingBatch',
  'Enrollment',
  'Assessment',
  'Certificate',
  'Company',
  'PartnershipInquiry',
  'Opportunity',
  'ContactMessage',
  'WebsiteSection',
  'WebsiteSetting',
  'Faq',
  'MediaAsset',
  'AlumniRegistrationRequest',
  'AlumniProfile',
  'AlumniStory',
  'AlumniCohort',
  'AlumniAnnouncement',
];

export function AuditLogsPage() {
  const { t } = useTranslation('admin');
  const list = useAdminList<AuditLog>('/audit-logs', { pageSize: 50 });
  const [open, setOpen] = useState<AuditLog | null>(null);

  return (
    <div>
      <AdminHeader title={t('audit.title')} description={t('audit.description')} />
      <Toolbar>
        <SearchBox onSearch={list.setSearch} />
        <FilterSelect label={t('fields.entity')} value={list.params.filters.entityType ?? ''} onChange={(v) => list.setFilter('entityType', v)} options={ENTITY_TYPES.map((e) => ({ value: e, label: e }))} />
      </Toolbar>
      <DataTable
        rows={list.rows}
        isLoading={list.isLoading}
        error={list.error}
        onRetry={() => void list.refetch()}
        meta={list.meta}
        onPage={list.setPage}
        columns={[
          { key: 'when', header: t('fields.date'), cell: (r) => <span className="whitespace-nowrap">{formatDateTime(r.createdAt)}</span> },
          { key: 'actor', header: t('fields.actor'), cell: (r) => r.actor?.fullName ?? <span className="text-ink-500">{t('audit.system')}</span> },
          { key: 'action', header: t('fields.action'), cell: (r) => <code className="text-xs">{r.action}</code> },
          { key: 'entity', header: t('fields.entity'), cell: (r) => <Badge tone="gray">{r.entityType}</Badge> },
          {
            key: 'details',
            header: <span className="sr-only">{t('common.actions')}</span>,
            className: 'text-right',
            cell: (r) => (
              <Button size="sm" variant="ghost" onClick={() => setOpen(r)}>
                {t('common.view')}
              </Button>
            ),
          },
        ]}
      />
      {open && (
        <Modal open onClose={() => setOpen(null)} title={open.action} size="lg">
          <DetailList
            items={[
              { label: t('fields.date'), value: formatDateTime(open.createdAt) },
              { label: t('fields.actor'), value: open.actor ? `${open.actor.fullName} (${open.actor.email})` : t('audit.system') },
              { label: t('fields.entity'), value: open.entityType },
              { label: t('audit.entityId'), value: open.entityId ? <code className="text-xs break-all">{open.entityId}</code> : '—' },
              { label: t('fields.ip'), value: open.ipAddress },
            ]}
          />
          {open.metadata != null && (
            <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-mist-50 p-4 text-xs">{JSON.stringify(open.metadata, null, 2)}</pre>
          )}
        </Modal>
      )}
    </div>
  );
}
