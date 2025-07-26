// src/components/canvas/meshy/components/AIMessage.tsx
'use client';

import { Bot, Download } from 'lucide-react';
import { ChatMessage as ChatMessageType, Meshy3DObjectResponse } from '../types';
import AddToSidebarButton from './AddToSidebarButton';
import { ModelViewer } from './ModelViewer';

interface AIMessageProps {
    message: ChatMessageType;
    currentModel: Meshy3DObjectResponse | null;
    setCurrentModel: (model: Meshy3DObjectResponse | null) => void;
    onAddToSidebar?: (modelData: {
        id: string;
        name: string;
        url: string;
        fileType: 'glb';
        model: Meshy3DObjectResponse;
    }) => void;
}

export default function AIMessage({
    message,
    currentModel,
    setCurrentModel,
    onAddToSidebar
}: AIMessageProps) {

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

    return (
        <div className="flex gap-3 flex-row">
            {/* AI Avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                <Bot size={16} className="text-white" />
            </div>

            {/* Message Content */}
            <div className="flex-1 max-w-[80%] text-left">
                <div className={`w-full inline-block p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white ${message.isGenerating ? 'animate-pulse' : ''
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
                                modelData={currentModel || undefined}
                                showControls={true}
                            />

                            {/* Model Actions */}
                            <div className="flex flex-wrap gap-2">
                                <AddToSidebarButton
                                    model={message.modelData}
                                    onAddToSidebar={onAddToSidebar}
                                />

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