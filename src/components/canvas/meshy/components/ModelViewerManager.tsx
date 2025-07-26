// src/components/canvas/meshy/components/ModelViewerManager.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import InlineModelViewer from './InlineModelViewer';
import { Meshy3DObjectResponse } from '../types';

interface ModelViewerManagerProps {
    modelData: Meshy3DObjectResponse;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
    priority?: number; // Higher priority = loads first
}

export default function ModelViewerManager({
    modelData,
    isExpanded = false,
    onToggleExpand,
    priority = 0
}: ModelViewerManagerProps) {
    const [shouldRender, setShouldRender] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Intersection Observer to detect visibility
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
                // Only render when visible and expanded or when it's the main model
                setShouldRender(entry.isIntersecting && (isExpanded || priority > 0));
            },
            {
                threshold: 0.1,
                rootMargin: '100px' // Start loading a bit before it's visible
            }
        );

        observer.observe(containerRef.current);

        return () => {
            observer.disconnect();
        };
    }, [isExpanded, priority]);

    // Handle expansion changes
    useEffect(() => {
        if (isExpanded && isVisible) {
            setShouldRender(true);
        } else if (!isExpanded && priority === 0) {
            // Delay hiding to avoid flickering
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isExpanded, isVisible, priority]);

    const handleToggleRender = () => {
        setShouldRender(!shouldRender);
    };

    return (
        <div ref={containerRef} className="relative w-full" style={{ height: '450px' }}>
            {shouldRender ? (
                <InlineModelViewer
                    modelData={modelData}
                    isExpanded={isExpanded}
                    onToggleExpand={onToggleExpand}
                />
            ) : (
                <div className="w-full bg-gray-800/50 rounded-lg border border-gray-600/30 flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="text-gray-400 mb-3">
                            <div className="text-3xl mb-2">🎯</div>
                            <p className="text-sm">3D Viewer Paused</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Click to activate • ID: {modelData.id.slice(0, 8)}
                            </p>
                        </div>
                        <button
                            onClick={handleToggleRender}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg text-sm transition-colors mx-auto"
                        >
                            <Eye size={14} />
                            Activate Viewer
                        </button>
                    </div>
                </div>
            )}

            {/* Performance indicator */}
            <div className="absolute top-2 right-2 flex items-center gap-1">
                {shouldRender && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="3D Viewer Active" />
                )}
                {!shouldRender && isVisible && (
                    <button
                        onClick={handleToggleRender}
                        className="p-1 text-gray-400 hover:text-white hover:bg-black/20 rounded transition-colors"
                        title="Activate 3D Viewer"
                    >
                        <EyeOff size={12} />
                    </button>
                )}
            </div>
        </div>
    );
}