import { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router';
import { Spinner } from '../components/common/States';
import { Footer } from '../components/navigation/Footer';
import { Header } from '../components/navigation/Header';

export function SkipLink() {
  const { t } = useTranslation();
  return (
    <a
      href="#main-content"
      className="sr-only z-50 rounded-full bg-orange-500 px-4 py-2 font-semibold text-navy-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      {t('nav.skipToContent')}
    </a>
  );
}

export function useScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
}

const AUTH_PATHS = new Set(['/staff/login', '/staff/forgot-password', '/reset-password', '/login', '/alumni/login', '/forgot-password']);

export function PublicLayout() {
  useScrollToTop();
  const { pathname } = useLocation();
  const isAuth = AUTH_PATHS.has(pathname);
  return (
    <div className={isAuth ? 'min-h-svh' : 'flex min-h-screen flex-col'}>
      <SkipLink />
      {!isAuth && <Header />}
      <main id="main-content" tabIndex={-1} className={isAuth ? 'min-h-svh focus:outline-none' : 'flex-1 focus:outline-none'}>
        <Suspense fallback={<Spinner className="min-h-[50vh]" />}>
          <Outlet />
        </Suspense>
      </main>
      {!isAuth && <Footer />}
    </div>
  );
}
