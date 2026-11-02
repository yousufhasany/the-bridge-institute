import { QueryClientProvider } from '@tanstack/react-query';
import { lazy, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastProvider } from './components/common/Toast';
import { AuthProvider, homeFor, useAuth } from './features/auth/AuthProvider';
import { AdminLayout } from './layouts/AdminLayout';
import { PortalLayout } from './layouts/PortalLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { GuestOnly, RequireAuth } from './layouts/RouteGuards';
import { STAFF_FORGOT_PASSWORD_PATH, STAFF_LOGIN_PATH } from './lib/authPaths';
import { queryClient } from './lib/queryClient';
import { HomePage } from './pages/public/HomePage';

/** Lazy-loads a named export so each page module stays code-split. */
function page<M extends Record<string, unknown>>(loader: () => Promise<M>, name: keyof M) {
  return lazy(async () => ({ default: (await loader())[name] as ComponentType }));
}

const CoursesPage = page(() => import('./pages/public/CoursesPage'), 'CoursesPage');
const CourseDetailPage = page(() => import('./pages/public/CourseDetailPage'), 'CourseDetailPage');
const LearningJourneyPage = page(() => import('./pages/public/LearningJourneyPage'), 'LearningJourneyPage');
const AboutPage = page(() => import('./pages/public/AboutPage'), 'AboutPage');
const CompaniesPage = page(() => import('./pages/public/CompaniesPage'), 'CompaniesPage');
const IndustryPartnersPage = page(() => import('./pages/public/IndustryPartnersPage'), 'IndustryPartnersPage');
const ApplyPage = page(() => import('./pages/public/ApplyPage'), 'ApplyPage');
const ContactPage = page(() => import('./pages/public/ContactPage'), 'ContactPage');
const AlumniPage = page(() => import('./pages/public/AlumniPage'), 'AlumniPage');
const AlumniProfilePage = page(() => import('./pages/public/AlumniProfilePage'), 'AlumniProfilePage');
const AlumniStoryPage = page(() => import('./pages/public/AlumniStoryPage'), 'AlumniStoryPage');
const PrivacyPage = page(() => import('./pages/public/PolicyPage'), 'PrivacyPage');
const TermsPage = page(() => import('./pages/public/PolicyPage'), 'TermsPage');
const NotFoundPage = page(() => import('./pages/public/NotFoundPage'), 'NotFoundPage');

const LoginPage = page(() => import('./pages/auth/LoginPage'), 'LoginPage');
const ForgotPasswordPage = page(() => import('./pages/auth/ForgotPasswordPage'), 'ForgotPasswordPage');
const ResetPasswordPage = page(() => import('./pages/auth/ResetPasswordPage'), 'ResetPasswordPage');

const StudentDashboardPage = page(() => import('./pages/student/StudentDashboardPage'), 'StudentDashboardPage');
const StudentApplicationsPage = page(() => import('./pages/student/StudentApplicationsPage'), 'StudentApplicationsPage');
const StudentProfilePage = page(() => import('./pages/student/StudentProfilePage'), 'StudentProfilePage');

const AlumniDashboardPage = page(() => import('./pages/alumni/AlumniDashboardPage'), 'AlumniDashboardPage');
const AlumniRequestPage = page(() => import('./pages/alumni/AlumniJoinPage'), 'AlumniJoinPage');
const AlumniEditProfilePage = page(() => import('./pages/alumni/AlumniEditProfilePage'), 'AlumniEditProfilePage');
const AlumniMyStoriesPage = page(() => import('./pages/alumni/AlumniMyStoriesPage'), 'AlumniMyStoriesPage');
const AlumniOpportunitiesPage = page(() => import('./pages/alumni/AlumniOpportunitiesPage'), 'AlumniOpportunitiesPage');

