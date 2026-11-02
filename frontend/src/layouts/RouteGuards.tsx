import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation } from 'react-router';
import { Spinner } from '../components/common/States';
import { useAuth } from '../features/auth/AuthProvider';
import { STAFF_LOGIN_PATH } from '../lib/authPaths';

/** Requires a signed-in user; optionally one holding any of `permissions`. The API enforces the same rules. */
export function RequireAuth({ children, permissions, loginPath = STAFF_LOGIN_PATH }: { children: ReactNode; permissions?: string[]; loginPath?: string }) {
  const { user, isLoading, can } = useAuth();
  const location = useLocation();
  const { t } = useTranslation('admin');

  if (isLoading) return <Spinner className="min-h-[50vh]" />;
  if (!user) return <Navigate to={loginPath} replace state={{ from: location.pathname + location.search }} />;
  if (permissions && !can(...permissions)) {
    return (
      <div className="container-page py-20 text-center">
        <p role="alert" className="text-lg font-semibold text-navy-950">
          {t('noAccess')}
        </p>
      </div>
    );
  }
  return <>{children}</>;
}

/** Sends signed-in users away from sign-in screens. */
export function GuestOnly({ children, to }: { children: ReactNode; to: string }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Spinner className="min-h-[50vh]" />;
  if (user) return <Navigate to={to} replace />;
  return <>{children}</>;
}
