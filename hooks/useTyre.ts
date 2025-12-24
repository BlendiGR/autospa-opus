import { useState, useEffect, useCallback } from "react";
import { fetchTyres, tyreCounts, createTyre, toggleTyreStatus } from "@/app/actions/tyrehotel";
import { useLoading } from "./useLoading";
import type { TyreFormData } from "@/lib/schemas/tyreSchema";

type FetchResult = Awaited<ReturnType<typeof fetchTyres>>;
type Tyre = FetchResult["tyres"][number];
type Pagination = FetchResult["pagination"];
type TyreCounts = Awaited<ReturnType<typeof tyreCounts>>;

export function useTyre(query: string | null, page: number = 1, isStored?: boolean) {
    const [tyres, setTyres] = useState<Tyre[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const { loading, withLoading } = useLoading(true);

    useEffect(() => {
        withLoading(async () => {
            const result = await fetchTyres(query, page, isStored);
            setTyres(result.tyres);
            setPagination(result.pagination);
        });
    }, [query, page, isStored, withLoading]);

    return { tyres, pagination, loading };
}

export function useTyreCounts() {
    const [counts, setCounts] = useState<TyreCounts>({ countsByLocation: [], total: 0 });
    const { loading, withLoading } = useLoading(true);

    useEffect(() => {
        withLoading(async () => {
            const result = await tyreCounts();
            setCounts(result);
        });
    }, [withLoading]);

    return { counts, loading };
}

export function useCreateTyre() {
    const { loading, withLoading } = useLoading(false);
    const [error, setError] = useState<string | null>(null);

    const create = useCallback(async (data: TyreFormData) => {
        setError(null);
        return await withLoading(async () => {
            const result = await createTyre(data);
            if (!result.success) {
                setError(result.error ?? 'Failed to create tyre');
            }
            return result;
        });
    }, [withLoading]);

    return { create, loading, error };
}

export function useToggleTyreStatus() {
    const { loading, withLoading } = useLoading(false);
    const [error, setError] = useState<string | null>(null);

    const toggle = useCallback(async (id: number) => {
        setError(null);
        return await withLoading(async () => {
            const result = await toggleTyreStatus(id);
            if (!result.success) {
                setError(result.error ?? 'Failed to toggle tyre status');
            }
            return result;
        });
    }, [withLoading]);

    return { toggle, loading, error };
}