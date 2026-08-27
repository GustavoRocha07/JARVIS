import type { PropsWithChildren } from "react";


export type PaginationContextValue = {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    setPage: (page: number) => void;
    setPerPage: (perPage: number) => void;
    setTotal: (total: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    handlePageChange: (newPage: number) => void;
}

export type PaginationProviderProps = PropsWithChildren<{
    initialPage?: number;
    initialPerPage?: number;
}>;