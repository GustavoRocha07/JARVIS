import { useMemo, useState } from "react";


type UseSearchProps<T extends object> = {
    items: T[];
    searchBy: Array<keyof T>;
};
export const useSearch = <T extends object>({ items, searchBy }: UseSearchProps<T>) => {

    const [searchTerm, setSearchTerm] = useState("")


    const filteredItems = useMemo(() => {
        if (!searchTerm.trim() || searchBy.length === 0) return items;

        return items.filter((item) =>
            searchBy.some((key) => {
                const value = item[key];
                return String(value ?? "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            })
        );
    }, [items, searchTerm, searchBy]);


    return {
        searchTerm,
        setSearchTerm,
        filteredItems,
    };

}