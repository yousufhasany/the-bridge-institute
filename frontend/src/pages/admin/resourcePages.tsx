import { useTranslation } from 'react-i18next';
import { Badge, StatusBadge } from '../../components/common/Badge';
import { ResourcePage } from '../../components/dashboard/ResourcePage';
import { useCompanyOptions, useCourseOptions } from '../../features/admin/lookups';
import { formatDate } from '../../lib/format';

const useStatusOptions = (values: string[]) => {
  const { t } = useTranslation('admin');
  return values.map((v) => ({ value: v, label: t(`status.${v}`) }));
};

interface Category {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string | null;
  sortOrder: number;
  _count: { courses: number };
}

export function CategoriesPage() {
  const { t } = useTranslation('admin');
  return (
    <ResourcePage<Category>
      title={t('categories.title')}
      endpoint="/course-categories"
      sort="sortOrder"
      order="asc"
      columns={[
        { key: 'name', header: t('fields.nameEn'), cell: (r) => <span className="font-semibold text-navy-950">{r.nameEn}</span> },
        { key: 'bn', header: t('fields.nameBn'), cell: (r) => <span lang="bn">{r.nameBn ?? '—'}</span> },
        { key: 'slug', header: t('fields.slug'), cell: (r) => <code className="text-xs">{r.slug}</code> },
        { key: 'courses', header: t('nav.courses'), cell: (r) => r._count.courses },
      ]}
      fields={[
        { name: 'nameEn', label: t('fields.nameEn'), required: true },
        { name: 'nameBn', label: t('fields.nameBn'), lang: 'bn' },
        { name: 'slug', label: t('fields.slug'), required: true, hint: 'lowercase-with-hyphens' },
        { name: 'sortOrder', label: t('fields.sortOrder'), type: 'number' },
      ]}
    />
  );
}

interface Company {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
  contactName: string | null;
  contactEmail: string | null;
  phone: string | null;
  notes: string | null;
  status: string;
  listedPublicly: boolean;
  _count: { opportunities: number; inquiries: number };
}

export function CompaniesAdminPage() {
  const { t } = useTranslation('admin');
  const statuses = useStatusOptions(['PROSPECT', 'ACTIVE', 'INACTIVE']);
  return (
    <ResourcePage<Company>
      title={t('companies.title')}
      description={t('companies.note')}
      endpoint="/companies"
      sort="name"
      order="asc"
      filters={[{ name: 'status', label: t('common.status'), options: statuses }]}
      columns={[
        { key: 'name', header: t('common.name'), cell: (r) => <span className="font-semibold text-navy-950">{r.name}</span> },
        { key: 'industry', header: t('fields.industry'), cell: (r) => r.industry ?? '—' },
        { key: 'contact', header: t('fields.contactName'), cell: (r) => [r.contactName, r.contactEmail].filter(Boolean).join(' · ') || '—' },
        { key: 'status', header: t('common.status'), cell: (r) => <StatusBadge status={r.status} label={t(`status.${r.status}`)} /> },
        {
          key: 'listed',
          header: t('companies.listedShort'),
          cell: (r) => (r.listedPublicly && r.status === 'ACTIVE' ? <Badge tone="green">{t('companies.onSite')}</Badge> : '—'),
        },
        { key: 'opps', header: t('nav.opportunities'), cell: (r) => r._count.opportunities },
      ]}
      fields={[
        { name: 'name', label: t('common.name'), required: true },
        { name: 'industry', label: t('fields.industry') },
        { name: 'website', label: t('fields.website'), type: 'url' },
        { name: 'status', label: t('common.status'), type: 'select', required: true, options: statuses },
        { name: 'listedPublicly', label: t('companies.listed'), type: 'checkbox', hint: t('companies.listedHint'), full: true },
        { name: 'contactName', label: t('fields.contactName') },
        { name: 'contactEmail', label: t('fields.contactEmail'), type: 'email' },
        { name: 'phone', label: t('fields.phone') },
        { name: 'notes', label: t('fields.notes'), type: 'textarea', full: true },
      ]}
    />
  );
}

interface Opportunity {
  id: string;
  title: string;
  type: string;
  description: string;
  location: string | null;
  applyUrl: string | null;
  deadline: string | null;
  audience: string;
  status: string;
  companyId: string | null;
  company: { id: string; name: string } | null;
}

export function OpportunitiesPage() {
  const { t } = useTranslation('admin');
  const companies = useCompanyOptions();
  const statuses = useStatusOptions(['DRAFT', 'PUBLISHED', 'CLOSED']);
  const types = ['INTERNSHIP', 'JOB', 'TRAINING', 'PROJECT', 'MENTORING', 'OTHER'].map((v) => ({ value: v, label: t(`fields.opportunityTypes.${v}`) }));
  const audiences = ['STUDENTS', 'ALUMNI', 'ALL'].map((v) => ({ value: v, label: t(`fields.audiences.${v}`) }));
  return (
    <ResourcePage<Opportunity>
      title={t('opportunities.title')}
      endpoint="/opportunities"
      filters={[
        { name: 'status', label: t('common.status'), options: statuses },
        { name: 'audience', label: t('fields.audience'), options: audiences },
      ]}
      columns={[
        { key: 'title', header: t('fields.title'), cell: (r) => <span className="font-semibold text-navy-950">{r.title}</span> },
        { key: 'type', header: t('fields.type'), cell: (r) => <Badge tone="blue">{t(`fields.opportunityTypes.${r.type}`)}</Badge> },
        { key: 'company', header: t('fields.company'), cell: (r) => r.company?.name ?? '—' },
        { key: 'audience', header: t('fields.audience'), cell: (r) => t(`fields.audiences.${r.audience}`) },
        { key: 'deadline', header: t('fields.deadline'), cell: (r) => formatDate(r.deadline) },
        { key: 'status', header: t('common.status'), cell: (r) => <StatusBadge status={r.status} label={t(`status.${r.status}`)} /> },
      ]}
      fields={[
        { name: 'title', label: t('fields.title'), required: true, full: true },
        { name: 'type', label: t('fields.type'), type: 'select', required: true, options: types },
        { name: 'companyId', label: t('fields.company'), type: 'select', options: companies.data ?? [] },
        { name: 'audience', label: t('fields.audience'), type: 'select', required: true, options: audiences },
        { name: 'status', label: t('common.status'), type: 'select', required: true, options: statuses },
        { name: 'location', label: t('fields.location') },
        { name: 'deadline', label: t('fields.deadline'), type: 'date' },
        { name: 'applyUrl', label: t('fields.applyUrl'), type: 'url', full: true },
        { name: 'description', label: t('fields.description'), type: 'textarea', required: true, full: true },
      ]}
    />
  );
}

