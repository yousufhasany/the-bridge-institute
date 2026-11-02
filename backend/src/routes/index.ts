import { Router } from 'express';
import { isProduction } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { auditRoutes, dashboardRoutes, roleRoutes, userRoutes } from './admin.routes.js';
import {
  applicationRoutes,
  assessmentRoutes,
  attendanceRoutes,
  batchRoutes,
  certificateRoutes,
  enrollmentRoutes,
  resultRoutes,
  studentRoutes,
} from './admissions.routes.js';
import { alumniAdminRoutes, alumniRoutes } from './alumni.routes.js';
import { authRoutes } from './auth.routes.js';
import { cmsRoutes, faqRoutes, mediaRoutes, settingsRoutes } from './cms.routes.js';
import { courseCategoryRoutes, courseRoutes, learningMaterialRoutes } from './courses.routes.js';
import { companyRoutes, contactRoutes, inquiryRoutes, opportunityRoutes } from './engagement.routes.js';

export const apiRouter = Router();

/** Liveness + database reachability. Reveals no configuration or version details. */
apiRouter.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ data: { status: 'ok', database: 'ok' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unreachable';
    const detail = message.replace(/postgres(?:ql)?:\/\/\S+/gi, 'postgresql://redacted').slice(0, 240);
    res.status(503).json({
      data: {
        status: 'degraded',
        database: 'unreachable',
        ...(!isProduction ? { detail } : {}),
      },
    });
  }
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/roles', roleRoutes);
apiRouter.use('/courses', courseRoutes);
apiRouter.use('/course-categories', courseCategoryRoutes);
apiRouter.use('/learning-materials', learningMaterialRoutes);
apiRouter.use('/applications', applicationRoutes);
apiRouter.use('/students', studentRoutes);
apiRouter.use('/batches', batchRoutes);
apiRouter.use('/enrollments', enrollmentRoutes);
apiRouter.use('/attendance', attendanceRoutes);
apiRouter.use('/assessments', assessmentRoutes);
apiRouter.use('/results', resultRoutes);
apiRouter.use('/certificates', certificateRoutes);
apiRouter.use('/companies', companyRoutes);
apiRouter.use('/partnership-inquiries', inquiryRoutes);
apiRouter.use('/opportunities', opportunityRoutes);
apiRouter.use('/contact', contactRoutes);
apiRouter.use('/alumni', alumniRoutes);
apiRouter.use('/admin/alumni', alumniAdminRoutes);
apiRouter.use('/admin/dashboard', dashboardRoutes);
apiRouter.use('/cms', cmsRoutes);
apiRouter.use('/faqs', faqRoutes);
apiRouter.use('/settings', settingsRoutes);
apiRouter.use('/audit-logs', auditRoutes);
apiRouter.use('/media', mediaRoutes);
