/**
 * Standardized server action result types.
 *
 * All server actions should return ActionResult<T> for consistent error handling.
 */

/** Success result with typed data */
export type ActionSuccess<T> = { success: true; data: T };

/** Error result with message */
export type ActionError = { success: false; error: string };

/** Unified action result type - discriminated union for type-safe handling */
export type ActionResult<T> = ActionSuccess<T> | ActionError;
