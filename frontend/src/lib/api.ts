const configuredBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') ?? '';

declare const __ON_VERCEL__: boolean;

function isLoopback(url: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(url);
}

/**
 * Local dev talks to the Express port. On Vercel, public `/api` is rewritten
 * to the backend service, including when a project build leaves DEV set.
 * A localhost value left in `VITE_API_BASE_URL` is ignored there so the
 * browser does not try to call the visitor's own computer.
 */
export const API_BASE_URL =
  import.meta.env.DEV && !__ON_VERCEL__
    ? configuredBase || 'http://localhost:5000/api/v1'
    : configuredBase && !isLoopback(configuredBase)
      ? configuredBase
      : '/api/v1';

export interface PageMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface FieldIssue {
  path: string;
  message: string;
  code?: string;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: FieldIssue[],
    public readonly requestId?: string,
  ) {
    super(message);
  }
}

type Query = Record<string, string | number | boolean | undefined | null>;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Query;
  signal?: AbortSignal;
}

let csrfToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

/** Paths where 401 means "wrong credentials", not "the current session has ended". */
const AUTH_ATTEMPT_PATHS = new Set(['/auth/login', '/auth/register']);

/** The app registers this so an expired session leaves protected pages instead of showing a raw error. */
export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

async function getCsrfToken() {
  if (csrfToken) return csrfToken;
  const res = await fetch(`${API_BASE_URL}/auth/csrf`, { credentials: 'include' });
  if (!res.ok) throw new ApiError(res.status, 'CSRF_UNAVAILABLE', 'Could not reach the server');
  csrfToken = ((await res.json()) as { data: { csrfToken: string } }).data.csrfToken;
  return csrfToken;
}

function buildUrl(path: string, query?: Query) {
  const raw = `${API_BASE_URL}${path}`;
  const base = typeof window === 'undefined' ? 'http://localhost' : window.location.origin;
  const url = new URL(raw, base);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/** Low-level request returning the full `{ data, meta }` envelope. Sends cookies and CSRF tokens. */
export async function request<T>(path: string, options: RequestOptions = {}, retry = true): Promise<{ data: T; meta?: PageMeta }> {
  const method = options.method ?? 'GET';
  const headers: Record<string, string> = { Accept: 'application/json' };
  const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (options.body !== undefined && !isForm) headers['Content-Type'] = 'application/json';
  if (method !== 'GET') headers['X-CSRF-Token'] = await getCsrfToken();

  let res: Response;
  try {
    res = await fetch(buildUrl(path, options.query), {
      method,
      headers,
      credentials: 'include',
      signal: options.signal,
      body: options.body === undefined ? undefined : isForm ? (options.body as FormData) : JSON.stringify(options.body),
    });
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error;
    throw new ApiError(0, 'NETWORK_ERROR', 'Unable to reach the server. Please check your connection and try again.');
  }

  if (res.status === 204) return { data: undefined as T };
  const json = (await res.json().catch(() => null)) as
    | { data: T; meta?: PageMeta; error?: { code: string; message: string; details?: FieldIssue[]; requestId?: string } }
    | null;

  if (!res.ok || !json || json.error) {
    const err = json?.error;
    if (res.status === 403 && err?.code === 'CSRF_INVALID' && retry) {
      csrfToken = null;
      return request<T>(path, options, false);
    }
    if (res.status === 401 && !AUTH_ATTEMPT_PATHS.has(path)) unauthorizedHandler?.();
    throw new ApiError(res.status, err?.code ?? 'HTTP_ERROR', err?.message ?? 'Request failed', err?.details, err?.requestId);
  }
  return json;
}

export const api = {
  get: async <T>(path: string, query?: Query, signal?: AbortSignal) => (await request<T>(path, { query, signal })).data,
  list: <T>(path: string, query?: Query) => request<T[]>(path, { query }),
  post: async <T>(path: string, body?: unknown) => (await request<T>(path, { method: 'POST', body: body ?? {} })).data,
  put: async <T>(path: string, body?: unknown) => (await request<T>(path, { method: 'PUT', body: body ?? {} })).data,
  patch: async <T>(path: string, body?: unknown) => (await request<T>(path, { method: 'PATCH', body: body ?? {} })).data,
  delete: async (path: string) => {
    await request<void>(path, { method: 'DELETE' });
  },
  resetCsrf: () => {
    csrfToken = null;
  },
};
