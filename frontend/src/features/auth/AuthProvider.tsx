import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, setUnauthorizedHandler } from '../../lib/api';
import type { Me } from '../../types/api';

interface AuthContextValue {
  user: Me | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<Me>;
  logout: () => Promise<void>;
  refresh: () => Promise<unknown>;
  can: (...permissions: string[]) => boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);
export const ME_QUERY_KEY = ['auth', 'me'] as const;

const STAFF_PERMISSIONS = ['dashboard.view'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const me = useQuery({ queryKey: ME_QUERY_KEY, queryFn: () => api.get<Me | null>('/auth/me'), staleTime: 5 * 60_000 });
  // React state, not only the query cache: cache updates notify on a timer, and
  // clearing the cache first leaves the header showing the previous user.
  const [signedOut, setSignedOut] = useState(false);
  const user = signedOut ? null : (me.data ?? null);

  const loginMutation = useMutation({
    mutationFn: (input: { email: string; password: string }) => api.post<Me>('/auth/login', input),
    onSuccess: (next) => {
      setSignedOut(false);
      queryClient.setQueryData(ME_QUERY_KEY, next);
    },
  });

  useEffect(() => {
    if (signedOut && me.data == null) setSignedOut(false);
  }, [signedOut, me.data]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setSignedOut(true);
      queryClient.setQueryData(ME_QUERY_KEY, null);
    });
    return () => setUnauthorizedHandler(null);
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(() => {
    const permissions = new Set(user?.permissions ?? []);
    return {
      user,
      isLoading: me.isLoading && !signedOut,
      login: (email, password) => loginMutation.mutateAsync({ email, password }),
      logout: async () => {
        try {
          await api.post('/auth/logout');
        } finally {
          api.resetCsrf();
          await queryClient.cancelQueries();
          setSignedOut(true);
          queryClient.setQueryData(ME_QUERY_KEY, null);
          queryClient.removeQueries({
            predicate: (query) => query.queryKey[0] !== 'auth' || query.queryKey[1] !== 'me',
          });
        }
      },
      refresh: () => queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY }),
      can: (...required) => required.some((p) => permissions.has(p)),
      isStaff: STAFF_PERMISSIONS.some((p) => permissions.has(p)),
    };
  }, [user, signedOut, me.isLoading, loginMutation, queryClient]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

/** Where a signed-in user should land by default. */
export function homeFor(user: Me | null) {
  if (!user) return '/login';
  if (user.permissions.includes('dashboard.view')) return '/admin';
  if (user.permissions.includes('alumni.self') || user.latestAlumniRequest) return '/alumni/dashboard';
  return '/student/dashboard';
}
