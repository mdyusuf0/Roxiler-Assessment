const { z } = require('zod');

// ── Shared validation rules (same on frontend and backend) ──

const nameSchema = z
  .string()
  .min(20, 'Name must be at least 20 characters')
  .max(60, 'Name must be at most 60 characters');

const emailSchema = z
  .string()
  .email('Invalid email format');

const addressSchema = z
  .string()
  .max(400, 'Address must be at most 400 characters');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const ratingSchema = z
  .number()
  .int('Rating must be an integer')
  .min(1, 'Rating must be at least 1')
  .max(5, 'Rating must be at most 5');

const roleSchema = z.enum(['admin', 'user', 'store_owner']);

// ── Request body schemas ────────────────────

const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  role: roleSchema,
});

const createStoreSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  ownerId: z.number().int().positive().optional().nullable(),
});

const submitRatingSchema = z.object({
  rating: ratingSchema,
});

module.exports = {
  nameSchema,
  emailSchema,
  addressSchema,
  passwordSchema,
  ratingSchema,
  roleSchema,
  signupSchema,
  loginSchema,
  changePasswordSchema,
  createUserSchema,
  createStoreSchema,
  submitRatingSchema,
};
