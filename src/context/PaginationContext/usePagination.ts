import { useContext } from "react";
import { PaginationContext } from "./PaginationContext";

export function usePagination() {
    const context = useContext(PaginationContext);

    if (!context) {
        throw new Error(
            "usePagination deve ser utilizado dentro de um PaginationProvider"
        );
    }

    return context;
}