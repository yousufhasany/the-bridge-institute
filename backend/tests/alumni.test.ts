import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { prisma } from '../src/lib/prisma.js';
import { API, PASSWORD, app, client, signedIn } from './helpers.js';

async function joinAsAlumnus(email: string) {
  const c = await client();
  const res = await c.post('/alumni/register', { fullName: 'Alumna Example', email, password: PASSWORD, graduationYear: 2027, message: 'Graduated from the foundation courses.' }).expect(201);
  return { c, requestId: res.body.data.id as string };
}

async function verifiedAlumnus(email: string) {
  const { c, requestId } = await joinAsAlumnus(email);
  const admin = await signedIn(['SUPER_ADMIN']);
  const approved = await admin.post(`/admin/alumni/registrations/${requestId}/approve`, { note: 'Checked records' }).expect(200);
  // Role changes take effect on the next session lookup.
  return { c, admin, profileId: approved.body.data.profileId as string };
}

describe('alumni registration and verification', () => {
  it('registration creates a pending request without granting alumni status', async () => {
    const { c, requestId } = await joinAsAlumnus('alumni-pending@test.example');
    const me = await c.get('/auth/me').expect(200);
    expect(me.body.data.roles).toEqual([]);
    expect(me.body.data.alumniProfile).toBeNull();
    const status = await c.get('/alumni/me').expect(200);
    expect(status.body.data.requests[0]).toMatchObject({ id: requestId, status: 'PENDING' });
    expect(JSON.stringify(status.body)).not.toContain('reviewNote');
    await c.patch('/alumni/me', { bioEn: 'x' }).expect(403);
    await c.post('/alumni/register', { fullName: 'Alumna Example', email: 'alumni-pending@test.example' }).expect(409);
  });

  it('staff approval verifies the alumnus and grants the alumni role', async () => {
    const { c, profileId } = await verifiedAlumnus('alumni-verified@test.example');
    const me = await c.get('/auth/me').expect(200);
    expect(me.body.data.roles).toContain('ALUMNI');
    const profile = await prisma.alumniProfile.findUniqueOrThrow({ where: { id: profileId } });
    expect(profile.verificationStatus).toBe('VERIFIED');
    expect(profile.isPublic).toBe(false);
  });

  it('only alumni managers can review registrations', async () => {
    const { requestId } = await joinAsAlumnus('alumni-guard@test.example');
    const content = await signedIn(['CONTENT_MANAGER']);
    await content.post(`/admin/alumni/registrations/${requestId}/approve`).expect(403);
    const student = await signedIn(['STUDENT']);
    await student.get('/admin/alumni/registrations').expect(403);
  });
});

