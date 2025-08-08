import { Download, X, Plus } from 'lucide-react';
import { SketchfabModel } from '../../types';

interface ModelViewerHeaderProps {
    model: SketchfabModel;
    handleAddToSidebar?: (model: SketchfabModel) => void;
    handleDownloadModel: (model: SketchfabModel) => void;
    closeViewer: () => void;
    isThisModelAddingToSidebar: boolean;
    isAlreadyInSidebar: boolean;
}

export default function ModelViewerHeader({
    model,
    handleAddToSidebar,
    handleDownloadModel,
    closeViewer,
    isThisModelAddingToSidebar,
    isAlreadyInSidebar
}: ModelViewerHeaderProps) {
    return (
        <div className="flex items-center justify-between px-6 py-2 border-b border-white">
            <div className="flex-1">
                <h2 className="text-2xl font-bold text-white truncate">
                    {model.name || 'Untitled Model'}
                </h2>
                {isAlreadyInSidebar && (
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-green-300 text-sm font-medium">Already in Sidebar</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 *:h-10 *:flex *:items-center *:justify-center">
                {handleAddToSidebar && (
                    <button
                        onClick={() => handleAddToSidebar(model)}
                        className={`w-32 rounded-lg flex items-center gap-2 transition-all duration-200 font-medium ${isAlreadyInSidebar
                            ? 'bg-green-600/50 text-green-200 cursor-not-allowed border border-green-500/50'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:shadow-lg'
                            }`}
                        title={isAlreadyInSidebar ? "Already in Sidebar" : "Add to Sidebar"}
                        disabled={isThisModelAddingToSidebar || isAlreadyInSidebar}
                    >
                        {isAlreadyInSidebar ? (
                            <>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Added</span>
                            </>
                        ) : isThisModelAddingToSidebar ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Adding...</span>
                            </>
                        ) : (
                            <>
                                <Plus size={18} />
                                <span>Sidebar</span>
                            </>
                        )}
                    </button>
                )}

                <button
                    onClick={() => handleDownloadModel(model)}
                    className="aspect-square bg-blue-500 hover:bg-blue-600 text-white rounded-lg gap-2 transition-colors duration-200 font-medium hover:shadow-lg"
                    title="Download Model"
                >
                    <Download size={18} />
                </button>

                <button
                    onClick={closeViewer}
                    className="aspect-square bg-gradient-to-br from-red-600 via-red-400 to-red-400/50 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}