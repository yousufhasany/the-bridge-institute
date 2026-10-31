import { z } from 'zod';
import { passwordSchemaRules } from '../services/auth.service.js';
import { email, optionalText } from '../utils/http.js';

export const password = z.string().min(passwordSchemaRules.min).max(passwordSchemaRules.max);
export const locale = z.enum(['en', 'bn']);

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(passwordSchemaRules.max),
});

export const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email,
  password,
  phone: optionalText(30),
  preferredLocale: locale.default('en'),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z.object({
  token: z.string().min(20).max(200),
  password,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(passwordSchemaRules.max),
  newPassword: password,
});

export const updateMeSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120),
    phone: optionalText(30),
    preferredLocale: locale,
  })
  .partial();
