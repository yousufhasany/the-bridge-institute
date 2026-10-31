import { Router } from 'express';
import { P } from '../config/permissions.js';
import * as alumni from '../controllers/alumni.controller.js';
import * as admin from '../controllers/alumniAdmin.controller.js';
import { crudRouter } from '../controllers/crud.factory.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';
import { authLimiter, formLimiter } from '../middleware/rateLimit.js';
import {
  announcementFilterSchema,
  announcementSchema,
  announcementUpdateSchema,
  cohortSchema,
  cohortUpdateSchema,
} from '../validators/admin.validators.js';

export const alumniRoutes = Router();
const self = requirePermission(P.alumniSelf);

// Public
alumniRoutes.get('/directory', alumni.directory);
alumniRoutes.get('/directory/filters', alumni.filters);
alumniRoutes.get('/directory/:slug', alumni.publicProfile);
alumniRoutes.get('/stories', alumni.publicStories);
alumniRoutes.get('/stories/:slug', alumni.publicStory);
alumniRoutes.get('/registration-options', alumni.cohortsAndCourses);
alumniRoutes.post('/register', authLimiter, alumni.register);

// Signed-in
alumniRoutes.get('/me', requireAuth, alumni.me);
alumniRoutes.patch('/me', self, alumni.updateMe);
alumniRoutes.put('/me/visibility', self, alumni.setVisibility);
alumniRoutes.get('/me/stories', self, alumni.myStories);
alumniRoutes.post('/me/stories', self, formLimiter, alumni.submitStory);
alumniRoutes.put('/me/stories/:id', self, alumni.updateStory);
alumniRoutes.get('/announcements', self, alumni.announcements);
alumniRoutes.post('/me/assistance', self, formLimiter, alumni.requestAssistance);

// Administration
export const alumniAdminRoutes = Router();
const manage = requirePermission(P.alumniManage);
alumniAdminRoutes.get('/overview', manage, admin.overview);
alumniAdminRoutes.get('/registrations', manage, admin.listRegistrations);
alumniAdminRoutes.get('/registrations/:id', manage, admin.getRegistration);
alumniAdminRoutes.post('/registrations/:id/approve', manage, admin.approveRegistration);
alumniAdminRoutes.post('/registrations/:id/reject', manage, admin.rejectRegistration);
alumniAdminRoutes.get('/profiles', manage, admin.listProfiles);
alumniAdminRoutes.get('/profiles/:id', manage, admin.getProfile);
alumniAdminRoutes.patch('/profiles/:id', manage, admin.updateProfile);
alumniAdminRoutes.post('/profiles/:id/publication/approve', manage, admin.approvePublication);
alumniAdminRoutes.post('/profiles/:id/publication/reject', manage, admin.rejectPublication);
alumniAdminRoutes.post('/profiles/:id/archive', manage, admin.setArchived(true));
alumniAdminRoutes.post('/profiles/:id/unarchive', manage, admin.setArchived(false));
alumniAdminRoutes.get('/stories', manage, admin.listStories);
alumniAdminRoutes.patch('/stories/:id', manage, admin.updateStory);
alumniAdminRoutes.post('/stories/:id/publish', manage, admin.storyAction('publish'));
alumniAdminRoutes.post('/stories/:id/reject', manage, admin.storyAction('reject'));
alumniAdminRoutes.post('/stories/:id/archive', manage, admin.storyAction('archive'));

alumniAdminRoutes.use(
  '/cohorts',
  crudRouter({
    delegate: prisma.alumniCohort,
    entity: 'AlumniCohort',
    permission: P.alumniManage,
    createSchema: cohortSchema,
    updateSchema: cohortUpdateSchema,
    searchFields: ['name', 'slug'],
    sortable: ['name', 'graduationYear', 'createdAt'],
    include: { _count: { select: { profiles: true } } },
  }),
);

alumniAdminRoutes.use(
  '/announcements',
  crudRouter({
    delegate: prisma.alumniAnnouncement,
    entity: 'AlumniAnnouncement',
    permission: P.alumniManage,
    createSchema: announcementSchema,
    updateSchema: announcementUpdateSchema,
    searchFields: ['titleEn', 'titleBn'],
    sortable: ['createdAt', 'publishedAt', 'titleEn', 'status'],
    filterSchema: announcementFilterSchema,
    filters: (f) => (f.status ? { status: f.status } : {}),
    prepare: (data) => (data.status === 'PUBLISHED' && !data.publishedAt ? { ...data, publishedAt: new Date() } : data),
  }),
);
