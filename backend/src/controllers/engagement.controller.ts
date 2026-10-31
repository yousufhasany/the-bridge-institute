import type { Request, Response } from 'express';
import { P } from '../config/permissions.js';
import { prisma, Prisma } from '../lib/prisma.js';
import { currentUser, hasPermission } from '../middleware/auth.js';
import { audit } from '../services/audit.service.js';
import { ApiError, body, created, idParam, noContent, ok, orderBy, pageArgs, pageMeta, paginationSchema, parse } from '../utils/http.js';
import {
  contactFilterSchema,
  contactUpdateSchema,
  inquiryFilterSchema,
  inquiryUpdateSchema,
  interactionSchema,
} from '../validators/admin.validators.js';
import { contactSchema, partnershipInquirySchema } from '../validators/public.validators.js';

// ---------------------------------------------------------------------------
// Partnership inquiries
// ---------------------------------------------------------------------------
export async function submitInquiry(req: Request, res: Response) {
  const input = body(req, partnershipInquirySchema);
  const inquiry = await prisma.partnershipInquiry.create({
    data: {
      organizationName: input.organizationName,
      contactName: input.contactName,
      workEmail: input.workEmail,
      phone: input.phone,
      website: input.website,
      interest: input.interest,
      message: input.message,
      consentAt: new Date(),
    },
    select: { id: true, createdAt: true },
  });
  created(res, inquiry);
}

export async function listInquiries(req: Request, res: Response) {
  const p = parse(paginationSchema, req.query);
  const f = parse(inquiryFilterSchema, req.query);
  const where: Prisma.PartnershipInquiryWhereInput = {
    ...(f.status ? { status: f.status } : {}),
    ...(p.q
      ? { OR: [{ organizationName: { contains: p.q, mode: 'insensitive' } }, { contactName: { contains: p.q, mode: 'insensitive' } }, { workEmail: { contains: p.q, mode: 'insensitive' } }] }
      : {}),
  };
  const [items, total] = await Promise.all([
    prisma.partnershipInquiry.findMany({ where, orderBy: orderBy(p, ['createdAt', 'status', 'organizationName']), ...pageArgs(p), include: { company: { select: { id: true, name: true } } } }),
    prisma.partnershipInquiry.count({ where }),
  ]);
  ok(res, items, pageMeta(p, total));
}

export async function getInquiry(req: Request, res: Response) {
  const inquiry = await prisma.partnershipInquiry.findUnique({
    where: { id: idParam(req) },
    include: {
      company: { select: { id: true, name: true } },
      interactions: { orderBy: { occurredAt: 'desc' }, include: { author: { select: { fullName: true } } } },
    },
  });
  if (!inquiry) throw ApiError.notFound();
  ok(res, inquiry);
}

export async function updateInquiry(req: Request, res: Response) {
  const id = idParam(req);
  const input = body(req, inquiryUpdateSchema);
  const inquiry = await prisma.partnershipInquiry.update({ where: { id }, data: input });
  await audit(req, { action: 'inquiry.update', entityType: 'PartnershipInquiry', entityId: id, metadata: input });
  ok(res, inquiry);
}

export async function addInteraction(req: Request, res: Response) {
  const id = idParam(req);
  const input = body(req, interactionSchema);
  const inquiry = await prisma.partnershipInquiry.findUnique({ where: { id } });
  if (!inquiry) throw ApiError.notFound();
  const interaction = await prisma.partnershipInteraction.create({
    data: { inquiryId: id, companyId: inquiry.companyId, authorId: currentUser(req).id, type: input.type, note: input.note },
    include: { author: { select: { fullName: true } } },
  });
  created(res, interaction);
}

