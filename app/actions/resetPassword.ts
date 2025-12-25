"use server";

import { prisma } from "@/prisma/prisma";
import { saltAndHashPassword } from "@/lib/utils/saltAndHashPassword";

export async function resetPassword(resetToken: string, newPassword: string) {
  // Find the password reset token record
  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { resetToken },
    include: { user: true },
  });

  if (!tokenRecord) {
    return { success: false, message: "Invalid reset token." };
  }

  // Check if token has expired
  if (tokenRecord.expiresAt < new Date()) {
    // Delete expired token
    await prisma.passwordResetToken.delete({
      where: { id: tokenRecord.id },
    });
    return { success: false, message: "Reset token has expired." };
  }

  const hashedPassword = saltAndHashPassword(newPassword);

  // Update user password and delete the token (transaction)
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

// Validate reset token (for page server-side check)
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
