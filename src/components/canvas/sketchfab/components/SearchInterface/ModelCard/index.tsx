import { SketchfabModel } from '../../../types';
import ModelCardThumbnail from './ModelCardThumbnail';
import ModelCardActions from './ModelCardActions';
import ModelInfo from './ModelInfo';

interface ModelCardProps {
    model: SketchfabModel;
    onModelSelect: (model: SketchfabModel) => void;
    onDownloadModel: (model: SketchfabModel) => void;
    onAddToSidebar: (model: SketchfabModel) => void;
    downloadingModelId?: string | null;
    addingToSidebarId?: string | null;
    addToSidebarProgress?: number;
    isAlreadyInSidebar?: boolean;
}

export default function ModelCard({
    model,
    onModelSelect,
    onDownloadModel,
    onAddToSidebar,
    downloadingModelId,
    addingToSidebarId,
    addToSidebarProgress = 0,
    isAlreadyInSidebar = false
}: ModelCardProps) {
    const isThisModelDownloading = downloadingModelId === model.uid;
    const isThisModelAddingToSidebar = addingToSidebarId === model.uid;

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <ModelCardThumbnail
                model={model}
                isThisModelAddingToSidebar={isThisModelAddingToSidebar}
                addToSidebarProgress={addToSidebarProgress}
                isAlreadyInSidebar={isAlreadyInSidebar}
            />

            <div className="p-2">
                <ModelInfo model={model}/>

                <ModelCardActions
                    model={model}
                    onModelSelect={onModelSelect}
                    onDownloadModel={onDownloadModel}
                    onAddToSidebar={onAddToSidebar}
                    isThisModelDownloading={isThisModelDownloading}
                    isThisModelAddingToSidebar={isThisModelAddingToSidebar}
                    isAlreadyInSidebar={isAlreadyInSidebar}
                />
                <div className="text-gray-600 text-xs mt-2 text-center">
                    {formatDate(model.createdAt)}
                </div>
            </div>
        </div>
    );
}