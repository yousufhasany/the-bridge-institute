import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Translation } from 'react-i18next';

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <Translation>
        {(t) => (
          <div role="alert" className="flex min-h-screen flex-col items-center justify-center gap-4 bg-mist-50 px-6 text-center">
            <h1 className="text-2xl">{t('errorBoundary.title')}</h1>
            <p className="max-w-md text-ink-500">{t('errorBoundary.body')}</p>
            <button type="button" onClick={() => window.location.reload()} className="rounded-full bg-orange-500 px-5 py-2.5 font-semibold text-navy-950 hover:bg-orange-400">
              {t('errorBoundary.reload')}
            </button>
          </div>
        )}
      </Translation>
    );
  }
}
