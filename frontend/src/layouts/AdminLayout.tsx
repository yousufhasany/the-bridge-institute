import { ExternalLink, LogOut, Menu, X } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { BridgeMark } from '../components/common/Logo';
import { Spinner } from '../components/common/States';
import { LanguageSwitcher } from '../components/navigation/LanguageSwitcher';
import { ADMIN_NAV } from '../features/admin/adminNav';
import { useAuth } from '../features/auth/AuthProvider';
import { usePageMeta } from '../hooks/usePageMeta';
import { cn } from '../lib/cn';
import { SkipLink } from './PublicLayout';

export function AdminLayout() {
  const { t } = useTranslation(['admin', 'common']);
  const { user, can, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  usePageMeta({ title: t('title'), noIndex: true });

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  const groups = ADMIN_NAV.map((g) => ({ ...g, items: g.items.filter((i) => can(...i.permissions)) })).filter((g) => g.items.length > 0);

  const sidebar = (
    <nav aria-label={t('title')} className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      {groups.map((group) => (
        <div key={group.key}>
          <p className="mb-2 px-3 text-[0.7rem] font-bold tracking-wider text-sky-50/60 uppercase">{t(`groups.${group.key}`)}</p>
          <ul className="space-y-0.5">
            {group.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/admin' || item.to === '/admin/alumni'}
                  className={({ isActive }) =>
                    cn('flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium', isActive ? 'bg-white/15 text-white' : 'text-sky-50/80 hover:bg-white/10 hover:text-white')
                  }
                >
                  <item.icon className="size-4 shrink-0" aria-hidden />
                  {t(`nav.${item.key}`)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-mist-50 lg:flex">
      <SkipLink />
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-navy-950 lg:flex">
        <Brand />
        {sidebar}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t('title')}>
          <button type="button" className="absolute inset-0 bg-navy-950/50" onClick={() => setOpen(false)} aria-label={t('common:nav.closeMenu')} />
          <aside className="relative flex h-full w-72 max-w-[85%] flex-col bg-navy-950">
            <div className="flex items-center justify-between pr-3">
              <Brand />
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-white hover:bg-white/10" aria-label={t('common:nav.closeMenu')}>
                <X className="size-5" aria-hidden />
              </button>
            </div>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-mist-200 bg-white px-4 py-3 sm:px-6">
          <button type="button" onClick={() => setOpen(true)} className="rounded-full p-2 text-navy-950 hover:bg-mist-50 lg:hidden" aria-label={t('common:nav.openMenu')}>
            <Menu className="size-5" aria-hidden />
          </button>
          <Link to="/" className="hidden items-center gap-1.5 text-sm font-semibold text-royal-700 hover:underline sm:inline-flex">
            {t('viewSite')}
            <ExternalLink className="size-3.5" aria-hidden />
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <LanguageSwitcher />
            <span className="hidden text-sm text-ink-500 md:inline">{user?.fullName}</span>
            <button
              type="button"
              onClick={() => {
                void logout().finally(() => navigate('/login', { replace: true }));
              }}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-navy-900 hover:bg-mist-50"
            >
              <LogOut className="size-4" aria-hidden />
              <span className="hidden sm:inline">{t('common:nav.logout')}</span>
            </button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} className="flex-1 px-4 py-6 focus:outline-none sm:px-6 lg:px-8">
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function Brand() {
  const { t } = useTranslation();
  return (
    <Link to="/admin" className="flex items-center gap-2.5 px-5 py-5 text-white">
      <BridgeMark className="w-9" />
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-bold">{t('brand.short')}</span>
        <span className="text-xs text-sky-50/70">{t('admin:title')}</span>
      </span>
    </Link>
  );
}
