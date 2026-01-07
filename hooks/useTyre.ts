import { useState, useCallback } from "react";
import { createTyre } from "@/app/actions/tyrehotel";
import { useLoading } from "./useLoading";
import type { TyreFormData } from "@/lib/schemas/tyreSchema";

/**
 * Provides functionality to create a new tyre storage record.
 */
export function useCreateTyre() {
  const { loading, withLoading } = useLoading(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (data: TyreFormData & { customerId?: number }) => {
      setError(null);
      return await withLoading(async () => {
        const result = await createTyre(data);
        if (!result.success) {
          setError(result.error ?? "Failed to create tyre");
        }
        return result;
      });
    },
    [withLoading]
  );

  return { create, loading, error };
}
