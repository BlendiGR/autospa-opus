import "server-only";
import { auth } from "@/auth";

/**
 * Checks if the user is authenticated.
 * Use at the start of server actions to protect them.
 *
 * @throws Error if user is not authenticated
 * @returns The authenticated session
 *
 * @example
 * ```ts
 * export async function myServerAction() {
 *   const session = await requireAuth();
 *   // ... rest of your action, session is guaranteed
 * }
 * ```
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session;
}
