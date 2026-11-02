import { LayoutDashboard, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation } from 'react-router';
import { homeFor, useAuth } from '../../features/auth/AuthProvider';
import { STAFF_LOGIN_PATH } from '../../lib/authPaths';
import { cn } from '../../lib/cn';
import { Logo } from '../common/Logo';
import { LanguageSwitcher } from './LanguageSwitcher';

const quietAction =
  'inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold whitespace-nowrap text-navy-950 ring-1 ring-inset ring-mist-200 transition-colors hover:bg-mist-50';
const applyAction =
  'inline-flex h-10 items-center justify-center rounded-full bg-orange-500 px-4 text-sm font-semibold whitespace-nowrap text-navy-950 shadow-[0_1px_1px_rgb(9_43_76/0.06),0_8px_16px_-8px_rgb(247_148_29)] transition-colors hover:bg-orange-400';

export const PUBLIC_NAV = [
  { to: '/', key: 'home', end: true },
  { to: '/courses', key: 'courses' },
  { to: '/industry-partners', key: 'industryPartners' },
  { to: '/learning-journey', key: 'learningJourney' },
  { to: '/alumni', key: 'alumni' },
  { to: '/companies', key: 'companies' },
  { to: '/about', key: 'about' },
  { to: '/contact', key: 'contact' },
] as const;

export function Header() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    menuRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const accountTo = user ? homeFor(user) : null;
  const accountLabel = t('nav.dashboard');

  return (
    <header className="sticky top-0 z-40 border-b border-mist-200/80 bg-white/95 shadow-[0_10px_30px_-24px_rgb(9_43_76/0.65)] backdrop-blur-md">
      <div className="mx-auto flex h-18 w-full max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8 xl:px-5 2xl:px-8">
        <Link to="/" className="shrink-0 rounded-lg" aria-label={t('brand.name')}>
          <Logo />
        </Link>

        <nav aria-label={t('nav.primary')} className="header-nav hidden min-w-0 flex-1 justify-center xl:flex">
          <ul className="flex items-center">
            {PUBLIC_NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={'end' in item}
                  className={({ isActive }) =>
                    cn(
                      'relative inline-flex h-10 items-center rounded-full px-2.5 text-sm font-semibold whitespace-nowrap transition-colors 2xl:px-3.5',
                      isActive ? 'text-navy-950' : 'text-ink-700 hover:bg-mist-50 hover:text-navy-950',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {t(`nav.${item.key}`)}
                      <span
                        aria-hidden
                        className={cn(
                          'pointer-events-none absolute inset-x-2.5 bottom-1.5 h-0.5 rounded-full bg-orange-500 2xl:inset-x-3.5',
                          isActive ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions ml-auto hidden shrink-0 items-center gap-2 xl:flex">
          <LanguageSwitcher />
          <span aria-hidden className="mx-0.5 h-5 w-px bg-mist-200" />
          {accountTo ? (
            <Link to={accountTo} className={cn(quietAction, 'header-account')} aria-label={accountLabel}>
              <LayoutDashboard className="size-4" aria-hidden />
              <span className="header-account-label">{accountLabel}</span>
            </Link>
          ) : (
            <Link to={STAFF_LOGIN_PATH} className={quietAction}>
              {t('nav.login')}
            </Link>
          )}
          <Link to="/apply" className={applyAction}>
            {t('nav.apply')}
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2 xl:hidden">
          <span className="hidden sm:contents">
            <Link to="/apply" className={applyAction}>
              {t('nav.apply')}
            </Link>
          </span>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid size-11 place-items-center rounded-full text-navy-950 ring-1 ring-inset ring-mist-200 transition-colors hover:bg-mist-50"
          >
            <span className="sr-only">{open ? t('nav.closeMenu') : t('nav.openMenu')}</span>
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" ref={menuRef} className="border-t border-mist-200 bg-white xl:hidden">
          <nav aria-label={t('nav.primary')} className="container-page py-4">
            <ul className="grid gap-1">
              {PUBLIC_NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={'end' in item}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-2xl px-4 py-3 text-base font-semibold transition-colors',
                        isActive ? 'bg-sky-50 text-navy-950 shadow-[inset_3px_0_0_#f7941d]' : 'text-navy-900 hover:bg-mist-50',
                      )
                    }
                  >
                    {t(`nav.${item.key}`)}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-mist-50 p-3 ring-1 ring-mist-200 sm:flex-row sm:items-center">
              <LanguageSwitcher className="self-start" />
              <div className="flex flex-wrap gap-2 sm:ml-auto">
                {accountTo ? (
                  <Link to={accountTo} className={quietAction}>
                    {accountLabel}
                  </Link>
                ) : (
                  <Link to={STAFF_LOGIN_PATH} className={quietAction}>
                    {t('nav.login')}
                  </Link>
                )}
                <Link to="/apply" className={applyAction}>
                  {t('nav.apply')}
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
