import { useMemo, useState } from "react";

type UseSearchProps<T extends object> = {
    items: T[];
    searchBy: readonly (keyof T)[];
};

export const useSearch = <T extends object>({
    items,
    searchBy,
}: UseSearchProps<T>) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredItems = useMemo(() => {
        const normalizedSearchTerm = searchTerm.trim().toLowerCase();

        if (!normalizedSearchTerm || searchBy.length === 0) {
            return items;
        }

        return items.filter((item) =>
            searchBy.some((key) => {
                const value = item[key];

                return String(value ?? "")
                    .toLowerCase()
                    .includes(normalizedSearchTerm);
            }),
        );
    }, [items, searchTerm, searchBy]);

    return {
        searchTerm,
        setSearchTerm,
        filteredItems,
    };
};
