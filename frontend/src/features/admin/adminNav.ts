import {
  Award,
  BookOpen,
  Building2,
  CalendarCheck,
  ClipboardCheck,
  ClipboardList,
  FileText,
  FolderTree,
  GraduationCap,
  Handshake,
  HelpCircle,
  Inbox,
  LayoutDashboard,
  ListChecks,
  Mail,
  Megaphone,
  Newspaper,
  ScrollText,
  Settings,
  Shield,
  Sparkles,
  UserCheck,
  Users,
  UsersRound,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';

export interface AdminNavItem {
  to: string;
  key: string;
  icon: LucideIcon;
  /** Any one of these permissions grants access. */
  permissions: string[];
}

export interface AdminNavGroup {
  key: string;
  items: AdminNavItem[];
}

const training = ['training.manage', 'training.teach'];

export const ADMIN_NAV: AdminNavGroup[] = [
  { key: 'overview', items: [{ to: '/admin', key: 'dashboard', icon: LayoutDashboard, permissions: ['dashboard.view'] }] },
  {
    key: 'admissions',
    items: [
      { to: '/admin/applications', key: 'applications', icon: ClipboardList, permissions: ['applications.manage'] },
      { to: '/admin/students', key: 'students', icon: GraduationCap, permissions: ['students.manage', 'training.manage'] },
    ],
  },
  {
    key: 'training',
    items: [
      { to: '/admin/batches', key: 'batches', icon: UsersRound, permissions: training },
      { to: '/admin/enrollments', key: 'enrollments', icon: UserCheck, permissions: training },
      { to: '/admin/attendance', key: 'attendance', icon: CalendarCheck, permissions: training },
      { to: '/admin/assessments', key: 'assessments', icon: ClipboardCheck, permissions: training },
      { to: '/admin/results', key: 'results', icon: ListChecks, permissions: training },
      { to: '/admin/certificates', key: 'certificates', icon: Award, permissions: ['certificates.manage'] },
    ],
  },
  {
    key: 'courses',
    items: [
      { to: '/admin/courses', key: 'courses', icon: BookOpen, permissions: ['courses.manage'] },
      { to: '/admin/course-categories', key: 'categories', icon: FolderTree, permissions: ['courses.manage'] },
    ],
  },
  {
    key: 'industry',
    items: [
      { to: '/admin/companies', key: 'companies', icon: Building2, permissions: ['companies.manage'] },
      { to: '/admin/partnership-inquiries', key: 'inquiries', icon: Handshake, permissions: ['companies.manage'] },
      { to: '/admin/opportunities', key: 'opportunities', icon: Briefcase, permissions: ['companies.manage'] },
    ],
  },
  {
    key: 'alumni',
    items: [
      { to: '/admin/alumni', key: 'alumniOverview', icon: Sparkles, permissions: ['alumni.manage'] },
      { to: '/admin/alumni/registrations', key: 'registrations', icon: Inbox, permissions: ['alumni.manage'] },
      { to: '/admin/alumni/profiles', key: 'profiles', icon: Users, permissions: ['alumni.manage'] },
      { to: '/admin/alumni/stories', key: 'stories', icon: Newspaper, permissions: ['alumni.manage'] },
      { to: '/admin/alumni/cohorts', key: 'cohorts', icon: UsersRound, permissions: ['alumni.manage'] },
      { to: '/admin/alumni/announcements', key: 'announcements', icon: Megaphone, permissions: ['alumni.manage'] },
    ],
  },
  {
    key: 'website',
    items: [
      { to: '/admin/website-content', key: 'content', icon: FileText, permissions: ['cms.edit', 'cms.publish'] },
      { to: '/admin/faqs', key: 'faqs', icon: HelpCircle, permissions: ['faqs.manage'] },
      { to: '/admin/contact-messages', key: 'messages', icon: Mail, permissions: ['contact.manage'] },
      { to: '/admin/settings', key: 'settings', icon: Settings, permissions: ['settings.manage'] },
    ],
  },
  {
    key: 'system',
    items: [
      { to: '/admin/users', key: 'users', icon: Users, permissions: ['users.manage'] },
      { to: '/admin/roles', key: 'roles', icon: Shield, permissions: ['roles.manage'] },
      { to: '/admin/audit-logs', key: 'audit', icon: ScrollText, permissions: ['audit.read'] },
    ],
  },
];
