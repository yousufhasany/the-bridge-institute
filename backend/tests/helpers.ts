import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { createApp } from '../src/http-app.js';
import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/services/auth.service.js';

export const app = createApp();
export const API = '/api/v1';
export const PASSWORD = 'Test-password-123';

/** A cookie-persisting client that has fetched a CSRF token. */
export async function client() {
  const agent = request.agent(app);
  const res = await agent.get(`${API}/auth/csrf`).expect(200);
  const csrf: string = res.body.data.csrfToken;
  const withCsrf = (r: request.Test) => r.set('X-CSRF-Token', csrf);
  return {
    agent,
    csrf,
    get: (path: string) => agent.get(`${API}${path}`),
    post: (path: string, body?: object) => withCsrf(agent.post(`${API}${path}`)).send(body ?? {}),
    put: (path: string, body?: object) => withCsrf(agent.put(`${API}${path}`)).send(body ?? {}),
    patch: (path: string, body?: object) => withCsrf(agent.patch(`${API}${path}`)).send(body ?? {}),
    delete: (path: string) => withCsrf(agent.delete(`${API}${path}`)),
  };
}

export type Client = Awaited<ReturnType<typeof client>>;

let passwordHash: string | undefined;

export async function createUser(roleKeys: string[] = [], overrides: { email?: string; fullName?: string } = {}) {
  passwordHash ??= await hashPassword(PASSWORD);
  const email = overrides.email ?? `user-${randomUUID().slice(0, 8)}@test.example`;
  const roles = await prisma.role.findMany({ where: { key: { in: roleKeys } } });
  return prisma.user.create({
    data: {
      email,
      fullName: overrides.fullName ?? 'Test User',
      passwordHash,
      roles: { create: roles.map((r) => ({ roleId: r.id })) },
    },
  });
}

/** Creates a user with the given roles and returns a signed-in client. */
export async function signedIn(roleKeys: string[] = []) {
  const user = await createUser(roleKeys);
  const c = await client();
  await c.post('/auth/login', { email: user.email, password: PASSWORD }).expect(200);
  return Object.assign(c, { user });
}

export const validApplication = (overrides: Record<string, unknown> = {}) => ({
  fullName: 'Applicant Example',
  email: `applicant-${randomUUID().slice(0, 8)}@test.example`,
  phone: '+880 1700 000000',
  currentStatus: 'graduate_seeking_employment',
  highestEducation: 'Bachelor degree',
  areaOfInterest: 'Basic Python Programming',
  motivation: 'I want to build practical skills for the workplace and improve my employability.',
  preferredContact: 'email',
  locale: 'en',
  privacyConsent: true,
  ...overrides,
});
