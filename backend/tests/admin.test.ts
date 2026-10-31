import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { prisma } from '../src/lib/prisma.js';
import { API, app, client, createUser, signedIn, validApplication } from './helpers.js';

describe('course management', () => {
  it('creates a draft, edits languages independently and publishes', async () => {
    const manager = await signedIn(['COURSE_MANAGER']);
    const created = await manager
      .post('/courses/admin', {
        slug: 'test-course',
        icon: 'book-open',
        translations: {
          en: { title: 'Test Course', summary: 'English summary', description: 'English description' },
          bn: { title: 'পরীক্ষা কোর্স', summary: 'বাংলা সারাংশ', description: 'বাংলা বিবরণ' },
        },
        topics: [{ en: 'Topic one', bn: 'বিষয় এক' }],
      })
      .expect(201);
    const id = created.body.data.id;
    expect(created.body.data.status).toBe('DRAFT');
    await request(app).get(`${API}/courses/test-course`).expect(404);

    await manager.put(`/courses/admin/${id}`, { translations: { en: { title: 'Updated Course', summary: 'New', description: 'New description' } } }).expect(200);
    const after = await manager.get(`/courses/admin/${id}`).expect(200);
    expect(after.body.data.translations.en.title).toBe('Updated Course');
    expect(after.body.data.translations.bn.title).toBe('পরীক্ষা কোর্স');

    await manager.post(`/courses/admin/${id}/status`, { status: 'PUBLISHED' }).expect(200);
    const bn = await request(app).get(`${API}/courses/test-course?locale=bn`).expect(200);
    expect(bn.body.data.title).toBe('পরীক্ষা কোর্স');

    await manager.post(`/courses/admin/${id}/status`, { status: 'ARCHIVED' }).expect(200);
    await request(app).get(`${API}/courses/test-course`).expect(404);
    await manager.delete(`/courses/admin/${id}`).expect(409);
    expect(await prisma.auditLog.count({ where: { entityType: 'Course', entityId: id } })).toBeGreaterThanOrEqual(3);
  });
});

describe('CMS draft and published states', () => {
  it('keeps drafts private until published, per language', async () => {
    const editor = await signedIn(['CONTENT_MANAGER']);
    await editor.put('/cms/admin/sections/hero/en', { content: { title: 'Draft headline' } }).expect(200);
    let pub = await request(app).get(`${API}/cms/sections?locale=en`).expect(200);
    expect(pub.body.data.hero).toBeUndefined();

    await editor.post('/cms/admin/sections/hero/en/publish').expect(200);
    pub = await request(app).get(`${API}/cms/sections?locale=en`).expect(200);
    expect(pub.body.data.hero).toEqual({ title: 'Draft headline' });
    const bn = await request(app).get(`${API}/cms/sections?locale=bn`).expect(200);
    expect(bn.body.data.hero).toBeUndefined();

    await editor.put('/cms/admin/sections/hero/en', { content: { title: 'Next draft' } }).expect(200);
    pub = await request(app).get(`${API}/cms/sections?locale=en`).expect(200);
    expect(pub.body.data.hero.title).toBe('Draft headline');

    await editor.post('/cms/admin/sections/hero/en/unpublish').expect(200);
    pub = await request(app).get(`${API}/cms/sections?locale=en`).expect(200);
    expect(pub.body.data.hero).toBeUndefined();
  });

  it('rejects invalid section keys and locales', async () => {
    const editor = await signedIn(['CONTENT_MANAGER']);
    await editor.put('/cms/admin/sections/hero/fr', { content: {} }).expect(404);
    await editor.put('/cms/admin/sections/Bad Key/en', { content: {} }).expect(404);
  });

  it('validates settings and keeps the six-month programme private until confirmed', async () => {
    const admin = await signedIn(['SUPER_ADMIN']);
    await admin.put('/settings/social.facebookUrl', { value: 'not a url' }).expect(422);
    await admin.put('/settings/contact.generalEmail', { value: 'bad' }).expect(422);
    await admin.put('/settings/unknown.key', { value: 'x' }).expect(404);
    await admin.put('/settings/program.sixMonthProgram', { value: { status: 'requires_review', enabled: true, relationship: '' } }).expect(200);
    let pub = await request(app).get(`${API}/settings/public`).expect(200);
    expect(pub.body.data['program.sixMonthProgram']).toBeUndefined();
    await admin.put('/settings/program.sixMonthProgram', { value: { status: 'confirmed', enabled: true, relationship: 'Separate foundation programme' } }).expect(200);
    pub = await request(app).get(`${API}/settings/public`).expect(200);
    expect(pub.body.data['program.sixMonthProgram'].status).toBe('confirmed');
    await admin.put('/settings/program.sixMonthProgram', { value: { status: 'requires_review', enabled: false, relationship: '' } }).expect(200);
  });
});

