import { describe, expect, it } from 'vitest';
import { prisma } from '../src/lib/prisma.js';
import { createPasswordToken } from '../src/services/auth.service.js';
import { PASSWORD, client, createUser, signedIn } from './helpers.js';

describe('authentication', () => {
  it('logs in with an HTTP-only session cookie and logs out', async () => {
    const user = await createUser();
    const c = await client();
    const res = await c.post('/auth/login', { email: user.email.toUpperCase(), password: PASSWORD }).expect(200);
    const cookie = String(res.headers['set-cookie']);
    expect(cookie).toContain('bi_session=');
    expect(cookie).toContain('HttpOnly');
    expect(res.body.data.email).toBe(user.email);
    expect(res.body.data.passwordHash).toBeUndefined();

    await c.get('/auth/me').expect(200).then((r) => {
      expect(r.body.data.id).toBe(user.id);
      expect(r.headers['cache-control']).toContain('no-store');
    });
    await c.post('/auth/logout').expect(200);
    await c.get('/auth/me').expect(200).then((r) => expect(r.body.data).toBeNull());
  });

  it('gives the same error for unknown emails and wrong passwords', async () => {
    const user = await createUser();
    const c = await client();
    const wrong = await c.post('/auth/login', { email: user.email, password: 'wrong-password' }).expect(401);
    const unknown = await c.post('/auth/login', { email: 'nobody@test.example', password: 'wrong-password' }).expect(401);
    expect(wrong.body.error).toMatchObject({ code: 'INVALID_CREDENTIALS' });
    expect(unknown.body.error.message).toBe(wrong.body.error.message);
  });

  it('rejects deactivated accounts', async () => {
    const user = await createUser();
    await prisma.user.update({ where: { id: user.id }, data: { isActive: false } });
    const c = await client();
    await c.post('/auth/login', { email: user.email, password: PASSWORD }).expect(401);
  });

  it('rejects public self-registration', async () => {
    const c = await client();
    await c
      .post('/auth/register', { fullName: 'New Person', email: 'newperson@test.example', password: 'a-strong-password' })
      .expect(403);
  });

  it('resets a password with a single-use token and revokes sessions', async () => {
    const s = await signedIn();
    const token = await createPasswordToken(s.user.id, 'reset', 1);
    const c = await client();
    await c.post('/auth/reset-password', { token, password: 'brand-new-password' }).expect(200);
    await c.post('/auth/reset-password', { token, password: 'another-password' }).expect(400);
    await s.get('/auth/me').expect(200).then((r) => expect(r.body.data).toBeNull());
    await c.post('/auth/login', { email: s.user.email, password: 'brand-new-password' }).expect(200);
  });

  it('forgot-password does not reveal whether an account exists', async () => {
    const user = await createUser();
    const c = await client();
    const known = await c.post('/auth/forgot-password', { email: user.email }).expect(200);
    const unknown = await c.post('/auth/forgot-password', { email: 'ghost@test.example' }).expect(200);
    expect(known.body).toEqual(unknown.body);
  });

  it('expired sessions are rejected', async () => {
    const s = await signedIn();
    await prisma.session.updateMany({ where: { userId: s.user.id }, data: { expiresAt: new Date(Date.now() - 1000) } });
    await s.get('/auth/me').expect(200).then((r) => expect(r.body.data).toBeNull());
    await s.get('/applications/mine').expect(401);
  });
});

describe('authorization', () => {
  it('rejects anonymous access to private endpoints', async () => {
    const c = await client();
    for (const path of ['/users', '/applications', '/students', '/admin/dashboard', '/admin/alumni/overview', '/cms/admin/sections', '/settings', '/audit-logs']) {
      await c.get(path).expect(401);
    }
  });

  it('enforces permissions per role', async () => {
    const content = await signedIn(['CONTENT_MANAGER']);
    await content.get('/cms/admin/sections').expect(200);
    await content.get('/applications').expect(403);
    await content.get('/users').expect(403);

    const admissions = await signedIn(['ADMISSIONS_OFFICER']);
    await admissions.get('/applications').expect(200);
    await admissions.get('/companies').expect(403);
    await admissions.get('/courses/admin').expect(403);

    const student = await signedIn(['STUDENT']);
    await student.get('/admin/dashboard').expect(403);
    await student.get('/students').expect(403);
  });

  it('only a Super Admin can grant the Super Admin role', async () => {
    const role = await prisma.role.create({
      data: {
        key: 'USER_MANAGER_TEST',
        name: 'User manager',
        isSystem: false,
        permissions: { create: [{ permission: { connect: { key: 'users.manage' } } }] },
      },
    });
    const manager = await signedIn([role.key]);
    const target = await createUser();
    await manager.patch(`/users/${target.id}`, { roleKeys: ['SUPER_ADMIN'] }).expect(403);

    const superAdmin = await signedIn(['SUPER_ADMIN']);
    await superAdmin.patch(`/users/${target.id}`, { roleKeys: ['SUPER_ADMIN'] }).expect(200);
  });

  it('lets an administrator delete another user, not their own account', async () => {
    const admin = await signedIn(['SUPER_ADMIN']);
    const target = await createUser(['STUDENT'], { fullName: 'Removable Student' });
    await admin.delete(`/users/${target.id}`).expect(204);
    expect(await prisma.user.findUnique({ where: { id: target.id } })).toBeNull();
    await admin.delete(`/users/${admin.user.id}`).expect(400);

    const role = await prisma.role.create({
      data: {
        key: `USER_DELETE_TEST_${target.id.slice(0, 8)}`,
        name: 'User delete test',
        isSystem: false,
        permissions: { create: [{ permission: { connect: { key: 'users.manage' } } }] },
      },
    });
    const manager = await signedIn([role.key]);
    const superTarget = await createUser(['SUPER_ADMIN']);
    await manager.delete(`/users/${superTarget.id}`).expect(403);
    const ordinary = await createUser();
    await manager.delete(`/users/${ordinary.id}`).expect(204);
  });

  it('returns 404 for malformed ids rather than a server error', async () => {
    const admin = await signedIn(['SUPER_ADMIN']);
    await admin.get('/applications/not-a-uuid').expect(404);
    await admin.get('/applications/00000000-0000-4000-8000-000000000000').expect(404);
    await admin.patch('/companies/123', { name: 'x' }).expect(404);
  });

  it('whitelists sort fields', async () => {
    const admin = await signedIn(['SUPER_ADMIN']);
    await admin.get('/applications?sort=passwordHash&order=asc').expect(200);
    await admin.get('/applications?pageSize=1000').expect(422);
  });
});
