"use client";

import React, { useState } from 'react';
import { X, ArrowLeftRight, Download } from 'lucide-react';
import { Meshy3DObjectResponse } from '../types';
import { ModelViewer } from './ModelViewer';

interface ModelComparisonProps {
    models: Meshy3DObjectResponse[];
    onClose: () => void;
}

export default function ModelComparison({ models, onClose }: ModelComparisonProps) {
    const [selectedModels, setSelectedModels] = useState<[number, number]>([0, Math.min(1, models.length - 1)]);
    const [isError, setIsError] = useState<boolean>(false);

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

    if (models.length < 2) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full h-auto max-w-6xl bg-gray-900 rounded-xl border border-gray-600 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-2 border-b border-gray-600">
                    <div className="flex items-center gap-2">
                        <ArrowLeftRight size={20} className="text-blue-400" />
                        <h2 className="text-white font-semibold">Compare Models</h2>
                        <span className="text-gray-400 text-sm">({models.length} models)</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Model Selection */}
                <div className="px-4 py-2 border-b border-gray-600 bg-gray-800/50">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Left Model</label>
                            <select
                                value={selectedModels[0]}
                                onChange={(e) => setSelectedModels([parseInt(e.target.value), selectedModels[1]])}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                            >
                                {models.map((model, index) => (
                                    <option key={model.id} value={index}>
                                        Model {index + 1} • {model.id.slice(0, 30)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Right Model</label>
                            <select
                                value={selectedModels[1]}
                                onChange={(e) => setSelectedModels([selectedModels[0], parseInt(e.target.value)])}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                            >
                                {models.map((model, index) => (
                                    <option key={model.id} value={index}>
                                        Model {index + 1} • {model.id.slice(0, 30)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Comparison View */}
                <div className="grid grid-cols-2 gap-2 p-2">
                    {/* Left Model */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-white font-medium">
                                Model {selectedModels[0] + 1}
                            </h3>
                            {!isError && models[selectedModels[0]].model_urls?.glb && (
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleDownload(models[selectedModels[0]], 'glb')}
                                        className="p-1.5 text-green-400 hover:bg-green-500/20 rounded text-xs"
                                        title="Download GLB"
                                    >
                                        <Download size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <ModelViewer
                            modelUrl={models[selectedModels[0]].model_urls?.glb ?? ''}
                            modelData={models[selectedModels[0]]}
                            showPreview={false}
                            setIsError={setIsError}
                        />
                    </div>

                    {/* Right Model */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-white font-medium">
                                Model {selectedModels[1] + 1}
                            </h3>
                            {!isError && models[selectedModels[1]].model_urls?.glb && (
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleDownload(models[selectedModels[1]], 'glb')}
                                        className="p-1.5 text-green-400 hover:bg-green-500/20 rounded text-xs"
                                        title="Download GLB"
                                    >
                                        <Download size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <ModelViewer
                            modelUrl={models[selectedModels[1]].model_urls?.glb ?? ''}
                            modelData={models[selectedModels[1]]}
                            showPreview={false}
                            setIsError={setIsError}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}