describe('admissions workflow', () => {
  it('updates status with history, adds private notes and onboards an accepted applicant', async () => {
    const c = await client();
    const input = validApplication();
    const submitted = await c.post('/applications', input).expect(201);
    const app1 = await prisma.studentApplication.findUniqueOrThrow({ where: { referenceCode: submitted.body.data.referenceCode } });

    const officer = await signedIn(['ADMISSIONS_OFFICER']);
    await officer.post(`/applications/${app1.id}/onboard`).expect(400);
    await officer.patch(`/applications/${app1.id}/status`, { status: 'UNDER_REVIEW' }).expect(200);
    await officer.patch(`/applications/${app1.id}/status`, { status: 'ACCEPTED', note: 'Meets criteria' }).expect(200);
    await officer.patch(`/applications/${app1.id}/status`, { status: 'NOT_A_STATUS' }).expect(422);
    await officer.post(`/applications/${app1.id}/notes`, { body: 'Called applicant' }).expect(201);

    const detail = await officer.get(`/applications/${app1.id}`).expect(200);
    expect(detail.body.data.history.map((h: { toStatus: string }) => h.toStatus)).toEqual(['SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED']);
    expect(detail.body.data.notes).toHaveLength(1);

    const onboard = await officer.post(`/applications/${app1.id}/onboard`).expect(201);
    expect(onboard.body.data.studentCode).toMatch(/^BIS-\d{4}-\d{4}$/);
    expect(onboard.body.data.inviteUrl).toContain('/reset-password?token=');
    const user = await prisma.user.findUniqueOrThrow({ where: { email: input.email }, include: { roles: { include: { role: true } } } });
    expect(user.roles.map((r) => r.role.key)).toEqual(['STUDENT']);
    await officer.post(`/applications/${app1.id}/onboard`).expect(409);
  });
});

describe('student data isolation and teacher scope', () => {
  it('students only see their own records; teachers only their batches', async () => {
    const studentA = await signedIn(['STUDENT']);
    const studentB = await signedIn(['STUDENT']);
    const profileA = await prisma.studentProfile.create({ data: { userId: studentA.user.id, studentCode: 'TEST-A' } });
    await prisma.studentProfile.create({ data: { userId: studentB.user.id, studentCode: 'TEST-B' } });
    const batch = await prisma.trainingBatch.create({ data: { code: 'TB-1', name: 'Test batch', status: 'ACTIVE' } });
    const otherBatch = await prisma.trainingBatch.create({ data: { code: 'TB-2', name: 'Other batch', status: 'ACTIVE' } });
    await prisma.enrollment.create({ data: { studentId: profileA.id, batchId: batch.id } });

    const meA = await studentA.get('/students/me').expect(200);
    expect(meA.body.data.studentCode).toBe('TEST-A');
    expect(meA.body.data.enrollments).toHaveLength(1);
    const meB = await studentB.get('/students/me').expect(200);
    expect(meB.body.data.studentCode).toBe('TEST-B');
    expect(meB.body.data.enrollments).toHaveLength(0);
    await studentB.get(`/students/${profileA.id}`).expect(403);

    const teacher = await signedIn(['TEACHER']);
    await prisma.batchTeacher.create({ data: { batchId: batch.id, userId: teacher.user.id } });
    const batches = await teacher.get('/batches').expect(200);
    expect(batches.body.data.map((b: { id: string }) => b.id)).toEqual([batch.id]);
    await teacher.get(`/batches/${otherBatch.id}`).expect(403);
    await teacher.get(`/attendance?batchId=${otherBatch.id}&date=2026-01-05`).expect(403);
    const sheet = await teacher.get(`/attendance?batchId=${batch.id}&date=2026-01-05`).expect(200);
    await teacher.put('/attendance', { batchId: batch.id, date: '2026-01-05', records: [{ enrollmentId: sheet.body.data[0].enrollmentId, status: 'PRESENT' }] }).expect(200);
    await teacher.post('/batches', { code: 'X-1', name: 'Not allowed' }).expect(403);
  });

  it('certificates require completion and explicit approval before issue', async () => {
    const s = await createUser(['STUDENT']);
    const profile = await prisma.studentProfile.create({ data: { userId: s.id, studentCode: 'TEST-C' } });
    const batch = await prisma.trainingBatch.create({ data: { code: 'TB-C', name: 'Cert batch' } });
    const enrollment = await prisma.enrollment.create({ data: { studentId: profile.id, batchId: batch.id } });
    const admin = await signedIn(['SUPER_ADMIN']);
    await admin.post('/certificates', { enrollmentId: enrollment.id }).expect(400);
    await prisma.enrollment.update({ where: { id: enrollment.id }, data: { status: 'COMPLETED' } });
    const cert = await admin.post('/certificates', { enrollmentId: enrollment.id }).expect(201);
    expect(cert.body.data.status).toBe('PENDING');
    await admin.post(`/certificates/${cert.body.data.id}/issue`).expect(400);
    await admin.post(`/certificates/${cert.body.data.id}/approve`).expect(200);
    const issued = await admin.post(`/certificates/${cert.body.data.id}/issue`).expect(200);
    expect(issued.body.data.status).toBe('ISSUED');
  });
});

describe('dashboard', () => {
  it('returns live counts', async () => {
    const admin = await signedIn(['SUPER_ADMIN']);
    const res = await admin.get('/admin/dashboard').expect(200);
    expect(res.body.data.counts.publishedCourses).toBe(await prisma.course.count({ where: { status: 'PUBLISHED' } }));
    expect(res.body.data.counts.applications).toBe(await prisma.studentApplication.count());
  });
});
