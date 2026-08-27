import { useCallback, useState } from "react";
import { PaginationContext } from "./PaginationContext";
import type { PaginationProviderProps } from "./PaginationContext.type";

export function PaginationProvider({
    children,
    initialPage = 1,
    initialPerPage = 10 }: PaginationProviderProps) {

    const [page, setPage] = useState(initialPage);
    const [perPage, setPerPage] = useState(initialPerPage);
    const [total, setTotal] = useState(0)

    const totalPages = Math.ceil(total / perPage) || 1;

    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;


    const handlePageChange = useCallback(
        (newPage: number) => {
            if (newPage < 1 || newPage > totalPages) return;
            setPage(newPage);
        },
        [totalPages]
    );

    const nextPage = useCallback(() => {
        handlePageChange(page + 1);
    }, [page, handlePageChange]);

    const previousPage = useCallback(() => {
        handlePageChange(page - 1);
    }, [page, handlePageChange]);

    return (
        <PaginationContext.Provider
            value={{
                page,
                perPage,
                total,
                totalPages,
                hasNextPage,
                hasPreviousPage,
                setPage,
                setPerPage,
                setTotal,
                nextPage,
                previousPage,
                handlePageChange,
            }}
        >
            {children}
        </PaginationContext.Provider>
    );

}