interface Faq {
  id: string;
  questionEn: string;
  questionBn: string | null;
  answerEn: string;
  answerBn: string | null;
  category: string;
  sortOrder: number;
  isPublished: boolean;
}

export function FaqsPage() {
  const { t } = useTranslation('admin');
  return (
    <ResourcePage<Faq>
      title={t('faqs.title')}
      endpoint="/faqs/admin"
      sort="sortOrder"
      order="asc"
      columns={[
        { key: 'q', header: t('fields.questionEn'), cell: (r) => <span className="font-semibold text-navy-950">{r.questionEn}</span> },
        { key: 'bn', header: t('common.bangla'), cell: (r) => (r.questionBn ? t('common.yes') : t('common.no')) },
        { key: 'category', header: t('fields.category'), cell: (r) => r.category },
        { key: 'published', header: t('common.status'), cell: (r) => <StatusBadge status={r.isPublished ? 'PUBLISHED' : 'DRAFT'} label={t(`status.${r.isPublished ? 'PUBLISHED' : 'DRAFT'}`)} /> },
      ]}
      fields={[
        { name: 'questionEn', label: t('fields.questionEn'), required: true, full: true },
        { name: 'answerEn', label: t('fields.answerEn'), type: 'textarea', required: true, full: true },
        { name: 'questionBn', label: t('fields.questionBn'), lang: 'bn', full: true },
        { name: 'answerBn', label: t('fields.answerBn'), type: 'textarea', lang: 'bn', full: true },
        { name: 'category', label: t('fields.category'), required: true, hint: 'general, admission, courses…' },
        { name: 'sortOrder', label: t('fields.sortOrder'), type: 'number' },
        { name: 'isPublished', label: t('fields.isPublished'), type: 'checkbox' },
      ]}
    />
  );
}

interface Cohort {
  id: string;
  slug: string;
  name: string;
  graduationYear: number | null;
  courseId: string | null;
  description: string | null;
  _count: { profiles: number };
}

export function CohortsPage() {
  const { t } = useTranslation('admin');
  const courses = useCourseOptions();
  return (
    <ResourcePage<Cohort>
      title={t('alumni.cohortsTitle')}
      endpoint="/admin/alumni/cohorts"
      sort="name"
      order="asc"
      columns={[
        { key: 'name', header: t('common.name'), cell: (r) => <span className="font-semibold text-navy-950">{r.name}</span> },
        { key: 'year', header: t('fields.graduationYear'), cell: (r) => r.graduationYear ?? '—' },
        { key: 'slug', header: t('fields.slug'), cell: (r) => <code className="text-xs">{r.slug}</code> },
        { key: 'profiles', header: t('nav.profiles'), cell: (r) => r._count.profiles },
      ]}
      fields={[
        { name: 'name', label: t('common.name'), required: true },
        { name: 'slug', label: t('fields.slug'), required: true, hint: 'lowercase-with-hyphens' },
        { name: 'graduationYear', label: t('fields.graduationYear'), type: 'number' },
        { name: 'courseId', label: t('fields.course'), type: 'select', options: courses.data ?? [] },
        { name: 'description', label: t('fields.description'), type: 'textarea', full: true },
      ]}
    />
  );
}

interface Announcement {
  id: string;
  titleEn: string;
  titleBn: string | null;
  bodyEn: string;
  bodyBn: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
}

export function AnnouncementsPage() {
  const { t } = useTranslation('admin');
  const statuses = useStatusOptions(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
  return (
    <ResourcePage<Announcement>
      title={t('alumni.announcementsTitle')}
      endpoint="/admin/alumni/announcements"
      filters={[{ name: 'status', label: t('common.status'), options: statuses }]}
      columns={[
        { key: 'title', header: t('fields.titleEn'), cell: (r) => <span className="font-semibold text-navy-950">{r.titleEn}</span> },
        { key: 'status', header: t('common.status'), cell: (r) => <StatusBadge status={r.status} label={t(`status.${r.status}`)} /> },
        { key: 'published', header: t('status.PUBLISHED'), cell: (r) => formatDate(r.publishedAt) },
      ]}
      fields={[
        { name: 'titleEn', label: t('fields.titleEn'), required: true, full: true },
        { name: 'bodyEn', label: t('fields.bodyEn'), type: 'textarea', required: true, full: true },
        { name: 'titleBn', label: t('fields.titleBn'), lang: 'bn', full: true },
        { name: 'bodyBn', label: t('fields.bodyBn'), type: 'textarea', lang: 'bn', full: true },
        { name: 'status', label: t('common.status'), type: 'select', required: true, options: statuses },
      ]}
    />
  );
}
