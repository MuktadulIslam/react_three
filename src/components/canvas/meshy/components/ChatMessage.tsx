// src/components/canvas/meshy/components/ChatMessage.tsx (Updated)
'use client';

import React from 'react';
import { ChatMessage as ChatMessageType, Meshy3DObjectResponse } from '../types';
import UserMessage from './UserMessage';
import AIMessage from './AIMessage';

interface ChatMessageProps {
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

export default function ChatMessage({
    message,
    currentModel,
    setCurrentModel,
    onAddToSidebar
}: ChatMessageProps) {
    // Render different components based on message type
    if (message.type === 'user') {
        return <UserMessage message={message} />;
    } else {
        return (
            <AIMessage
                message={message}
                currentModel={currentModel}
                setCurrentModel={setCurrentModel}
                onAddToSidebar={onAddToSidebar}
            />
        );
    }
}