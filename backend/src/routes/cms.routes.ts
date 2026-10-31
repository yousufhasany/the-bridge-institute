import { Router } from 'express';
import { P } from '../config/permissions.js';
import * as cms from '../controllers/cms.controller.js';
import { crudRouter } from '../controllers/crud.factory.js';
import * as media from '../controllers/media.controller.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';
import { faqSchema, faqUpdateSchema } from '../validators/admin.validators.js';

export const cmsRoutes = Router();
cmsRoutes.get('/sections', cms.publicSections);
cmsRoutes.get('/admin/sections', requirePermission(P.cmsEdit), cms.adminSections);
cmsRoutes.put('/admin/sections/:key/:locale', requirePermission(P.cmsEdit), cms.saveDraft);
cmsRoutes.post('/admin/sections/:key/:locale/publish', requirePermission(P.cmsPublish), cms.publish);
cmsRoutes.post('/admin/sections/:key/:locale/unpublish', requirePermission(P.cmsPublish), cms.unpublish);

export const faqRoutes = Router();
faqRoutes.get('/', cms.publicFaqs);
faqRoutes.use(
  '/admin',
  crudRouter({
    delegate: prisma.faq,
    entity: 'Faq',
    permission: P.faqsManage,
    createSchema: faqSchema,
    updateSchema: faqUpdateSchema,
    searchFields: ['questionEn', 'questionBn'],
    sortable: ['sortOrder', 'createdAt', 'category'],
    defaultSort: 'sortOrder',
    defaultOrder: 'asc',
  }),
);

export const settingsRoutes = Router();
settingsRoutes.get('/public', cms.publicSettings);
settingsRoutes.get('/', requirePermission(P.settingsManage), cms.adminSettings);
settingsRoutes.put('/:key', requirePermission(P.settingsManage), cms.updateSetting);

export const mediaRoutes = Router();
mediaRoutes.post('/', requireAuth, media.uploadMiddleware, media.upload);
mediaRoutes.get('/:id/url', requireAuth, media.url);
