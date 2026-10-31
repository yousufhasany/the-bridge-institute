import { LogOut } from 'lucide-react';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { Logo } from '../components/common/Logo';
import { Spinner } from '../components/common/States';
import { LanguageSwitcher } from '../components/navigation/LanguageSwitcher';
import { useAuth } from '../features/auth/AuthProvider';
import { usePageMeta } from '../hooks/usePageMeta';
import { cn } from '../lib/cn';
import { SkipLink, useScrollToTop } from './PublicLayout';

export interface PortalNavItem {
  to: string;
  label: string;
  end?: boolean;
}

/** Shared shell for the student and alumni portals. */
export function PortalLayout({ nav, title }: { nav: PortalNavItem[]; title: string }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  useScrollToTop();
  usePageMeta({ title, noIndex: true });

  return (
    <div className="flex min-h-screen flex-col bg-mist-50">
      <SkipLink />
      <header className="border-b border-mist-200 bg-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
          <Link to="/" className="rounded-lg" aria-label={t('brand.name')}>
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <span className="hidden text-sm text-ink-500 md:inline">{user?.fullName}</span>
            <button
              type="button"
              onClick={() => {
                void logout().finally(() => navigate('/', { replace: true }));
              }}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-navy-900 hover:bg-mist-50"
            >
              <LogOut className="size-4" aria-hidden />
              {t('nav.logout')}
            </button>
          </div>
        </div>
        <nav aria-label={title} className="container-page">
          <ul className="-mb-px flex gap-1 overflow-x-auto">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'inline-block border-b-2 px-3 py-3 text-sm font-semibold whitespace-nowrap',
                      isActive ? 'border-orange-500 text-navy-950' : 'border-transparent text-ink-500 hover:text-navy-950',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1} className="container-page flex-1 py-8 focus:outline-none sm:py-10">
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
