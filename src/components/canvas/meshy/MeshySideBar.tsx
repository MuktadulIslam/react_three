'use client';

import { MeshyChatProvider } from './context/MeshyChatContext';
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
    return (
        <div className={`h-full w-[800px] ${show ? '' : '-translate-x-full'} transition-all duration-300 absolute left-0 top-0 bottom-0 z-50 backdrop-blur-sm`}>
            <div className="w-full h-full flex flex-col overflow-hidden">
                <MeshyHeader setShow={setShow} />

                <div className="flex-1 min-h-0">
                    <ChatInterface onAddModelToSidebar={onAddModelToSidebar} />
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