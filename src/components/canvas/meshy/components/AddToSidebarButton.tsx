// src/components/canvas/meshy/components/AddToSidebarButton.tsx
"use client";

import React, { useState } from 'react';
import { Plus, Check, Loader2 } from 'lucide-react';
import { Meshy3DObjectResponse } from '../types';

interface AddToSidebarButtonProps {
    model: Meshy3DObjectResponse;
    onAddToSidebar?: (modelData: {
        id: string;
        name: string;
        url: string;
        fileType: 'glb';
        model: Meshy3DObjectResponse;
    }) => void;
    isAdded?: boolean;
    className?: string;
}

export default function AddToSidebarButton({
    model,
    onAddToSidebar,
    isAdded = false,
    className = ""
}: AddToSidebarButtonProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [hasBeenAdded, setHasBeenAdded] = useState(isAdded);

    const handleAddToSidebar = async () => {
        if (!onAddToSidebar || !model.model_urls?.glb || hasBeenAdded || isAdding) {
            return;
        }

        setIsAdding(true);

        try {
            // Download the GLB file and create a blob URL
            const response = await fetch(`/api/meshy/model?url=${encodeURIComponent(model.model_urls.glb)}`);

            if (!response.ok) {
                throw new Error('Failed to fetch model file');
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            // Create model data for sidebar
            const modelData = {
                id: `meshy-${model.id}-${Date.now()}`,
                name: `AI Model ${model.id.slice(0, 8)}`,
                url: objectUrl,
                fileType: 'glb' as const,
                model: model
            };

            // Add to sidebar
            onAddToSidebar(modelData);
            setHasBeenAdded(true);

        } catch (error) {
            console.error('Failed to add model to sidebar:', error);
            // You could add error handling here, like showing a toast notification
        } finally {
            setIsAdding(false);
        }
    };

    if (hasBeenAdded) {
        return (
            <button
                className={`flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-200 rounded-lg text-sm cursor-default border border-green-500/30 ${className}`}
                disabled
            >
                <Check size={12} />
                Added
            </button>
        );
    }

    return (
        <button
            onClick={handleAddToSidebar}
            disabled={isAdding || !model.model_urls?.glb}
            className={`flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 disabled:bg-gray-500/20 text-purple-200 disabled:text-gray-400 rounded-lg text-sm transition-colors disabled:cursor-not-allowed ${className}`}
        >
            {isAdding ? (
                <>
                    <Loader2 size={12} className="animate-spin" />
                    Adding...
                </>
            ) : (
                <>
                    <Plus size={12} />
                    Add to Sidebar
                </>
            )}
        </button>
    );
}