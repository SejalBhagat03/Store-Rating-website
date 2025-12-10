import { z } from "zod";

// Name validation: 20-60 characters
export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(60, "Name must be less than 60 characters")
  .trim();

// Address validation: max 400 characters
export const addressSchema = z
  .string()
  .max(400, "Address must be less than 400 characters")
  .trim()
  .optional();

// Password validation: 8-16 chars, 1 uppercase, 1 special symbol
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(16, "Password must be less than 16 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character");

// Email validation
export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .trim()
  .toLowerCase();

// Role validation
export const roleSchema = z.enum(["admin", "user", "owner"]);

// Rating validation
export const ratingSchema = z.number().min(1).max(5);

// Full signup schema
export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
  role: roleSchema,
});

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// Update password schema
export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Store schema
export const storeSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
});

// User creation schema (admin)
export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
  role: roleSchema,
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
export type StoreFormData = z.infer<typeof storeSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type Role = z.infer<typeof roleSchema>;