describe('alumni publication consent and public visibility', () => {
  it('requires consent and approval before a profile appears publicly, and revocation hides it', async () => {
    const { c, admin, profileId } = await verifiedAlumnus('alumni-public@test.example');
    await c.patch('/alumni/me', { professionalTitle: 'Junior Developer', bioEn: 'Learning every day.', contactEmail: 'private@test.example' }).expect(200);

    const directory = () => request(app).get(`${API}/alumni/directory`).expect(200);
    expect((await directory()).body.data).toHaveLength(0);

    await c.put('/alumni/me/visibility', { isPublic: true }).expect(400);
    await c.put('/alumni/me/visibility', { isPublic: true, consent: true }).expect(200);
    expect((await directory()).body.data).toHaveLength(0);

    await admin.post(`/admin/alumni/profiles/${profileId}/publication/approve`).expect(200);
    const listed = (await directory()).body.data;
    expect(listed).toHaveLength(1);
    expect(listed[0].professionalTitle).toBe('Junior Developer');
    const serialized = JSON.stringify(listed[0]);
    expect(serialized).not.toContain('private@test.example');
    expect(serialized).not.toContain('reviewNote');
    expect(serialized).not.toContain('userId');

    await request(app).get(`${API}/alumni/directory/${listed[0].slug}`).expect(200);

    // Edits to a published profile are held for review.
    await c.patch('/alumni/me', { professionalTitle: 'Senior Developer' }).expect(200);
    expect((await directory()).body.data[0].professionalTitle).toBe('Junior Developer');
    await admin.post(`/admin/alumni/profiles/${profileId}/publication/approve`).expect(200);
    expect((await directory()).body.data[0].professionalTitle).toBe('Senior Developer');

    await c.put('/alumni/me/visibility', { isPublic: false }).expect(200);
    expect((await directory()).body.data).toHaveLength(0);
    await request(app).get(`${API}/alumni/directory/${listed[0].slug}`).expect(404);
  });

  it('archived profiles are never public', async () => {
    const { c, admin, profileId } = await verifiedAlumnus('alumni-archived@test.example');
    await c.put('/alumni/me/visibility', { isPublic: true, consent: true }).expect(200);
    await admin.post(`/admin/alumni/profiles/${profileId}/publication/approve`).expect(200);
    await admin.post(`/admin/alumni/profiles/${profileId}/archive`).expect(200);
    const { slug } = await prisma.alumniProfile.findUniqueOrThrow({ where: { id: profileId } });
    const res = await request(app).get(`${API}/alumni/directory`).expect(200);
    expect(res.body.data.some((p: { slug: string }) => p.slug === slug)).toBe(false);
    await request(app).get(`${API}/alumni/directory/${slug}`).expect(404);
    await c.patch('/alumni/me', { bioEn: 'x' }).expect(403);
  });
});

describe('alumni profile ownership', () => {
  it('alumni can only edit their own profile and cannot change protected fields', async () => {
    const a = await verifiedAlumnus('alumni-owner-a@test.example');
    const b = await verifiedAlumnus('alumni-owner-b@test.example');
    await a.c.patch('/alumni/me', { displayName: 'A Changed', verificationStatus: 'VERIFIED', publicationStatus: 'APPROVED', userId: b.profileId }).expect(200);
    const profileA = await prisma.alumniProfile.findUniqueOrThrow({ where: { id: a.profileId } });
    const profileB = await prisma.alumniProfile.findUniqueOrThrow({ where: { id: b.profileId } });
    expect(profileA.displayName).toBe('A Changed');
    expect(profileA.publicationStatus).toBe('NOT_SUBMITTED');
    expect(profileB.displayName).toBe('Alumna Example');
    // There is no endpoint for editing another alumnus by id.
    await a.c.patch(`/admin/alumni/profiles/${b.profileId}`, { displayName: 'Hacked' }).expect(403);
  });
});

describe('alumni stories', () => {
  it('stories stay private until staff publish them', async () => {
    const { c, admin } = await verifiedAlumnus('alumni-story@test.example');
    const submitted = await c.post('/alumni/me/stories', { titleEn: 'My learning journey', excerptEn: 'Short', bodyEn: 'How the foundation courses helped me.' }).expect(201);
    expect(submitted.body.data.status).toBe('SUBMITTED');
    await c.post('/alumni/me/stories', { excerptEn: 'No title or body' }).expect(422);

    let pub = await request(app).get(`${API}/alumni/stories`).expect(200);
    expect(pub.body.data).toHaveLength(0);
    await request(app).get(`${API}/alumni/stories/${submitted.body.data.slug}`).expect(404);

    await admin.post(`/admin/alumni/stories/${submitted.body.data.id}/publish`).expect(200);
    pub = await request(app).get(`${API}/alumni/stories`).expect(200);
    expect(pub.body.data).toHaveLength(1);
    // The author's profile is not public, so they are not named.
    expect(pub.body.data[0].author).toBeNull();
    await c.put(`/alumni/me/stories/${submitted.body.data.id}`, { titleEn: 'Edit', bodyEn: 'Edited' }).expect(400);
  });

  it('non-alumni cannot submit stories', async () => {
    const user = await signedIn();
    await user.post('/alumni/me/stories', { titleEn: 'x', bodyEn: 'y' }).expect(403);
  });
});
