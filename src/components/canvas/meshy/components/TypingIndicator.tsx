// src/components/canvas/meshy/components/TypingIndicator.tsx
'use client';

import React from 'react';
import { Bot } from 'lucide-react';

interface TypingIndicatorProps {
    message?: string;
}

export default function TypingIndicator({ message = "AI is thinking..." }: TypingIndicatorProps) {
    return (
        <div className="flex gap-3 flex-row">
            {/* AI Avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                <Bot size={16} className="text-white" />
            </div>

            {/* Typing Content */}
            <div className="flex-1 max-w-[80%] text-left">
                <div className="inline-block p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white animate-pulse">
                    <div className="flex items-center gap-2">
                        {/* Animated dots */}
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-300">{message}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}