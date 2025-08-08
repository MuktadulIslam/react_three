'use client';

import { useEffect, useRef } from 'react';
import { SketchfabModel } from '../../types';
import ModelViewerHeader from './ModelViewerHeader';
import ModelViewerProgressOverlay from './ModelViewerProgressOverlay';
import ModelViewerIframe from './ModelViewerIframe';

interface ModelViewerProps {
    model: SketchfabModel;
    handleDownloadModel: (model: SketchfabModel) => void;
    handleAddToSidebar?: (model: SketchfabModel) => void;
    closeViewer: () => void;
    addingToSidebarId?: string | null;
    addToSidebarProgress?: number;
    isAlreadyInSidebar?: boolean;
}

export default function ModelViewer({
    model,
    handleDownloadModel,
    handleAddToSidebar,
    closeViewer,
    addingToSidebarId,
    addToSidebarProgress = 0,
    isAlreadyInSidebar = false
}: ModelViewerProps) {
    const popupRef = useRef<HTMLDivElement>(null);
    const isThisModelAddingToSidebar = addingToSidebarId === model.uid;

    useEffect(() => {
        if (popupRef.current) {
            setTimeout(() => {
                popupRef.current?.classList.remove('scale-0');
                popupRef.current?.classList.add('scale-100');
            }, 10);
        }
    }, []);

    return (
        <div className="absolute top-0 border-0 w-full h-full ease-out inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
            <div ref={popupRef} className="w-full aspect-square scale-0 transition-transform duration-500 bg-gradient-to-br from-white/60 to-blue-500/30 rounded-2xl flex flex-col">
                <ModelViewerHeader 
                    model={model}
                    handleAddToSidebar={handleAddToSidebar}
                    handleDownloadModel={handleDownloadModel}
                    closeViewer={closeViewer}
                    isThisModelAddingToSidebar={isThisModelAddingToSidebar}
                    isAlreadyInSidebar={isAlreadyInSidebar}
                />

                {isThisModelAddingToSidebar && (
                    <ModelViewerProgressOverlay progress={addToSidebarProgress} />
                )}

                <ModelViewerIframe model={model} />
            </div>
        </div>
    );
}