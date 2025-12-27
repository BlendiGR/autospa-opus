"use server";

import { prisma } from "@/prisma/prisma";
import crypto from "crypto";

/**
 * Verifies the 6-digit password reset code entered by the user.
 *
 * @param email - The email address of the user
 * @param code - The 6-digit verification code
 * @returns Object with success status, optional resetToken, and message
 */
export async function verifyResetCode(email: string, code: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { success: false, message: "Invalid code or email." };
  }

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      token: code,
      expiresAt: { gt: new Date() },
    },
  });

  if (!resetToken) {
    return { success: false, message: "Invalid or expired code." };
  }

  const uuidToken = crypto.randomUUID();

  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { resetToken: uuidToken },
  });

  return {
    success: true,
    resetToken: uuidToken,
    message: "Code verified successfully.",
  };
}
