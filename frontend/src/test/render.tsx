import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';

type Responder = (url: URL, init?: RequestInit) => { status?: number; body?: unknown } | undefined;

/** Replaces `fetch` with a router of canned API responses. Unmatched requests return 404. */
export function mockApi(responder: Responder) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url);
    const result = responder(url, init) ?? { status: 404, body: { error: { code: 'NOT_FOUND', message: 'Not found' } } };
    const status = result.status ?? 200;
    return new Response(status === 204 ? null : JSON.stringify(result.body ?? {}), { status, headers: { 'Content-Type': 'application/json' } });
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

export function renderWithProviders(ui: ReactElement, { route = '/' }: { route?: string } = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}
