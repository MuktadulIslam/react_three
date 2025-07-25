'use client';

import React, { useState } from 'react';
import { MeshyProvider } from './context/MeshyContext';
import TextTo3DForm from './components/TextTo3DForm';
import ImageTo3DForm from './components/ImageTo3DForm';
import { ActiveTab } from './types';
import MeshyHeader from './MeshyHeader';
import MeshyFooter from './MeshyFooter';
import RefineModelForm from './components/RefineModelForm';
import { ModelViewer } from './components/ModelViewer';

interface MeshySideBarProps {
    show: boolean;
    setShow: (show: boolean) => void;
}

function MeshySideBarContent({ show, setShow }: MeshySideBarProps) {
    const [activeTab, setActiveTab] = useState<ActiveTab>('text-to-3d');
    const [modelUrl, setModelUrl] = useState<string | null>(null);


    return (
        <div className={`h-screen w-3xl ${show ? '' : '-translate-x-full'} transition-all duration-300 absolute left-0 top-0 bottom-0 z-50 backdrop-blur-sm bg-gradient-to-br from-white/40 to-sky-200/40 border-r-2 border-gray-400`}>
            <div className="w-full h-full flex flex-col overflow-y-auto">
                <MeshyHeader activeTab={activeTab} setActiveTab={setActiveTab} setShow={setShow} />

                {/* Content */}
                <div className="flex-1 p-2 space-y-6">
                    {/* Tab Content */}
                    <div className="bg-stone-400/50 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        {activeTab === 'text-to-3d' && (
                            <TextTo3DForm setModelUrl={setModelUrl} />
                        )}

                        {activeTab === 'image-to-3d' && (
                            <ImageTo3DForm />
                        )}

                        {activeTab === 'refine-model' && (
                            <RefineModelForm />
                        )}
                    </div>
                    {modelUrl &&
                        <ModelViewer modelUrl={modelUrl} />
                    }
                </div>

                <MeshyFooter activeTab={activeTab} />
            </div>
        </div>
    );
}

export default function MeshySideBar(props: MeshySideBarProps) {
    return (
        <MeshyProvider>
            <MeshySideBarContent {...props} />
        </MeshyProvider>
    );
}