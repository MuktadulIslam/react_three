import { Search, ExternalLink, Download, Heart, Eye, X, Play } from 'lucide-react';
import { SketchfabModel } from './types';

interface ModelViewerProps {
    model: SketchfabModel;
    handleDownloadModel: (model: SketchfabModel) => void;
    closeViewer: () => void;
}

export default function ModelViewer({ model, handleDownloadModel, closeViewer }: ModelViewerProps) {
    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-6 py-2 border-b">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 truncate">
                                {model.name || 'Untitled Model'}
                            </h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleDownloadModel(model)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                                title="Download Model"
                            >
                                <Download size={18} />
                                Download
                            </button>
                            <button
                                onClick={closeViewer}
                                className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors duration-200"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* 3D Viewer */}
                    <div className="flex-1 relative">
                        <iframe
                            src={`https://sketchfab.com/models/${model.uid}/embed?autostart=1&ui_theme=dark&dnt=1`}
                            className="w-full h-full border-0"
                            allowFullScreen
                            allow="autoplay; fullscreen; xr-spatial-tracking"
                            title={model.name || 'Untitled Model'}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}