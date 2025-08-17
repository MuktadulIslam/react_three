'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, Trash2, ArrowLeftRight, Grid3X3 } from 'lucide-react';
import { useMeshyChat } from '../../context/MeshyChatContext';
import ModelComparison from '../ModelComparison';
import ModelGallery from '../ModelGallery';
import InputArea from './InputArea';
import UserMessage from './UserMessage';
import AIMessage from './AIMessage';

interface ChatInterfaceProps {
    onAddModelToSidebar?: (modelData: {
        id: string;
        name: string;
        url: string;
        fileType: 'glb';
        model: any;
    }) => void;
}

export default function ChatInterface({ onAddModelToSidebar }: ChatInterfaceProps) {
    const { messages, startNewSession, clearSession, setCurrent3DModel, currentGenerationType } = useMeshyChat();
    const [showComparison, setShowComparison] = useState(false);
    const [showGallery, setShowGallery] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messages.length > 1) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Initialize session when component mounts or tab changes
    useEffect(() => {
        if (messages.length === 0) {
            startNewSession(currentGenerationType.value);
        }
    }, [currentGenerationType.value, messages.length, startNewSession]);



    // Get all generated models from messages for comparison
    const generatedModels = messages
        .filter(msg => msg.modelData && msg.type === 'assistant')
        .map(msg => msg.modelData!);

    return (
        <div className="flex flex-col h-full bg-black/50 backdrop-blur-md ">
            {/* Header */}
            <div className="flex items-center justify-between p-2 border-b border-white/20">
                <div className="flex items-center gap-1">
                    <span className="text-xl">✨</span>
                    <span className="text-white font-medium text-lg">AI 3D Generation Chat</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                    {generatedModels.length > 0 && (
                        <button
                            onClick={() => setShowGallery(true)}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            title="View All Models"
                        >
                            <Grid3X3 size={20} />
                        </button>
                    )}
                    {generatedModels.length > 1 && (
                        <button
                            onClick={() => setShowComparison(true)}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            title="Compare Models"
                        >
                            <ArrowLeftRight size={20} />
                        </button>
                    )}
                    <button
                        onClick={() => startNewSession(currentGenerationType.value)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        title="New Conversation"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <button
                        onClick={clearSession}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        title="Delete Chat"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {messages.map((message) =>
                    message.type == 'user' ? (
                        <UserMessage key={message.id} message={message} />
                    ) : (
                        <AIMessage
                            key={message.id}
                            message={message}
                            onAddToSidebar={onAddModelToSidebar}
                        />
                    ))}
                <div ref={messagesEndRef} />
            </div>

            <InputArea />

            {/* Model Comparison Modal */}
            {showComparison && generatedModels.length > 1 && (
                <ModelComparison
                    models={generatedModels}
                    onClose={() => setShowComparison(false)}
                />
            )}

            {/* Model Gallery Modal */}
            {showGallery && (
                <ModelGallery
                    models={generatedModels}
                    onClose={() => setShowGallery(false)}
                    onSelectModel={(model) => {
                        if (model.model_urls?.glb) {
                            setCurrent3DModel(model);
                        }
                        setShowGallery(false);
                    }}
                    onCompare={(models) => {
                        setShowGallery(false);
                        setShowComparison(true);
                    }}
                />
            )}
        </div >
    );
}