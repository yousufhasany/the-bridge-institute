/** Permission keys enforced by the API. Role-to-permission mappings live in the database. */
export const P = {
  dashboardView: 'dashboard.view',
  usersManage: 'users.manage',
  rolesManage: 'roles.manage',
  coursesManage: 'courses.manage',
  applicationsManage: 'applications.manage',
  studentsManage: 'students.manage',
  trainingManage: 'training.manage',
  trainingTeach: 'training.teach',
  certificatesManage: 'certificates.manage',
  companiesManage: 'companies.manage',
  contactManage: 'contact.manage',
  cmsEdit: 'cms.edit',
  cmsPublish: 'cms.publish',
  faqsManage: 'faqs.manage',
  settingsManage: 'settings.manage',
  auditRead: 'audit.read',
  alumniManage: 'alumni.manage',
  studentSelf: 'student.self',
  alumniSelf: 'alumni.self',
} as const;

export type PermissionKey = (typeof P)[keyof typeof P];
export const ALL_PERMISSIONS: PermissionKey[] = Object.values(P);

/** Roles that may never be self-selected or granted through public endpoints. */
export const PUBLIC_SAFE_ROLES = new Set(['STUDENT', 'ALUMNI']);
