import type { Employee } from "@/types/employee";
import { useState } from "react";
import { searchEmployees as search } from "@/service/employeeService";

export function useEmployeeSearch() {
    const [searchResults, setSearchResults] = useState<Employee[]>([]);
    const [searching, setSearching] = useState(false);

    const searchEmployees = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setSearching(true);

            // API call
            const response = await search(query);

            setSearchResults(response);
        } catch (err) {
            console.error('Search failed:', err);
        } finally {
            setSearching(false);
        }
    };

    const clearSearch = () => {
        setSearchResults([]);
    };

    return { searchEmployees, searchResults, searching, clearSearch };
};
