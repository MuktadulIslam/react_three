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

interface SketchfabSearchSideBarProps {
    show: boolean;
    setShow: (show: boolean) => void;
}

export default function SketchfabSearchSideBar({ show, setShow }: SketchfabSearchSideBarProps) {
    return (<>
        <SketchfabReduxProvider>
            <SketchfabSearch show={show} setShow={setShow} />
        </SketchfabReduxProvider>
    </>)
}

function SketchfabSearch({ show, setShow }: SketchfabSearchSideBarProps) {
    const [selectedModel, setSelectedModel] = useState<SketchfabModel | null>(null);
    const [downloadingModelId, setDownloadingModelId] = useState<string | null>(null);
    const { models, SearchBar, ModelLoadingUtils } = SearchBarUtils();
    const { authenticated } = useAuth();
    const { downloadGLB, getDownloadOptions } = useDownload();

    const handleDownloadModel = async (model: SketchfabModel) => {
        try {
            setDownloadingModelId(model.uid); // Set the downloading model ID
            const urls = await getDownloadOptions(model.uid);
            downloadGLB(urls.glb.url, model.name);
        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setDownloadingModelId(null); // Clear the downloading model ID
        }
    }

    return (<>
        <div className={`h-screen w-3xl ${show ? '' : '-translate-x-full'} transition-all duration-300 fixed left-0 top-0 bottom-0 z-50 backdrop-blur-sm bg-gradient-to-br from-white/40 to-sky-200/20  border-r-2 border-gray-400`}>
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
                {!authenticated ? <SketchfabLogin /> : <>

                    <SearchBar />
                    {models.length > 0 && (
                        <>
                            <div className="grid grid-cols-3  gap-4 p-2">
                                {models.map((model, index) => (
                                    <ThreeDModelCard
                                        key={index}
                                        model={model}
                                        setSelectedModel={setSelectedModel}
                                        handleDownloadModel={handleDownloadModel}
                                        downloadingModelId={downloadingModelId}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                    <ModelLoadingUtils />
                </>
                }
            </div>
        </div>
    </>)
}