import { ExternalLink, Download, Play, Plus } from 'lucide-react';
import { SketchfabModel } from '../../../types';

interface ModelCardActionsProps {
    model: SketchfabModel;
    onModelSelect: (model: SketchfabModel) => void;
    onDownloadModel: (model: SketchfabModel) => void;
    onAddToSidebar: (model: SketchfabModel) => void;
    isThisModelDownloading: boolean;
    isThisModelAddingToSidebar: boolean;
    isAlreadyInSidebar: boolean;
}

export default function ModelCardActions({
    model,
    onModelSelect,
    onDownloadModel,
    onAddToSidebar,
    isThisModelDownloading,
    isThisModelAddingToSidebar,
    isAlreadyInSidebar
}: ModelCardActionsProps) {
    return (
        <div className="flex gap-1">
            <button
                onClick={() => onModelSelect(model)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-2 rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 text-center text-xs font-medium flex items-center justify-center gap-1"
            >
                <Play size={12} />
                View
            </button>

            <button
                onClick={() => onAddToSidebar(model)}
                className={`w-8 aspect-square rounded-lg transition-all duration-300 text-xs font-medium flex items-center justify-center gap-1 ${isAlreadyInSidebar
                    ? 'bg-green-600/50 text-green-200 cursor-not-allowed border border-green-500/50'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                    }`}
                title={isAlreadyInSidebar ? "Already in Sidebar" : "Add to Sidebar"}
                disabled={isThisModelAddingToSidebar || isAlreadyInSidebar}
            >
                {isAlreadyInSidebar ? (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                ) : isThisModelAddingToSidebar ? (
                    <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <Plus size={12} />
                )}
            </button>

            <button
                onClick={() => onDownloadModel(model)}
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white w-8 aspect-square rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-xs font-medium flex items-center justify-center gap-1"
                title="Download Model"
                disabled={isThisModelDownloading}
            >
                {isThisModelDownloading ? (
                    <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <Download size={12} />
                )}
            </button>

            <a
                href={model.viewerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white w-8 aspect-square rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 text-xs font-medium flex items-center justify-center gap-1"
            >
                <ExternalLink size={12} />
            </a>
        </div>
    );
}