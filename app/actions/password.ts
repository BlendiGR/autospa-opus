"use server";

import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import crypto from "crypto";

import { prisma } from "@/prisma/prisma";
import { sendEmail } from "@/services/email";
import PasswordChangeCode from "@/components/emails/PasswordChangeCode";
import { RESET_TOKEN_EXPIRY_MS } from "@/lib/constants";
import { checkRateLimit } from "@/lib/ratelimit";
import { saltAndHashPassword } from "@/lib/utils/saltAndHashPassword";
import { emailSchema, resetCodeSchema, newPasswordSchema } from "@/lib/schemas/passwordSchema";
import type { ActionResult } from "@/lib/action-result";

/**
 * Generates a cryptographically secure 6-digit code.
 */
function generateSecureCode(): string {
  const code = crypto.randomInt(100000, 1000000);
  return code.toString();
}

type ForgotPasswordData = { message: string };

/**
 * Initiates the password reset flow for a user.
 * Rate limited to 5 requests per minute.
 */
export async function forgotPassword(email: string): Promise<ActionResult<ForgotPasswordData>> {
  try {
    const validated = emailSchema.safeParse({ email });
    if (!validated.success) {
      return { success: false, error: "Invalid email format" };
    }

    const limit = await checkRateLimit("auth");
    if (!limit.success) return { success: false, error: limit.error };

    const user = await prisma.user.findUnique({
      where: { email: validated.data.email },
    });

    if (!user) {
      // Don't reveal if email exists or not for security
      return {
        success: true,
        data: { message: "If the email exists, a reset code has been sent." },
      };
    }

    const code = generateSecureCode();
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

    await prisma.passwordResetToken.create({
      data: {
        token: code,
        userId: user.id,
        expiresAt: expiresAt,
      },
    });

    const store = await cookies();
    const locale = store.get("locale")?.value || "en";

    const t = await getTranslations({ locale, namespace: "PasswordEmail" });

    await sendEmail({
      to: validated.data.email,
      subject: "Password Reset Code - AutoSpa Opus",
      component: PasswordChangeCode({
        name: user.name || "User",
        code,
        t,
      }),
    });

    return { success: true, data: { message: "Reset code sent to your email." } };
  } catch (error) {
    console.error("Failed to send reset email:", error);
    return { success: false, error: "Failed to send email. Please try again." };
  }
}

type VerifyResetCodeData = { resetToken: string; message: string };

/**
 * Verifies the 6-digit password reset code entered by the user.
 * Rate limited to 5 requests per minute.
 */
export async function verifyResetCode(
  email: string,
  code: string
): Promise<ActionResult<VerifyResetCodeData>> {
  try {
    const validated = resetCodeSchema.safeParse({ email, code });
    if (!validated.success) {
      return { success: false, error: "Invalid email or code format" };
    }

    const limit = await checkRateLimit("auth");
    if (!limit.success) return { success: false, error: limit.error };

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "Invalid code or email." };
    }

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        token: code,
        expiresAt: { gt: new Date() },
      },
    });

    if (!resetToken) {
      return { success: false, error: "Invalid or expired code." };
    }

    const uuidToken = crypto.randomUUID();

    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { resetToken: uuidToken },
    });

    return {
      success: true,
      data: {
        resetToken: uuidToken,
        message: "Code verified successfully.",
      },
    };
  } catch (error) {
    console.error("Failed to verify reset code:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

type ResetPasswordData = { message: string };

/**
 * Resets the user's password using a valid reset token.
 * Rate limited to 5 requests per minute.
 */
export async function resetPassword(
  resetToken: string,
  newPassword: string
): Promise<ActionResult<ResetPasswordData>> {
  try {
    const validated = newPasswordSchema.safeParse({ password: newPassword });
    if (!validated.success) {
      return { success: false, error: "Password does not meet requirements" };
    }

    const limit = await checkRateLimit("auth");
    if (!limit.success) return { success: false, error: limit.error };

    const tokenRecord = await prisma.passwordResetToken.findUnique({
      where: { resetToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      return { success: false, error: "Invalid reset token." };
    }

    if (tokenRecord.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({
        where: { id: tokenRecord.id },
      });
      return { success: false, error: "Reset token has expired." };
    }

    const hashedPassword = saltAndHashPassword(validated.data.password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({
        where: { id: tokenRecord.id },
      }),
    ]);

    return { success: true, data: { message: "Password reset successfully." } };
  } catch (error) {
    console.error("Failed to reset password:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

type ResetTokenData = { email: string; name: string | null };

/**
 * Validates a password reset token for page rendering.
 */
export async function validateResetToken(
  resetToken: string
): Promise<ActionResult<ResetTokenData>> {
  try {
    const tokenRecord = await prisma.passwordResetToken.findUnique({
      where: { resetToken },
      include: { user: { select: { email: true, name: true } } },
    });

    if (!tokenRecord) {
      return { success: false, error: "Invalid reset token" };
    }

    if (tokenRecord.expiresAt < new Date()) {
      return { success: false, error: "Reset token has expired" };
    }

    return {
      success: true,
      data: {
        email: tokenRecord.user.email ?? "",
        name: tokenRecord.user.name,
      },
    };
  } catch (error) {
    console.error("Failed to validate reset token:", error);
    return { success: false, error: "Failed to validate token" };
  }
}
