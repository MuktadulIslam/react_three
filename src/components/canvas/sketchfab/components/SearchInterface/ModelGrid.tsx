import { SketchfabModel } from "../../types";
import ModelCard from "./ModelCard";

interface ModelGridProps {
    models: SketchfabModel[];
    onModelSelect: (model: SketchfabModel) => void;
    onDownloadModel: (model: SketchfabModel) => void;
    onAddToSidebar: (model: SketchfabModel) => void;
    downloadingModelId?: string | null;
    addingToSidebarId?: string | null;
    addToSidebarProgress?: number;
    existingModelUids: string[];
}

export default function ModelGrid({
    models,
    onModelSelect,
    onDownloadModel,
    onAddToSidebar,
    downloadingModelId,
    addingToSidebarId,
    addToSidebarProgress = 0,
    existingModelUids
}: ModelGridProps) {
    return (
        <div className="grid grid-cols-3 gap-4 p-2">
            {models.map((model, index) => (
                <ModelCard
                    key={`${model.uid}-${index}`}
                    model={model}
                    onModelSelect={onModelSelect}
                    onDownloadModel={onDownloadModel}
                    onAddToSidebar={onAddToSidebar}
                    downloadingModelId={downloadingModelId}
                    addingToSidebarId={addingToSidebarId}
                    addToSidebarProgress={addToSidebarProgress}
                    isAlreadyInSidebar={existingModelUids.includes(model.uid)}
                />
            ))}
        </div>
    );
}