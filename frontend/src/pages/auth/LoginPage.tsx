import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router';
import { z } from 'zod';
import { Button, ButtonLink } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';
import { Alert, useErrorMessage } from '../../components/common/States';
import { LanguageSwitcher } from '../../components/navigation/LanguageSwitcher';
import { TextField } from '../../components/forms/Field';
import { v } from '../../components/forms/formUtils';
import { homeFor, useAuth } from '../../features/auth/AuthProvider';
import { usePageMeta } from '../../hooks/usePageMeta';
import { ApiError } from '../../lib/api';
import { AuthScene } from './AuthScene';

const schema = z.object({ email: v.email(), password: z.string().min(1, 'validation.required').max(128) });
type FormValues = z.infer<typeof schema>;

function Login({ variant }: { variant: 'default' | 'alumni' }) {
  const { t } = useTranslation('portal');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage = useErrorMessage();
  const [formError, setFormError] = useState<string | null>(null);
  const from = (location.state as { from?: string } | null)?.from;
  const title = variant === 'alumni' ? t('auth.alumniLoginTitle') : t('auth.loginTitle');
  usePageMeta({ title, noIndex: true });

  const [boost, setBoost] = useState(false);
  const { register, handleSubmit, formState } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setFormError(null);
    try {
      const user = await login(email, password);
      // Only follow same-site relative paths to avoid open redirects.
      const safeFrom = from && from.startsWith('/') && !from.startsWith('//') ? from : null;
      navigate(safeFrom ?? (variant === 'alumni' ? '/alumni/dashboard' : homeFor(user)), { replace: true });
    } catch (error) {
      setFormError(error instanceof ApiError && error.status === 401 ? t('auth.invalid') : errorMessage(error));
    }
  });

  return (
    <div className="auth-sci relative min-h-svh overflow-hidden bg-[#050505] text-white">
      <AuthScene boost={boost} />
      <div className="auth-sci-panel relative z-10 flex min-h-svh flex-col px-5 py-6 sm:px-10 md:w-1/2 lg:px-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/" aria-label={t('common:brand.name')} className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
            <Logo tone="light" />
          </Link>
          <div className="flex items-center gap-2">
            <ButtonLink to="/" variant="light" size="sm" icon={<ArrowLeft className="size-4" aria-hidden />}>
              {t('auth.backToWebsite')}
            </ButtonLink>
            <LanguageSwitcher tone="light" />
          </div>
        </div>
        <div className="auth-sci-enter flex flex-1 flex-col justify-center py-10">
          <p className="text-xs font-semibold tracking-[0.22em] text-sky-300 uppercase">{t('common:brand.name')}</p>
          <h1 className="mt-4 text-4xl text-white sm:text-5xl">{title}</h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/70">{variant === 'alumni' ? t('auth.alumniLoginIntro') : t('auth.loginIntro')}</p>
          <form
            onSubmit={onSubmit}
            noValidate
            className="mt-8 max-w-md space-y-5"
            onMouseEnter={() => setBoost(true)}
            onMouseLeave={(event) => {
              if (!event.currentTarget.contains(document.activeElement)) setBoost(false);
            }}
            onFocus={() => setBoost(true)}
            onBlur={(event) => {
              const next = event.relatedTarget;
              if (!(next instanceof Node) || !event.currentTarget.contains(next)) setBoost(false);
            }}
          >
            {from && <Alert kind="info">{t('auth.sessionExpired')}</Alert>}
            <TextField
              label={t('auth.email')}
              type="email"
              autoComplete="email"
              required
              placeholder={t('auth.emailPlaceholder')}
              error={formState.errors.email}
              {...register('email')}
            />
            <TextField
              label={t('auth.password')}
              type="password"
              autoComplete="current-password"
              required
              placeholder={t('auth.passwordPlaceholder')}
              error={formState.errors.password}
              {...register('password')}
            />
            <p className="-mt-1 text-right text-sm">
              <Link to="/forgot-password">{t('auth.forgot')}</Link>
            </p>
            {formError && <Alert kind="error">{formError}</Alert>}
            <Button type="submit" variant="navy" className="auth-submit w-full" loading={formState.isSubmitting}>
              {formState.isSubmitting ? t('auth.signingIn') : t('auth.signIn')}
            </Button>
          </form>
          <div className="auth-sci-links mt-6 max-w-md text-sm text-white/70">
            {variant === 'alumni' ? (
              <>
                {t('auth.noAccount')}{' '}
                <Link to="/alumni/join">{t('alumni:public.join')}</Link>
              </>
            ) : (
              <>
                {t('auth.noAccount')} <Link to="/apply">{t('common:nav.apply')}</Link>
                <span className="mt-2 block">
                  <Link to="/alumni/login">{t('alumni:public.signIn')}</Link>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const LoginPage = () => <Login variant="default" />;
export const AlumniLoginPage = () => <Login variant="alumni" />;
