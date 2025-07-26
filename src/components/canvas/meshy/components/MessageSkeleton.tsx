// src/components/canvas/meshy/components/MessageSkeleton.tsx
'use client';

import React from 'react';
import { Bot } from 'lucide-react';

interface MessageSkeletonProps {
    showModelViewer?: boolean;
}

export default function MessageSkeleton({ showModelViewer = false }: MessageSkeletonProps) {
    return (
        <div className="flex gap-3 flex-row">
            {/* AI Avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                <Bot size={16} className="text-white" />
            </div>

            {/* Skeleton Content */}
            <div className="flex-1 max-w-[80%] text-left">
                <div className="inline-block p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white">

                    {/* Text skeleton */}
                    <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-gray-600/50 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-600/50 rounded w-1/2"></div>
                    </div>

                    {/* Model viewer skeleton */}
                    {showModelViewer && (
                        <div className="mt-3 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <div className="w-2 h-2 bg-green-400/50 rounded-full animate-pulse"></div>
                                <div className="h-3 bg-gray-600/50 rounded w-32 animate-pulse"></div>
                            </div>

                            {/* 3D Viewer skeleton */}
                            <div className="w-full bg-gray-800/50 rounded-lg border border-gray-600/30 animate-pulse" style={{ height: '450px' }}>
                                <div className="flex items-center justify-between p-2 bg-gray-800/60 border-b border-gray-600/30">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-gray-600/50 rounded-full"></div>
                                        <div className="h-3 bg-gray-600/50 rounded w-24"></div>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-6 h-6 bg-gray-600/50 rounded"></div>
                                        <div className="w-6 h-6 bg-gray-600/50 rounded"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gray-600/50 rounded-full mx-auto mb-4 animate-spin"></div>
                                        <div className="h-4 bg-gray-600/50 rounded w-32 mx-auto"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons skeleton */}
                            <div className="flex flex-wrap gap-2">
                                <div className="h-8 bg-gray-600/50 rounded-lg w-24 animate-pulse"></div>
                                <div className="h-8 bg-gray-600/50 rounded-lg w-20 animate-pulse"></div>
                                <div className="h-8 bg-gray-600/50 rounded-lg w-16 animate-pulse"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Timestamp skeleton */}
                <div className="h-3 bg-gray-600/50 rounded w-16 mt-1 animate-pulse"></div>
            </div>
        </div>
    );
}