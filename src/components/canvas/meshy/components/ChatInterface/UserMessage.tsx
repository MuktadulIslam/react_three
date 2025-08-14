'use client';

import React, { useCallback } from 'react';
import { User, Sparkles, Eye, RefreshCw } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types';
import Image from 'next/image';

interface UserMessageProps {
    message: ChatMessageType;
}

export default function UserMessage({ message }: UserMessageProps) {
    const formatTimestamp = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const getGenerationTypeIcon = (type?: string) => {
        switch (type) {
            case 'text-to-3d':
                return <Sparkles size={12} />;
            case 'image-to-3d':
                return <Eye size={12} />;
            case 'refine':
                return <RefreshCw size={12} />;
            default:
                return null;
        }
    };

    const getGenerationTypeLabel = (type?: string) => {
        switch (type) {
            case 'text-to-3d':
                return 'TEXT TO 3D';
            case 'image-to-3d':
                return 'IMAGE TO 3D';
            case 'refine':
                return 'REFINE MODEL';
            default:
                return null;
        }
    };

    const modelImageComponent = useCallback((image_url: string | null) => {
        if (image_url == null) return <></>;
        return (
            <div className="relative inline-block">
                <Image
                    width={100}
                    height={100}
                    src={image_url}
                    alt="Model to refine"
                    className="w-32 h-32 object-cover rounded-lg border border-purple-400 bg-gray-800"
                />
                {/* Model label */}
                <div className="absolute bottom-0 left-0 right-0 bg-purple-400 text-white text-[8px] text-center rounded-b-lg px-1">
                    3D MODEL
                </div>
            </div>
        );
    }, []);


    // Use imageUrls if available (new multi-image support), fallback to imageUrl (backward compatibility)
    const displayImages = message.imageUrls || (message.imageUrl ? [message.imageUrl] : []);

    return (
        <div className="flex gap-3 flex-row-reverse">
            {/* User Avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                <User size={16} className="text-white" />
            </div>

            {/* Message Content */}
            <div className="flex-1 max-w-[80%] text-right">
                <div className="max-w-full inline-block p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                    {/* Generation Type Badge */}
                    {message.generationType && (
                        <div className="flex items-center justify-end gap-1 mb-1 text-[9px] opacity-80 text-stone-200">
                            {getGenerationTypeIcon(message.generationType)}
                            <span>{getGenerationTypeLabel(message.generationType)}</span>
                            {displayImages.length > 1 && (
                                <span className="ml-1 bg-blue-500/50 px-1 rounded text-[8px]">
                                    {displayImages.length} images
                                </span>
                            )}
                        </div>
                    )}

                    {/* Multi-Image Preview for user messages */}
                    {(displayImages.length > 0 || message.refineModelData?.model_thumbnail_url != null) && (
                        <div className="mb-2">
                            <div className="grid grid-cols-2 gap-2 max-w-full">
                                {modelImageComponent(message.refineModelData?.model_thumbnail_url ?? null)}
                                {displayImages.map((imageUrl, index) => (
                                    <div key={index} className="relative">
                                        <Image
                                            width={100}
                                            height={100}
                                            src={imageUrl}
                                            alt={`User uploaded image ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border border-white/20"
                                        />
                                        {displayImages.length > 1 &&
                                            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                                                {index + 1}
                                            </div>
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Message Text */}
                    <div className="whitespace-pre-wrap break-words">
                        {message.content}
                    </div>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-gray-400 mt-1 text-right">
                    {formatTimestamp(message.timestamp)}
                </div>
            </div>
        </div>
    );
}