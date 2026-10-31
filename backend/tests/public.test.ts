import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { prisma } from '../src/lib/prisma.js';
import { API, app, client, signedIn, validApplication } from './helpers.js';

describe('health and security basics', () => {
  it('reports health without leaking configuration', async () => {
    const res = await request(app).get(`${API}/health`).expect(200);
    expect(res.body.data).toEqual({ status: 'ok', database: 'ok' });
    expect(res.headers['x-powered-by']).toBeUndefined();
    expect(res.headers['x-request-id']).toBeTruthy();
  });

  it('rejects state-changing requests without a CSRF token', async () => {
    const res = await request(app).post(`${API}/contact`).send({}).expect(403);
    expect(res.body.error.code).toBe('CSRF_INVALID');
  });

  it('rejects requests from origins that are not allow-listed', async () => {
    const c = await client();
    const res = await c.post('/contact', {}).set('Origin', 'https://evil.example').expect(403);
    expect(res.body.error.code).toBe('CSRF_ORIGIN');
  });

  it('returns JSON 404s for unknown routes', async () => {
    const res = await request(app).get(`${API}/does-not-exist`).expect(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('rejects malformed JSON bodies cleanly', async () => {
    const c = await client();
    const res = await c.agent
      .post(`${API}/contact`)
      .set('X-CSRF-Token', c.csrf)
      .set('Content-Type', 'application/json')
      .send('{"name": ')
      .expect(400);
    expect(res.body.error.message).toBe('Malformed JSON body');
    expect(res.body.error.debug).toBeUndefined();
  });
});

describe('public courses', () => {
  it('lists the five published foundation courses in order', async () => {
    const res = await request(app).get(`${API}/courses`).expect(200);
    expect(res.body.data.map((c: { slug: string }) => c.slug)).toEqual([
      'critical-thinking',
      'basic-english',
      'basic-mathematics',
      'basic-ict',
      'basic-python-programming',
    ]);
    expect(res.body.data[0].topics.length).toBeGreaterThan(0);
  });

  it('returns Bangla translations independently of English', async () => {
    const en = await request(app).get(`${API}/courses/basic-ict?locale=en`).expect(200);
    const bn = await request(app).get(`${API}/courses/basic-ict?locale=bn`).expect(200);
    expect(en.body.data.title).toBe('Basic ICT');
    expect(bn.body.data.title).toBe('বেসিক আইসিটি');
  });

  it('does not invent durations', async () => {
    const res = await request(app).get(`${API}/courses`).expect(200);
    for (const course of res.body.data) expect(course.duration).toBeNull();
  });

  it('hides draft courses and unknown slugs', async () => {
    await prisma.course.create({
      data: { slug: 'hidden-draft', status: 'DRAFT', translations: { create: { locale: 'en', title: 'Hidden', summary: 's', description: 'd' } } },
    });
    await request(app).get(`${API}/courses/hidden-draft`).expect(404);
    await request(app).get(`${API}/courses/NOT_A_SLUG!`).expect(404);
    const list = await request(app).get(`${API}/courses`).expect(200);
    expect(list.body.data.some((c: { slug: string }) => c.slug === 'hidden-draft')).toBe(false);
  });
});

describe('student applications', () => {
  it('persists a valid application with a reference code and status history', async () => {
    const c = await client();
    const input = validApplication();
    const res = await c.post('/applications', input).expect(201);
    expect(res.body.data.referenceCode).toMatch(/^BI-\d{4}-[A-Z0-9]{8}$/);
    const saved = await prisma.studentApplication.findUniqueOrThrow({
      where: { referenceCode: res.body.data.referenceCode },
      include: { history: true },
    });
    expect(saved.email).toBe(input.email);
    expect(saved.status).toBe('SUBMITTED');
    expect(saved.history).toHaveLength(1);
    // Submitting never creates a student or enrolment.
    expect(await prisma.studentProfile.count({ where: { sourceApplicationId: saved.id } })).toBe(0);
  });

  it('returns field-level validation errors', async () => {
    const c = await client();
    const res = await c.post('/applications', validApplication({ email: 'not-an-email', privacyConsent: false, motivation: 'short' })).expect(422);
    const paths = res.body.error.details.map((d: { path: string }) => d.path);
    expect(paths).toEqual(expect.arrayContaining(['email', 'privacyConsent', 'motivation']));
  });

  it('ignores unknown fields such as status (no mass assignment)', async () => {
    const c = await client();
    const res = await c.post('/applications', { ...validApplication(), status: 'ACCEPTED' }).expect(201);
    const saved = await prisma.studentApplication.findUniqueOrThrow({ where: { referenceCode: res.body.data.referenceCode } });
    expect(saved.status).toBe('SUBMITTED');
  });

  it('replays an idempotent retry and blocks quick duplicates', async () => {
    const c = await client();
    const key = crypto.randomUUID();
    const withoutKey = validApplication();
    const input = { ...withoutKey, idempotencyKey: key };
    const first = await c.post('/applications', input).expect(201);
    const replay = await c.post('/applications', input).expect(200);
    expect(replay.body.data.referenceCode).toBe(first.body.data.referenceCode);
    const dup = await c.post('/applications', withoutKey).expect(409);
    expect(dup.body.error.code).toBe('DUPLICATE_APPLICATION');
  });

  it('shows applicants their own applications without internal notes', async () => {
    const applicant = await signedIn();
    const other = await signedIn();
    await applicant.post('/applications', validApplication({ email: applicant.user.email })).expect(201);
    const app1 = await prisma.studentApplication.findFirstOrThrow({ where: { userId: applicant.user.id } });
    await prisma.applicationInternalNote.create({ data: { applicationId: app1.id, body: 'private staff note' } });

    const mine = await applicant.get('/applications/mine').expect(200);
    expect(mine.body.data).toHaveLength(1);
    expect(JSON.stringify(mine.body)).not.toContain('private staff note');

    const theirs = await other.get('/applications/mine').expect(200);
    expect(theirs.body.data).toHaveLength(0);
  });
});

describe('contact and partnership forms', () => {
  it('stores contact messages', async () => {
    const c = await client();
    const res = await c.post('/contact', { name: 'Visitor', email: 'visitor@test.example', subject: 'Question', message: 'I would like to know more.' }).expect(201);
    expect(await prisma.contactMessage.findUnique({ where: { id: res.body.data.id } })).not.toBeNull();
  });

  it('stores partnership inquiries and requires consent', async () => {
    const c = await client();
    const input = {
      organizationName: 'Example Organisation',
      contactName: 'Jane Doe',
      workEmail: 'jane@org.example',
      website: 'https://org.example',
      interest: 'training_collaboration',
      message: 'We would like to discuss training collaboration.',
      consent: true,
    };
    const res = await c.post('/partnership-inquiries', input).expect(201);
    const saved = await prisma.partnershipInquiry.findUniqueOrThrow({ where: { id: res.body.data.id } });
    expect(saved.status).toBe('NEW');
    await c.post('/partnership-inquiries', { ...input, consent: false }).expect(422);
    await c.post('/partnership-inquiries', { ...input, website: 'javascript:alert(1)' }).expect(422);
  });

  it('lists active partner names and omits contact details', async () => {
    await prisma.company.create({
      data: { name: 'Shown Partner', status: 'ACTIVE', listedPublicly: true, industry: 'Manufacturing', contactEmail: 'secret@partner.test', phone: '01000000000', notes: 'private note' },
    });
    await prisma.company.create({ data: { name: 'Hidden Prospect', status: 'PROSPECT', listedPublicly: true } });
    await prisma.company.create({ data: { name: 'Hidden Inactive', status: 'INACTIVE', listedPublicly: true } });
    await prisma.company.create({ data: { name: 'Hidden Active', status: 'ACTIVE', listedPublicly: false } });

    const res = await request(app).get(`${API}/companies/partners`).expect(200);
    expect(res.body.data).toEqual([{ name: 'Shown Partner', industry: 'Manufacturing', website: null }]);
    expect(JSON.stringify(res.body)).not.toContain('secret@partner.test');
    expect(JSON.stringify(res.body)).not.toContain('private note');
    expect(res.headers['cache-control']).toContain('no-cache');
  });
});

describe('public settings', () => {
  it('exposes the brochure email and leaves unconfirmed links empty', async () => {
    const res = await request(app).get(`${API}/settings/public`).expect(200);
    expect(res.body.data['contact.generalEmail']).toBe('thebridgeinstitute2026@gmail.com');
    expect(res.body.data['social.facebookUrl']).toBe('');
    expect(res.body.data['qr.admissionInformation']).toBe('');
    expect(res.body.data['program.sixMonthProgram']).toBeUndefined();
  });
});
