import { Router } from 'express';
import { P } from '../config/permissions.js';
import { crudRouter } from '../controllers/crud.factory.js';
import * as engagement from '../controllers/engagement.controller.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';
import { formLimiter } from '../middleware/rateLimit.js';
import {
  companyFilterSchema,
  companySchema,
  companyUpdateSchema,
  opportunityFilterSchema,
  opportunitySchema,
  opportunityUpdateSchema,
} from '../validators/admin.validators.js';

const companies = requirePermission(P.companiesManage);

export const companyRoutes = Router();
companyRoutes.get('/partners', engagement.listPublicPartners);
companyRoutes.use(
  crudRouter({
    delegate: prisma.company,
    entity: 'Company',
    permission: P.companiesManage,
    createSchema: companySchema,
    updateSchema: companyUpdateSchema,
    searchFields: ['name', 'industry', 'contactName'],
    sortable: ['name', 'createdAt', 'status'],
    filterSchema: companyFilterSchema,
    filters: (f) => (f.status ? { status: f.status } : {}),
    include: { _count: { select: { opportunities: true, inquiries: true } } },
  }),
);

export const inquiryRoutes = Router();
inquiryRoutes.post('/', formLimiter, engagement.submitInquiry);
inquiryRoutes.get('/', companies, engagement.listInquiries);
inquiryRoutes.get('/:id', companies, engagement.getInquiry);
inquiryRoutes.patch('/:id', companies, engagement.updateInquiry);
inquiryRoutes.post('/:id/interactions', companies, engagement.addInteraction);
inquiryRoutes.post('/:id/convert', companies, engagement.convertInquiry);

export const opportunityRoutes = Router();
opportunityRoutes.get('/available', requireAuth, engagement.availableOpportunities);
opportunityRoutes.use(
  crudRouter({
    delegate: prisma.opportunity,
    entity: 'Opportunity',
    permission: P.companiesManage,
    createSchema: opportunitySchema,
    updateSchema: opportunityUpdateSchema,
    searchFields: ['title', 'description'],
    sortable: ['createdAt', 'deadline', 'title', 'status'],
    filterSchema: opportunityFilterSchema,
    filters: (f) => ({ ...(f.status ? { status: f.status } : {}), ...(f.audience ? { audience: f.audience } : {}) }),
    include: { company: { select: { id: true, name: true } } },
  }),
);

export const contactRoutes = Router();
const contact = requirePermission(P.contactManage);
contactRoutes.post('/', formLimiter, engagement.submitContact);
contactRoutes.get('/', contact, engagement.listContact);
contactRoutes.patch('/:id', contact, engagement.updateContact);
contactRoutes.delete('/:id', contact, engagement.deleteContact);
