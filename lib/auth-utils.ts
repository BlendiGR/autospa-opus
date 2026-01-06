import "server-only";
import { auth } from "@/auth";

/**
 * Use at the start of server actions to protect them.
 * @throws Error if user is not authenticated
 * @returns The authenticated session
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session;
}
