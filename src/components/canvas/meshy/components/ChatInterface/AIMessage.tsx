'use client';

import { Bot, Download, Sparkles } from 'lucide-react';
import { ChatMessage as ChatMessageType, Meshy3DObjectResponse } from '../../types';
import AddToSidebarButton from '../AddToSidebarButton';
import { ModelViewer } from '../ModelViewer';
import { useMeshyChat } from '../../context/MeshyChatContext';
import { useState } from 'react';

interface AIMessageProps {
    message: ChatMessageType;
    onAddToSidebar?: (modelData: {
        id: string;
        name: string;
        url: string;
        fileType: 'glb';
        model: Meshy3DObjectResponse;
    }) => void;
}

export default function AIMessage({ message, onAddToSidebar }: AIMessageProps) {
    const { current3DModel, setCurrentRefineModelData } = useMeshyChat();
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

    const formatTimestamp = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const needsRefinement = (model: Meshy3DObjectResponse): boolean => {
        return !model.texture_urls || model.texture_urls.length === 0;
    };

    return (
        <div className="flex gap-3 flex-row">
            {/* AI Avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                <Bot size={16} className="text-white" />
            </div>

            {/* Message Content */}
            <div className="flex-1 max-w-[80%] text-left">
                <div className={`w-full inline-block p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white ${message.isGenerating ? 'animate-pulse' : ''
                    }`}>

                    {/* Message Text */}
                    <div className="whitespace-pre-wrap break-words text-gray-200 text-base">
                        {message.isGenerating ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                {message.content}
                            </div>
                        ) : (
                            message.content
                        )}
                    </div>

                    {/* Model Data Display */}
                    {message.modelData && (
                        <div className="mt-1 space-y-3 w-full">
                            <ModelViewer
                                modelUrl={message.modelData.model_urls?.glb ?? ''}
                                modelData={current3DModel || undefined}
                                showControls={true}
                                setIsError={setIsError}
                            />

                            {!isError && (
                                <>
                                    {/* Model Actions */}
                                    <div className="flex flex-wrap gap-2">
                                        <AddToSidebarButton
                                            model={message.modelData}
                                            onAddToSidebar={onAddToSidebar}
                                        />

                                        {/* Refine Button - only show if model needs refinement */}
                                        {needsRefinement(message.modelData) && (
                                            <button
                                                onClick={() => setCurrentRefineModelData({
                                                    model_thumbnail_url: message.modelData?.thumbnail_url ?? '',
                                                    preview_task_id: message.modelData?.id ?? ''
                                                })}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-sm transition-colors"
                                                title="Add textures and materials to this model"
                                            >
                                                <Sparkles size={12} />
                                                Refine Model
                                            </button>
                                        )}

                                        {message.modelData.model_urls?.glb && (
                                            <button
                                                onClick={() => handleDownload(message.modelData!, 'glb')}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-200 rounded-lg text-sm transition-colors"
                                            >
                                                <Download size={12} />
                                                GLB
                                            </button>
                                        )}

                                        {message.modelData.model_urls?.fbx && (
                                            <button
                                                onClick={() => handleDownload(message.modelData!, 'fbx')}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-200 rounded-lg text-sm transition-colors"
                                            >
                                                <Download size={12} />
                                                FBX
                                            </button>
                                        )}

                                        {message.modelData.model_urls?.obj && (
                                            <button
                                                onClick={() => handleDownload(message.modelData!, 'obj')}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-200 rounded-lg text-sm transition-colors"
                                            >
                                                <Download size={12} />
                                                OBJ
                                            </button>
                                        )}
                                    </div>

                                    {/* Refinement Status Indicator */}
                                    {needsRefinement(message.modelData) && (
                                        <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2 py-1">
                                            <Sparkles size={12} />
                                            <span>{`This model has no textures. Click "Refine Model" to add realistic materials and textures.`}</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Timestamp */}
                <div className="text-xs text-gray-400 mt-1 text-left">
                    {formatTimestamp(message.timestamp)}
                </div>
            </div>
        </div>
    );
}