const admin = {
  Dashboard: page(() => import('./pages/admin/DashboardPage'), 'DashboardPage'),
  Users: page(() => import('./pages/admin/UsersPage'), 'UsersPage'),
  Roles: page(() => import('./pages/admin/RolesPage'), 'RolesPage'),
  Courses: page(() => import('./pages/admin/CoursesAdminPage'), 'CoursesAdminPage'),
  Categories: page(() => import('./pages/admin/resourcePages'), 'CategoriesPage'),
  Applications: page(() => import('./pages/admin/ApplicationsAdminPage'), 'ApplicationsAdminPage'),
  Students: page(() => import('./pages/admin/StudentsAdminPage'), 'StudentsAdminPage'),
  Batches: page(() => import('./pages/admin/BatchesPage'), 'BatchesPage'),
  Enrollments: page(() => import('./pages/admin/EnrollmentsPage'), 'EnrollmentsPage'),
  Attendance: page(() => import('./pages/admin/AttendancePage'), 'AttendancePage'),
  Assessments: page(() => import('./pages/admin/AssessmentsPage'), 'AssessmentsPage'),
  Results: page(() => import('./pages/admin/ResultsPage'), 'ResultsPage'),
  Certificates: page(() => import('./pages/admin/CertificatesPage'), 'CertificatesPage'),
  Companies: page(() => import('./pages/admin/resourcePages'), 'CompaniesAdminPage'),
  Inquiries: page(() => import('./pages/admin/InquiriesPage'), 'InquiriesPage'),
  Opportunities: page(() => import('./pages/admin/resourcePages'), 'OpportunitiesPage'),
  Messages: page(() => import('./pages/admin/MessagesPage'), 'MessagesPage'),
  Content: page(() => import('./pages/admin/WebsiteContentPage'), 'WebsiteContentPage'),
  Faqs: page(() => import('./pages/admin/resourcePages'), 'FaqsPage'),
  Settings: page(() => import('./pages/admin/SettingsPage'), 'SettingsPage'),
  Audit: page(() => import('./pages/admin/AuditLogsPage'), 'AuditLogsPage'),
  AlumniOverview: page(() => import('./pages/admin/alumni/AlumniOverviewPage'), 'AlumniOverviewPage'),
  AlumniRegistrations: page(() => import('./pages/admin/alumni/AlumniRegistrationsPage'), 'AlumniRegistrationsPage'),
  AlumniProfiles: page(() => import('./pages/admin/alumni/AlumniProfilesPage'), 'AlumniProfilesPage'),
  AlumniStories: page(() => import('./pages/admin/alumni/AlumniStoriesPage'), 'AlumniStoriesPage'),
  Cohorts: page(() => import('./pages/admin/resourcePages'), 'CohortsPage'),
  Announcements: page(() => import('./pages/admin/resourcePages'), 'AnnouncementsPage'),
};

function StudentPortal() {
  const { t } = useTranslation('portal');
  return (
    <RequireAuth>
      <PortalLayout
        title={t('student.title')}
        nav={[
          { to: '/student/dashboard', label: t('student.nav.dashboard') },
          { to: '/student/applications', label: t('student.nav.applications') },
          { to: '/student/profile', label: t('student.nav.profile') },
        ]}
      />
    </RequireAuth>
  );
}

function AlumniPortal() {
  const { t } = useTranslation('alumni');
  return (
    <RequireAuth loginPath={STAFF_LOGIN_PATH}>
      <PortalLayout
        title={t('portal.title')}
        nav={[
          { to: '/alumni/dashboard', label: t('portal.nav.dashboard') },
          { to: '/alumni/profile', label: t('portal.nav.profile') },
          { to: '/alumni/stories', label: t('portal.nav.stories') },
          { to: '/alumni/opportunities', label: t('portal.nav.opportunities') },
        ]}
      />
    </RequireAuth>
  );
}

