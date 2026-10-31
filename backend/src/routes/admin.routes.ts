import { Router } from 'express';
import { P } from '../config/permissions.js';
import * as users from '../controllers/users.controller.js';
import * as cms from '../controllers/cms.controller.js';
import { requirePermission } from '../middleware/auth.js';

export const userRoutes = Router();
const manageUsers = requirePermission(P.usersManage);
userRoutes.get('/', manageUsers, users.listUsers);
userRoutes.post('/', manageUsers, users.createUser);
userRoutes.get('/:id', manageUsers, users.getUser);
userRoutes.patch('/:id', manageUsers, users.updateUser);
userRoutes.post('/:id/revoke-sessions', manageUsers, users.revokeUserSessions);
userRoutes.post('/:id/invite', manageUsers, users.resendInvite);
userRoutes.delete('/:id', manageUsers, users.deleteUser);

export const roleRoutes = Router();
const manageRoles = requirePermission(P.rolesManage);
roleRoutes.get('/', requirePermission(P.rolesManage, P.usersManage), users.listRoles);
roleRoutes.get('/permissions', manageRoles, users.listPermissions);
roleRoutes.post('/', manageRoles, users.createRole);
roleRoutes.put('/:id/permissions', manageRoles, users.setRolePermissions);
roleRoutes.delete('/:id', manageRoles, users.deleteRole);

export const auditRoutes = Router();
auditRoutes.get('/', requirePermission(P.auditRead), cms.auditLogs);

export const dashboardRoutes = Router();
dashboardRoutes.get('/', requirePermission(P.dashboardView), cms.dashboard);
