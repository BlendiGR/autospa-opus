"use client";

import TyreCard from "./tyreCard";
import { useSearchParams } from "next/navigation";
import { useTyre } from "@/hooks";
import Pagination from "../ui/pagination";
import { useTranslations } from "next-intl";
import { Spinner } from "../ui/Spinner";
import { useToggleTyreStatus } from "@/hooks";

export default function TyreCardSection() {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");
    const page = Number(searchParams.get("page")) || 1;
    const isStored = searchParams.get("stored") !== "false";
    const t = useTranslations('Dashboard');
    
    const { tyres, pagination, loading } = useTyre(query, page, isStored);
    const { toggle, loading: toggleLoading } = useToggleTyreStatus();

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loading ? (
                    <div className="col-span-full flex justify-center py-12">
                        <Spinner size={32} spinColor="#3b82f6" />
                    </div>
                ) : tyres.length === 0 ? (
                    <p>{t('noTyresFound')}</p>
                ) : (
                    tyres.map((tyre) => (
                        <TyreCard 
                            key={tyre.id}
                            id={tyre.id}
                            customerName={tyre.customer?.name}
                            plate={tyre.plate}
                            number={tyre.number}
                            location={tyre.location ?? undefined}
                            dateStored={tyre.dateStored}
                            deletedAt={tyre.deletedAt}
                            isStored={tyre.isStored}
                            onToggleStatus={() => toggle(tyre.id)}
                        />
                    ))
                )}
            </div>
            
            {!loading && tyres.length > 0 && (
                <Pagination 
                    currentPage={pagination.currentPage} 
                    totalPages={pagination.totalPages} 
                />
            )}
        </div>
    );
}
