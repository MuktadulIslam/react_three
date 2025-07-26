// src/components/canvas/meshy/MeshySideBar.tsx
'use client';

import React, { useState } from 'react';
import { MeshyChatProvider, useMeshyChat } from './context/MeshyChatContext';
import MeshyHeader from './MeshyHeader';
import ChatInterface from './components/ChatInterface';

interface MeshySideBarProps {
    show: boolean;
    setShow: (show: boolean) => void;
    onAddModelToSidebar?: (modelData: {
        id: string;
        name: string;
        url: string;
        fileType: 'glb';
        model: any;
    }) => void;
}

function MeshySideBarContent({ show, setShow, onAddModelToSidebar }: MeshySideBarProps) {
    const { currentModel } = useMeshyChat();

    return (
        <div className={`h-screen w-3xl ${show ? '' : '-translate-x-full'} transition-all duration-300 absolute left-0 top-0 bottom-0 z-50 backdrop-blur-sm`}>
            <div className="w-full h-full flex flex-col overflow-hidden">
                <MeshyHeader setShow={setShow} />

                {/* Content */}
                <div className="flex-1 min-h-0">
                    <ChatInterface />
                </div>
            </div>
        </div>
    );
}

export default function MeshySideBar(props: MeshySideBarProps) {
    return (
        <MeshyChatProvider>
            <MeshySideBarContent {...props} />
        </MeshyChatProvider>
    );
}