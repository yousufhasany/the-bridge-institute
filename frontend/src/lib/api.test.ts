import { beforeEach, describe, expect, it, vi } from 'vitest';
import { applyServerErrors } from '../components/forms/formUtils';
import { mockApi } from '../test/render';
import { api, ApiError, setUnauthorizedHandler } from './api';

describe('api client', () => {
  beforeEach(() => {
    api.resetCsrf();
    setUnauthorizedHandler(null);
  });

  it('sends cookies and a CSRF token with state-changing requests', async () => {
    const fetchMock = mockApi((url) => {
      if (url.pathname.endsWith('/auth/csrf')) return { body: { data: { csrfToken: 'token-1' } } };
      if (url.pathname.endsWith('/contact')) return { status: 201, body: { data: { id: 'm1' } } };
    });
    await expect(api.post('/contact', { name: 'A' })).resolves.toEqual({ id: 'm1' });
    const [, init] = fetchMock.mock.calls.at(-1)!;
    expect(init?.credentials).toBe('include');
    expect((init?.headers as Record<string, string>)['X-CSRF-Token']).toBe('token-1');
  });

  it('refreshes the CSRF token once when the server rejects it', async () => {
    let issued = 0;
    let attempts = 0;
    mockApi((url) => {
      if (url.pathname.endsWith('/auth/csrf')) return { body: { data: { csrfToken: `token-${++issued}` } } };
      attempts++;
      return attempts === 1 ? { status: 403, body: { error: { code: 'CSRF_INVALID', message: 'Invalid' } } } : { body: { data: { ok: true } } };
    });
    await expect(api.post('/auth/logout')).resolves.toEqual({ ok: true });
    expect(issued).toBe(2);
  });

  it('does not attach a CSRF token to reads and builds query strings without empty values', async () => {
    const fetchMock = mockApi(() => ({ body: { data: [] } }));
    await api.get('/courses', { locale: 'bn', q: '', page: 2 });
    const [input, init] = fetchMock.mock.calls[0];
    expect(String(input)).toMatch(/\/courses\?locale=bn&page=2$/);
    expect((init?.headers as Record<string, string>)['X-CSRF-Token']).toBeUndefined();
  });

  it('throws typed errors with validation details that map onto form fields', async () => {
    mockApi((url) =>
      url.pathname.endsWith('/auth/csrf')
        ? { body: { data: { csrfToken: 't' } } }
        : { status: 422, body: { error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: [{ path: 'email', message: 'Invalid email address' }] } } },
    );
    const error = await api.post('/applications', {}).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(422);

    const calls: [string, { message?: string }][] = [];
    expect(applyServerErrors(error, ((name: string, value: { message?: string }) => calls.push([name, value])) as never)).toBe(true);
    expect(calls).toEqual([['email', { type: 'server', message: 'Invalid email address' }]]);
  });

  it('ends the local session on 401, except when sign-in itself is rejected', async () => {
    const onUnauthorized = vi.fn();
    setUnauthorizedHandler(onUnauthorized);
    mockApi((url) =>
      url.pathname.endsWith('/auth/csrf')
        ? { body: { data: { csrfToken: 't' } } }
        : { status: 401, body: { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } } },
    );
    await expect(api.get('/admin/dashboard')).rejects.toMatchObject({ status: 401 });
    await expect(api.post('/auth/login', { email: 'a@b.c', password: 'x' })).rejects.toMatchObject({ status: 401 });
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
    setUnauthorizedHandler(null);
  });

  it('reports network failures in plain language', async () => {
    mockApi(() => {
      throw new TypeError('Failed to fetch');
    });
    await expect(api.get('/courses')).rejects.toMatchObject({ code: 'NETWORK_ERROR', status: 0 });
  });
});