const can = (...permissions: string[]) => (Element: ComponentType) => (
  <RequireAuth permissions={permissions}>
    <Element />
  </RequireAuth>
);
const training = can('training.manage', 'training.teach');

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:slug" element={<CourseDetailPage />} />
        <Route path="industry-partners" element={<IndustryPartnersPage />} />
        <Route path="learning-journey" element={<LearningJourneyPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="apply" element={<ApplyPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="alumni" element={<AlumniPage />} />
        <Route path="alumni/join" element={<Navigate to="/contact" replace />} />
        <Route path="alumni/story/:slug" element={<AlumniStoryPage />} />
        <Route path="alumni/:slug" element={<AlumniProfilePage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="login" element={<Navigate to={STAFF_LOGIN_PATH} replace />} />
        <Route path="alumni/login" element={<Navigate to={STAFF_LOGIN_PATH} replace />} />
        <Route path="forgot-password" element={<Navigate to={STAFF_FORGOT_PASSWORD_PATH} replace />} />
        <Route
          path="staff/login"
          element={
            <GuestOnly to="/account">
              <LoginPage />
            </GuestOnly>
          }
        />
        <Route path="staff/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="account" element={<AccountRedirect />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="student" element={<StudentPortal />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboardPage />} />
        <Route path="applications" element={<StudentApplicationsPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
      </Route>

      <Route element={<AlumniPortal />}>
        <Route path="alumni/dashboard" element={<AlumniDashboardPage />} />
        <Route path="alumni/request" element={<AlumniRequestPage />} />
        <Route path="alumni/profile" element={<AlumniEditProfilePage />} />
        <Route path="alumni/stories" element={<AlumniMyStoriesPage />} />
        <Route path="alumni/opportunities" element={<AlumniOpportunitiesPage />} />
      </Route>

      <Route
        path="admin"
        element={
          <RequireAuth permissions={['dashboard.view']}>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<admin.Dashboard />} />
        <Route path="users" element={can('users.manage')(admin.Users)} />
        <Route path="roles" element={can('roles.manage')(admin.Roles)} />
        <Route path="courses" element={can('courses.manage')(admin.Courses)} />
        <Route path="course-categories" element={can('courses.manage')(admin.Categories)} />
        <Route path="applications" element={can('applications.manage')(admin.Applications)} />
        <Route path="students" element={can('students.manage', 'training.manage')(admin.Students)} />
        <Route path="batches" element={training(admin.Batches)} />
        <Route path="enrollments" element={training(admin.Enrollments)} />
        <Route path="attendance" element={training(admin.Attendance)} />
        <Route path="assessments" element={training(admin.Assessments)} />
        <Route path="results" element={training(admin.Results)} />
        <Route path="certificates" element={can('certificates.manage')(admin.Certificates)} />
        <Route path="companies" element={can('companies.manage')(admin.Companies)} />
        <Route path="partnership-inquiries" element={can('companies.manage')(admin.Inquiries)} />
        <Route path="opportunities" element={can('companies.manage')(admin.Opportunities)} />
        <Route path="contact-messages" element={can('contact.manage')(admin.Messages)} />
        <Route path="website-content" element={can('cms.edit', 'cms.publish')(admin.Content)} />
        <Route path="faqs" element={can('faqs.manage')(admin.Faqs)} />
        <Route path="settings" element={can('settings.manage')(admin.Settings)} />
        <Route path="audit-logs" element={can('audit.read')(admin.Audit)} />
        <Route path="alumni" element={can('alumni.manage')(admin.AlumniOverview)} />
        <Route path="alumni/registrations" element={can('alumni.manage')(admin.AlumniRegistrations)} />
        <Route path="alumni/profiles" element={can('alumni.manage')(admin.AlumniProfiles)} />
        <Route path="alumni/stories" element={can('alumni.manage')(admin.AlumniStories)} />
        <Route path="alumni/cohorts" element={can('alumni.manage')(admin.Cohorts)} />
        <Route path="alumni/announcements" element={can('alumni.manage')(admin.Announcements)} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

function AccountRedirect() {
  return (
    <RequireAuth>
      <AccountTarget />
    </RequireAuth>
  );
}

function AccountTarget() {
  const { user } = useAuth();
  return <Navigate to={homeFor(user)} replace />;
}

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
