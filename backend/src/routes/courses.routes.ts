import { Router } from 'express';
import { P } from '../config/permissions.js';
import { crudRouter } from '../controllers/crud.factory.js';
import * as courses from '../controllers/courses.controller.js';
import { prisma } from '../lib/prisma.js';
import { requirePermission } from '../middleware/auth.js';
import { categorySchema, materialFilterSchema, materialSchema } from '../validators/admin.validators.js';

export const courseRoutes = Router();
const manage = requirePermission(P.coursesManage);

// Admin routes are registered first so "/admin" is never treated as a slug.
courseRoutes.get('/admin', manage, courses.adminList);
courseRoutes.post('/admin', manage, courses.adminCreate);
courseRoutes.post('/admin/reorder', manage, courses.adminReorder);
courseRoutes.get('/admin/:id', manage, courses.adminGet);
courseRoutes.put('/admin/:id', manage, courses.adminUpdate);
courseRoutes.post('/admin/:id/status', manage, courses.adminSetStatus);
courseRoutes.delete('/admin/:id', manage, courses.adminDelete);

courseRoutes.get('/', courses.listPublic);
courseRoutes.get('/:slug', courses.getPublic);

export const courseCategoryRoutes = crudRouter({
  delegate: prisma.courseCategory,
  entity: 'CourseCategory',
  permission: P.coursesManage,
  createSchema: categorySchema,
  updateSchema: categorySchema.partial(),
  searchFields: ['nameEn', 'slug'],
  sortable: ['sortOrder', 'nameEn', 'createdAt'],
  defaultSort: 'sortOrder',
  defaultOrder: 'asc',
  include: { _count: { select: { courses: true } } },
});

export const learningMaterialRoutes = crudRouter({
  delegate: prisma.learningMaterial,
  entity: 'LearningMaterial',
  permission: P.coursesManage,
  createSchema: materialSchema,
  updateSchema: materialSchema.partial(),
  searchFields: ['title'],
  sortable: ['sortOrder', 'title', 'createdAt'],
  defaultSort: 'sortOrder',
  defaultOrder: 'asc',
  filterSchema: materialFilterSchema,
  filters: (f) => (f.courseId ? { courseId: f.courseId } : {}),
});
