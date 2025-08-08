'use client';

import { useMemo } from "react";
import { SketchfabModel } from "../../types";
import SearchBar from "./SearchBar";
import ModelGrid from "./ModelGrid";
import SearchLoadingUtils from "./SearchLoadingUtils";
import { useSearchBarUtils } from "../../hooks/useSearchBarUtils";

interface SearchInterfaceProps {
    onModelSelect: (model: SketchfabModel) => void;
    onDownloadModel: (model: SketchfabModel) => void;
    onAddToSidebar: (model: SketchfabModel) => void;
    downloadingModelId?: string | null;
    addingToSidebarId?: string | null;
    addToSidebarProgress?: number;
    existingModelUids: string[];
}

export default function SearchInterface({
    onModelSelect,
    onDownloadModel,
    onAddToSidebar,
    downloadingModelId,
    addingToSidebarId,
    addToSidebarProgress = 0,
    existingModelUids
}: SearchInterfaceProps) {
    const {
        isLoading,
        isSearching,
        models,
        nextUrl,
        searchModels,
        currentQuery,
        shouldShowNoResults,
        setCurrentPageNumber
    } = useSearchBarUtils();

    const modelsGrid = useMemo(() => {
        if (models.length === 0) return null;

        return (
            <ModelGrid
                models={models}
                onModelSelect={onModelSelect}
                onDownloadModel={onDownloadModel}
                onAddToSidebar={onAddToSidebar}
                downloadingModelId={downloadingModelId}
                addingToSidebarId={addingToSidebarId}
                addToSidebarProgress={addToSidebarProgress}
                existingModelUids={existingModelUids}
            />
        );
    }, [
        models,
        onModelSelect,
        onDownloadModel,
        onAddToSidebar,
        downloadingModelId,
        addingToSidebarId,
        addToSidebarProgress,
        existingModelUids
    ]);

    return (
        <>
            <SearchBar
                onSearch={searchModels}
                currentQuery={currentQuery}
                isSearching={isSearching}
            />
            {modelsGrid}
            <SearchLoadingUtils
                hasNext={nextUrl !== null}
                isLoading={isLoading}
                modelsLength={models.length}
                shouldShowNoResults={shouldShowNoResults}
                isError={false}
                setCurrentPageNumber={setCurrentPageNumber}
            />
        </>
    );
}