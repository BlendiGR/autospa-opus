"use server";

import { prisma } from "@/prisma/prisma";
import crypto from "crypto";

export async function verifyResetCode(email: string, code: string) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { success: false, message: "Invalid code or email." };
  }

  // Find the password reset token
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      token: code,
      expiresAt: { gt: new Date() }, // Not expired
    },
  });

  if (!resetToken) {
    return { success: false, message: "Invalid or expired code." };
  }

  // Generate UUID for the reset page
  const uuidToken = crypto.randomUUID();

  // Update the record with the UUID
  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { resetToken: uuidToken },
  });

  return { 
    success: true, 
    resetToken: uuidToken,
    message: "Code verified successfully." 
  };
}
