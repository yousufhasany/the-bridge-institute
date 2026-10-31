import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { BridgeMark, Logo } from '../../components/common/Logo';
import { LanguageSwitcher } from '../../components/navigation/LanguageSwitcher';
import { AuthMascot } from './AuthMascot';

function AuthVisual() {
  const { t } = useTranslation();
  const headline = t('why.subtitle', { ns: 'home' }).replace(/\. /g, '.\n').replace(/। /g, '।\n');

  return (
    <div className="relative isolate min-h-52 overflow-hidden bg-[#8ec8ef] sm:min-h-64 lg:min-h-full">
      <AuthMascot />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
      <div className="relative flex h-full min-h-52 flex-col justify-end p-6 sm:min-h-64 sm:p-8 lg:min-h-[36rem] lg:p-10">
        <p className="text-sm font-bold tracking-[0.18em] text-orange-400 uppercase">{t('brand.name')}</p>
        <p className="mt-3 max-w-sm text-3xl font-extrabold tracking-tight whitespace-pre-line text-white uppercase sm:text-4xl">{headline}</p>
      </div>
    </div>
  );
}

export function AuthCard({ title, intro, children, footer }: { title: string; intro?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="auth-screen relative isolate flex min-h-svh flex-col overflow-hidden px-4 py-6 sm:px-6 sm:py-10">
      <div aria-hidden className="auth-sky pointer-events-none absolute inset-0" />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between gap-3">
        <Link to="/" aria-label={t('brand.name')} className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-600">
          <span className="sm:hidden">
            <Logo compact />
          </span>
          <span className="hidden sm:inline-flex">
            <Logo />
          </span>
        </Link>
        <LanguageSwitcher />
      </div>
      <div className="auth-card relative z-10 mx-auto mt-6 grid w-full max-w-5xl flex-1 overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_80px_rgb(9_43_76/0.16)] lg:mt-8 lg:min-h-[36rem] lg:grid-cols-2 lg:flex-none">
        <AuthVisual />
        <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12">
          <span className="grid size-12 place-items-center rounded-xl bg-navy-950">
            <BridgeMark className="w-8" />
          </span>
          <h1 className="mt-6 text-3xl tracking-[0.08em] uppercase sm:text-4xl">{title}</h1>
          {intro && <p className="mt-2 text-sm text-ink-500">{intro}</p>}
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
