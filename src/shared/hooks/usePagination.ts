import { useCallback, useMemo, useState } from "react";

type UsePaginationParams<T> = {
    items: T[];
    initialPage?: number;
    perPage?: number;
};

export function usePagination<T>({
    items,
    initialPage = 1,
    perPage = 10,
}: UsePaginationParams<T>) {
    const normalizedPerPage = Math.max(1, perPage);
    const [page, setPage] = useState(Math.max(1, initialPage));

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / normalizedPerPage));
    const currentPage = Math.min(page, totalPages);

    const handlePageChange = useCallback(
        (newPage: number) => {
            const validPage = Math.min(
                Math.max(newPage, 1),
                totalPages,
            );

            setPage(validPage);
        },
        [totalPages],
    );

    const nextPage = useCallback(() => {
        setPage((current) => Math.min(current + 1, totalPages));
    }, [totalPages]);

    const previousPage = useCallback(() => {
        setPage((current) => Math.max(current - 1, 1));
    }, []);

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * normalizedPerPage;
        const endIndex = startIndex + normalizedPerPage;

        return items.slice(startIndex, endIndex);
    }, [currentPage, items, normalizedPerPage]);

    return {
        page: currentPage,
        perPage: normalizedPerPage,
        total,
        totalPages,
        paginatedItems,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        nextPage,
        previousPage,
        handlePageChange,
    };
}
