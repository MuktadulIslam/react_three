// src/components/canvas/meshy/components/UserMessage.tsx
'use client';

import React from 'react';
import { User, Sparkles, Eye, RefreshCw } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types';

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
                        </div>
                    )}

                    {/* Image Preview for user messages */}
                    {message.imageUrl && (
                        <div className="mb-2">
                            <img
                                src={message.imageUrl}
                                alt="User uploaded image"
                                className="max-w-full h-32 object-cover rounded-lg border border-white/20"
                            />
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