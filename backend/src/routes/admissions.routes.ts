import { Router } from 'express';
import { P } from '../config/permissions.js';
import * as applications from '../controllers/applications.controller.js';
import * as students from '../controllers/students.controller.js';
import * as training from '../controllers/training.controller.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';
import { formLimiter } from '../middleware/rateLimit.js';

export const applicationRoutes = Router();
const admissions = requirePermission(P.applicationsManage);
applicationRoutes.post('/', formLimiter, applications.submit);
applicationRoutes.get('/mine', requireAuth, applications.mine);
applicationRoutes.get('/', admissions, applications.list);
applicationRoutes.get('/:id', admissions, applications.get);
applicationRoutes.patch('/:id/status', admissions, applications.updateStatus);
applicationRoutes.post('/:id/notes', admissions, applications.addNote);
applicationRoutes.post('/:id/onboard', admissions, applications.onboard);

export const studentRoutes = Router();
const viewStudents = requirePermission(P.studentsManage, P.trainingManage);
studentRoutes.get('/me', requireAuth, students.me);
studentRoutes.patch('/me', requireAuth, students.updateMe);
studentRoutes.get('/', viewStudents, students.list);
studentRoutes.get('/:id', viewStudents, students.get);
studentRoutes.patch('/:id', requirePermission(P.studentsManage), students.update);

const manage = requirePermission(P.trainingManage);
const teachOrManage = requirePermission(P.trainingManage, P.trainingTeach);

export const batchRoutes = Router();
batchRoutes.get('/teachers', manage, training.listTeachers);
batchRoutes.get('/', teachOrManage, training.listBatches);
batchRoutes.post('/', manage, training.createBatch);
batchRoutes.get('/:id', teachOrManage, training.getBatch);
batchRoutes.patch('/:id', manage, training.updateBatch);
batchRoutes.delete('/:id', manage, training.deleteBatch);
batchRoutes.put('/:id/teachers', manage, training.setTeachers);

export const enrollmentRoutes = Router();
enrollmentRoutes.get('/', teachOrManage, training.listEnrollments);
enrollmentRoutes.post('/', manage, training.createEnrollment);
enrollmentRoutes.patch('/:id', teachOrManage, training.updateEnrollment);

export const attendanceRoutes = Router();
attendanceRoutes.get('/', teachOrManage, training.getAttendance);
attendanceRoutes.put('/', teachOrManage, training.saveAttendance);

export const assessmentRoutes = Router();
assessmentRoutes.get('/', teachOrManage, training.listAssessments);
assessmentRoutes.post('/', teachOrManage, training.createAssessment);
assessmentRoutes.patch('/:id', teachOrManage, training.updateAssessment);
assessmentRoutes.delete('/:id', teachOrManage, training.deleteAssessment);

export const resultRoutes = Router();
resultRoutes.get('/', teachOrManage, training.getResults);
resultRoutes.put('/', teachOrManage, training.saveResults);

export const certificateRoutes = Router();
const certs = requirePermission(P.certificatesManage);
certificateRoutes.get('/', certs, training.listCertificates);
certificateRoutes.post('/', certs, training.createCertificate);
certificateRoutes.post('/:id/approve', certs, training.certificateAction('approve'));
certificateRoutes.post('/:id/issue', certs, training.certificateAction('issue'));
certificateRoutes.post('/:id/revoke', certs, training.certificateAction('revoke'));
