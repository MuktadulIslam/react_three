'use client';

import { useEffect, useRef, useState } from "react";
import { SketchfabResponse } from "../types";
import { useGetSketchfabModels } from "./useSketchfabModels";

const initialResponseData: SketchfabResponse = {
    results: [],
    next: null,
    previous: null,
    count: 0
};

export function useSearchBarUtils() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const hasSearched = useRef<boolean>(false);
    const lastSearchQuery = useRef<string>('');
    const { data, isLoading, error, isError, refetch } = useGetSketchfabModels(searchQuery, currentPageNumber);
    const [response, setResponse] = useState<SketchfabResponse>(initialResponseData);

    useEffect(() => {
        if (data) {
            setResponse((response) => {
                return {
                    next: data.next,
                    previous: data.previous,
                    count: data.count,
                    results: [...response.results, ...data.results]
                };
            });
            setIsSearching(false);
        }
    }, [data]);

    useEffect(() => {
        if (isLoading && searchQuery) {
            setIsSearching(true);
        } else if (!isLoading) {
            setIsSearching(false);
        }
    }, [isLoading, searchQuery]);

    useEffect(() => {
        if (isError) {
            setIsSearching(false);
        }
    }, [isError]);

    const searchModels = async (newQuery: string) => {
        if (!newQuery.trim()) return;

        setIsSearching(true);

        if (newQuery !== searchQuery) {
            setCurrentPageNumber(1);
            setResponse(initialResponseData);
            lastSearchQuery.current = newQuery;
        }

        hasSearched.current = true;
        setSearchQuery(newQuery);
        refetch();
    };

    const shouldShowNoResults = hasSearched.current &&
        !isSearching &&
        !isLoading &&
        response.results.length === 0 &&
        !isError &&
        searchQuery.trim() !== '';

    return {
        isLoading,
        error,
        isSearching,
        searchModels,
        models: response.results,
        nextUrl: response.next,
        previousUrl: response.previous,
        count: response.count,
        currentQuery: searchQuery,
        shouldShowNoResults,
        setCurrentPageNumber
    };
}