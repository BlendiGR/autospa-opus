"use server";

import { prisma } from "@/prisma/prisma";
import { saltAndHashPassword } from "@/lib/utils/saltAndHashPassword";

/**
 * Resets the user's password using a valid reset token.
 *
 * @param resetToken - The UUID token from the password reset URL
 * @param newPassword - The new password to set
 * @returns Object with success status and message
 */
export async function resetPassword(resetToken: string, newPassword: string) {
  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { resetToken },
    include: { user: true },
  });

  if (!tokenRecord) {
    return { success: false, message: "Invalid reset token." };
  }

  if (tokenRecord.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({
      where: { id: tokenRecord.id },
    });
    return { success: false, message: "Reset token has expired." };
  }

  const hashedPassword = saltAndHashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.delete({
      where: { id: tokenRecord.id },
    }),
  ]);

  return { success: true, message: "Password reset successfully." };
}

/**
 * Validates a password reset token for page rendering.
 *
 * @param resetToken - The UUID token from the password reset URL
 * @returns Object with validation status and user info
 */
export async function validateResetToken(resetToken: string) {
  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { resetToken },
    include: { user: { select: { email: true, name: true } } },
  });

  if (!tokenRecord) {
    return { valid: false, email: null };
  }

  if (tokenRecord.expiresAt < new Date()) {
    return { valid: false, email: null, expired: true };
  }

  return {
    valid: true,
    email: tokenRecord.user.email,
    name: tokenRecord.user.name,
  };
}
