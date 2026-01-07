import { z } from "zod";
import { PASSWORD_REGEX } from "../constants";

/** Email-only validation for forgot password */
export const emailSchema = z.object({
  email: z.email("Invalid email address"),
});

/** 6-digit code validation for password reset verification */
export const resetCodeSchema = z.object({
  email: z.email("Invalid email address"),
  code: z.string().length(6, "Code must be 6 characters"),
});

/** Password with security requirements */
export const newPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(PASSWORD_REGEX, "Password must contain uppercase, number, and special character"),
});

/** Reset token validation */
export const resetTokenSchema = z.object({
  resetToken: z.string().uuid("Invalid reset token"),
});

export type EmailData = z.infer<typeof emailSchema>;
export type ResetCodeData = z.infer<typeof resetCodeSchema>;
export type NewPasswordData = z.infer<typeof newPasswordSchema>;
