'use client'

import { useState } from "react";
import SidebarHeader from "./Header";
import SearchBarUtils from "./searchBarUtils";
import ThreeDModelCard from "./ThreeDModelCard";
import { SketchfabModel } from "./types";
import ModelViewer from "./ModelViewer";
import SketchfabLogin from "./SektchfabLogin";
import { SketchfabReduxProvider } from "./store/SketchfabReduxProvider";
import { useAuth } from "./store/hooks/useAuth";
import { useDownload } from "./store/hooks/useDownload";
import { NotificationManager } from "./Notification";

interface SketchfabSearchSideBarProps {
    show: boolean;
    setShow: (show: boolean) => void;
    onAddModelToSidebar?: (modelData: {
        id: string;
        name: string;
        url: string;
        fileType: 'glb';
        model: SketchfabModel;
    }) => void;
    existingModelUids?: string[]; // New prop to track existing model UIDs
}

export default function SketchfabSearchSideBar({ show, setShow, onAddModelToSidebar, existingModelUids = [] }: SketchfabSearchSideBarProps) {
    return (
        <SketchfabReduxProvider>
            <SketchfabSearch show={show} setShow={setShow} onAddModelToSidebar={onAddModelToSidebar} existingModelUids={existingModelUids} />
        </SketchfabReduxProvider>
    );
}

interface NotificationData {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
}

function SketchfabSearch({ show, setShow, onAddModelToSidebar, existingModelUids = [] }: SketchfabSearchSideBarProps) {
    const [selectedModel, setSelectedModel] = useState<SketchfabModel | null>(null);
    const [downloadingModelId, setDownloadingModelId] = useState<string | null>(null);
    const [addingToSidebarId, setAddingToSidebarId] = useState<string | null>(null);
    const [addToSidebarProgress, setAddToSidebarProgress] = useState<number>(0);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const { models, SearchBar, ModelLoadingUtils } = SearchBarUtils();
    const { authenticated } = useAuth();
    const { downloadGLB, getDownloadOptions } = useDownload();

    const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) => {
        const id = Date.now().toString();
        setNotifications(prev => [...prev, { id, message, type, duration }]);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleDownloadModel = async (model: SketchfabModel) => {
        try {
            setDownloadingModelId(model.uid);
            const urls = await getDownloadOptions(model.uid);
            downloadGLB(urls.glb.url, model.name);
        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setDownloadingModelId(null);
        }
    };

    const handleAddToSidebar = async (model: SketchfabModel) => {
        // Check if model is already in sidebar
        if (existingModelUids.includes(model.uid)) {
            addNotification(`"${model.name}" is already in the sidebar!`, 'info', 3000);
            return;
        }

        if (!onAddModelToSidebar) {
            addNotification('Add to sidebar callback not available', 'error');
            return;
        }

        try {
            setAddingToSidebarId(model.uid);
            setAddToSidebarProgress(0);

            // Step 1: Get download options (20% progress)
            setAddToSidebarProgress(20);
            const downloadOptions = await getDownloadOptions(model.uid);

            if (!downloadOptions?.glb?.url) {
                throw new Error('GLB format not available for this model');
            }

            // Step 2: Download the GLB file (40% progress)
            setAddToSidebarProgress(40);
            const response = await fetch(downloadOptions.glb.url);

            if (!response.ok) {
                throw new Error('Failed to download GLB file');
            }

            // Step 3: Convert to blob and create object URL (60% progress)
            setAddToSidebarProgress(60);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            // Step 4: Prepare model data (80% progress)
            setAddToSidebarProgress(80);
            const modelData = {
                id: `sketchfab-${model.uid}-${Date.now()}`,
                name: model.name || 'Sketchfab Model',
                url: objectUrl,
                fileType: 'glb' as const,
                model: model
            };

            // Step 5: Add to sidebar (100% progress)
            setAddToSidebarProgress(100);
            onAddModelToSidebar(modelData);

            // Show success notification
            addNotification(`✨ "${model.name}" added to sidebar!`, 'success', 4000);

            // Small delay to show 100% completion before hiding
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
            console.error('Failed to add model to sidebar:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            addNotification(`Failed to add model: ${errorMessage}`, 'error', 5000);
        } finally {
            setAddingToSidebarId(null);
            setAddToSidebarProgress(0);
        }
    };

    return (
        <div className={`h-screen w-3xl ${show ? '' : '-translate-x-full'} transition-all duration-300 fixed left-0 top-0 bottom-0 z-50 backdrop-blur-sm bg-gradient-to-br from-white/40 to-sky-200/20 border-r-2 border-gray-400`}>
            {/* Notifications */}
            <NotificationManager
                notifications={notifications}
                removeNotification={removeNotification}
            />

            {/* 3D Model Viewer Modal */}
            {selectedModel != null && (
                <ModelViewer
                    model={selectedModel}
                    handleDownloadModel={handleDownloadModel}
                    closeViewer={() => {
                        setSelectedModel(null);
                    }}
                />
            )}
            <div className="w-full h-full overflow-auto">
                <SidebarHeader setShow={setShow} />
                {!authenticated ? (
                    <SketchfabLogin />
                ) : (
                    <>
                        <SearchBar />
                        {models.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 p-2">
                                {models.map((model, index) => (
                                    <ThreeDModelCard
                                        key={index}
                                        model={model}
                                        setSelectedModel={setSelectedModel}
                                        handleDownloadModel={handleDownloadModel}
                                        handleAddToSidebar={handleAddToSidebar}
                                        downloadingModelId={downloadingModelId}
                                        addingToSidebarId={addingToSidebarId}
                                        addToSidebarProgress={addToSidebarProgress}
                                        isAlreadyInSidebar={existingModelUids.includes(model.uid)}
                                    />
                                ))}
                            </div>
                        )}
                        <ModelLoadingUtils />
                    </>
                )}
            </div>
        </div>
    );
}