/** Creates a company record from an inquiry. Being a record does not imply an active partnership. */
export async function convertInquiry(req: Request, res: Response) {
  const id = idParam(req);
  const company = await prisma.$transaction(async (tx) => {
    const inquiry = await tx.partnershipInquiry.findUnique({ where: { id } });
    if (!inquiry) throw ApiError.notFound();
    if (inquiry.companyId) throw ApiError.conflict('This inquiry is already linked to a company');
    const company = await tx.company.create({
      data: {
        name: inquiry.organizationName,
        website: inquiry.website,
        contactName: inquiry.contactName,
        contactEmail: inquiry.workEmail,
        phone: inquiry.phone,
        status: 'PROSPECT',
      },
    });
    await tx.partnershipInquiry.update({ where: { id }, data: { companyId: company.id } });
    await audit(req, { action: 'inquiry.convert', entityType: 'PartnershipInquiry', entityId: id, metadata: { companyId: company.id } }, tx);
    return company;
  });
  created(res, company);
}

// ---------------------------------------------------------------------------
// Opportunities visible to signed-in students / alumni
// ---------------------------------------------------------------------------
export async function availableOpportunities(req: Request, res: Response) {
  const audiences: ('STUDENTS' | 'ALUMNI' | 'ALL')[] = [];
  if (hasPermission(req, P.studentSelf)) audiences.push('STUDENTS');
  if (hasPermission(req, P.alumniSelf)) audiences.push('ALUMNI');
  if (!audiences.length) throw ApiError.forbidden('Opportunities are available to enrolled students and verified alumni');
  audiences.push('ALL');
  const items = await prisma.opportunity.findMany({
    where: { status: 'PUBLISHED', audience: { in: audiences }, OR: [{ deadline: null }, { deadline: { gte: new Date() } }] },
    orderBy: [{ deadline: 'asc' }, { createdAt: 'desc' }],
    take: 100,
    select: {
      id: true,
      title: true,
      type: true,
      description: true,
      location: true,
      applyUrl: true,
      deadline: true,
      audience: true,
      company: { select: { name: true, website: true } },
    },
  });
  ok(res, items);
}

// ---------------------------------------------------------------------------
// Contact messages
// ---------------------------------------------------------------------------
export async function submitContact(req: Request, res: Response) {
  const input = body(req, contactSchema);
  const message = await prisma.contactMessage.create({
    data: { ...input, userId: req.auth?.id },
    select: { id: true, createdAt: true },
  });
  created(res, message);
}

export async function listContact(req: Request, res: Response) {
  const p = parse(paginationSchema, req.query);
  const f = parse(contactFilterSchema, req.query);
  const where: Prisma.ContactMessageWhereInput = {
    ...(f.isRead ? { isRead: f.isRead === 'true' } : {}),
    ...(f.category ? { category: f.category } : {}),
    ...(p.q
      ? { OR: [{ name: { contains: p.q, mode: 'insensitive' } }, { email: { contains: p.q, mode: 'insensitive' } }, { subject: { contains: p.q, mode: 'insensitive' } }] }
      : {}),
  };
  const [items, total] = await Promise.all([
    prisma.contactMessage.findMany({ where, orderBy: orderBy(p, ['createdAt', 'isRead']), ...pageArgs(p) }),
    prisma.contactMessage.count({ where }),
  ]);
  ok(res, items, pageMeta(p, total));
}

export async function updateContact(req: Request, res: Response) {
  const id = idParam(req);
  const { isRead } = body(req, contactUpdateSchema);
  const message = await prisma.contactMessage.update({ where: { id }, data: { isRead, readAt: isRead ? new Date() : null } });
  ok(res, message);
}

export async function deleteContact(req: Request, res: Response) {
  const id = idParam(req);
  await prisma.contactMessage.delete({ where: { id } });
  await audit(req, { action: 'contact.delete', entityType: 'ContactMessage', entityId: id });
  noContent(res);
}

/** Public partner names. Contact details, notes and prospects are never included. */
export async function listPublicPartners(_req: Request, res: Response) {
  const partners = await prisma.company.findMany({
    where: { listedPublicly: true, status: 'ACTIVE' },
    select: { name: true, industry: true, website: true },
    orderBy: { name: 'asc' },
  });
  res.set('Cache-Control', 'no-cache');
  ok(res, partners);
}
