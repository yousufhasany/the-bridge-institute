import { Router } from 'express';
import * as auth from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';

export const authRoutes = Router();

authRoutes.get('/csrf', auth.csrf);
authRoutes.get('/me', auth.me);
authRoutes.patch('/me', requireAuth, auth.updateMe);
authRoutes.post('/login', authLimiter, auth.login);
authRoutes.post('/logout', auth.logout);
authRoutes.post('/register', authLimiter, auth.register);
authRoutes.post('/forgot-password', authLimiter, auth.forgotPassword);
authRoutes.post('/reset-password', authLimiter, auth.resetPassword);
authRoutes.post('/change-password', requireAuth, authLimiter, auth.changePassword);
