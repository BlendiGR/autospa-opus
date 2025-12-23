import { useState, useEffect } from "react";
import { fetchTyres } from "@/app/actions/tyrehotel";

type FetchResult = Awaited<ReturnType<typeof fetchTyres>>;
type Tyre = FetchResult["tyres"][number];
type Pagination = FetchResult["pagination"];

export function useTyre(query: string | null, page: number = 1, isStored?: boolean) {
    const [tyres, setTyres] = useState<Tyre[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTyres = async () => {
            setLoading(true);
            const result = await fetchTyres(query, page, isStored);
            setTyres(result.tyres);
            setPagination(result.pagination);
            setLoading(false);
        };
        loadTyres();
    }, [query, page, isStored]);

    return { tyres, pagination, loading };
}