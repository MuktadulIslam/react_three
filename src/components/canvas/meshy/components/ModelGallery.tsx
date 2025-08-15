"use client";

import React, { useState } from 'react';
import { Grid3X3, X, Download, Eye, ArrowLeftRight } from 'lucide-react';
import { Meshy3DObjectResponse } from '../types';
import { ModelViewer } from './ModelViewer';

interface ModelGalleryProps {
    models: Meshy3DObjectResponse[];
    onClose: () => void;
    onSelectModel: (model: Meshy3DObjectResponse) => void;
    onCompare: (models: Meshy3DObjectResponse[]) => void;
}

export default function ModelGallery({ models, onClose, onSelectModel, onCompare }: ModelGalleryProps) {
    const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
    const [isError, setIsError] = useState<boolean>(false);

    const handleModelSelect = (modelId: string) => {
        const newSelected = new Set(selectedModels);
        if (newSelected.has(modelId)) {
            newSelected.delete(modelId);
        } else {
            newSelected.add(modelId);
        }
        setSelectedModels(newSelected);
    };

    const handleDownload = (model: Meshy3DObjectResponse, format: 'glb' | 'fbx' | 'obj') => {
        const url = model.model_urls?.[format];
        if (url) {
            const link = document.createElement('a');
            link.href = url;
            link.download = `model-${model.id}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleCompareSelected = () => {
        const modelsToCompare = models.filter(m => selectedModels.has(m.id));
        if (modelsToCompare.length >= 2) {
            onCompare(modelsToCompare);
        }
    };

    const formatTimestamp = (timestamp?: number) => {
        if (!timestamp) return 'Unknown';
        return new Date(timestamp * 1000).toLocaleString();
    };

    if (models.length === 0) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-gray-900 rounded-xl border border-gray-600 p-8 text-center">
                    <div className="text-gray-400 text-4xl mb-4">📦</div>
                    <h2 className="text-white text-xl font-semibold mb-2">No Models Generated</h2>
                    <p className="text-gray-400 mb-4">Start a conversation to generate your first 3D model!</p>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        Close Gallery
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-600">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Grid3X3 size={20} className="text-purple-400" />
                        <h2 className="text-white font-semibold">Model Gallery</h2>
                        <span className="text-gray-400 text-sm">({models.length} models)</span>
                    </div>

                    {selectedModels.size > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-300">
                                {selectedModels.size} selected
                            </span>
                            {selectedModels.size >= 2 && (
                                <button
                                    onClick={handleCompareSelected}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg text-sm transition-colors"
                                >
                                    <ArrowLeftRight size={14} />
                                    Compare
                                </button>
                            )}
                            <button
                                onClick={() => setSelectedModels(new Set())}
                                className="px-3 py-1.5 bg-gray-600/50 hover:bg-gray-600/70 text-gray-200 rounded-lg text-sm transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Gallery Content */}
            <div className="flex-1 overflow-auto p-4">
                <div className="grid grid-cols-3 gap-4">
                    {models.map((model, index) => (
                        <div
                            key={model.id}
                            className={`bg-gray-800 rounded-lg border transition-all duration-200 ${selectedModels.has(model.id)
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-gray-600 hover:border-gray-500'
                                }`}
                        >
                            {/* Model Viewer */}
                            <div className="relative">
                                <ModelViewer
                                    modelUrl={model.model_urls?.glb}
                                    hideHeader={true}
                                    setIsError={setIsError}
                                    className={'h-[250px] w-full'}
                                />

                                {/* Selection Checkbox */}
                                <button
                                    onClick={() => handleModelSelect(model.id)}
                                    className={`absolute top-2 left-2 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${selectedModels.has(model.id)
                                        ? 'bg-blue-500 border-blue-500 text-white'
                                        : 'bg-black/50 border-gray-400 hover:border-blue-400'
                                        }`}
                                >
                                    {selectedModels.has(model.id) && '✓'}
                                </button>
                            </div>

                            {/* Model Info */}
                            <div className="p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-white font-medium text-sm">
                                        Model {index + 1}
                                    </h3>
                                    <span className="text-xs text-gray-400">
                                        {model.id.slice(0, 8)}
                                    </span>
                                </div>

                                <div className="text-xs text-gray-400">
                                    {formatTimestamp(model.created_at)}
                                </div>

                                {/* Progress Bar */}
                                {model.progress !== undefined && model.progress < 100 && (
                                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                                        <div
                                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                            style={{ width: `${model.progress}%` }}
                                        ></div>
                                    </div>
                                )}

                                {/* Actions */}
                                {!isError &&
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => onSelectModel(model)}
                                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded text-xs transition-colors"
                                        >
                                            <Eye size={10} />
                                            View
                                        </button>

                                        {model.model_urls?.glb && (
                                            <button
                                                onClick={() => handleDownload(model, 'glb')}
                                                className="px-2 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-200 rounded text-xs transition-colors"
                                                title="Download GLB"
                                            >
                                                <Download size={10} />
                                            </button>
                                        )}
                                    </div>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-900 border-t border-gray-600">
                <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>💡 Select multiple models to compare them side by side</span>
                    <div className="flex items-center gap-2">
                        <span>{models.length} total models</span>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                        >
                            Close Gallery
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}