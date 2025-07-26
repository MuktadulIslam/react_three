// src/components/canvas/meshy/MeshyHeader.tsx
import { X, Wand2, Image, Sparkles, Bot, MessageCircle } from 'lucide-react';
import { EB_Garamond } from 'next/font/google';
import { useMeshyChat } from './context/MeshyChatContext';

const ebGaramond = EB_Garamond({
    subsets: ['latin'],
    weight: ['800'],
});

interface MeshyHeaderProps {
    setShow: (show: boolean) => void;
}

export default function MeshyHeader({ setShow }: MeshyHeaderProps) {
    const tabs = [
        {
            id: 'text-to-3d' as const,
            label: 'Text to 3D',
            icon: <Wand2 size={16} />,
            color: 'text-purple-400',
            activeColor: 'bg-purple-500/20 border-purple-500/50'
        },
        {
            id: 'image-to-3d' as const,
            label: 'Image to 3D',
            icon: <Image size={16} />,
            color: 'text-green-400',
            activeColor: 'bg-green-500/20 border-green-500/50'
        },
        {
            id: 'refine' as const,
            label: 'Refine Model',
            icon: <Sparkles size={16} />,
            color: 'text-blue-400',
            activeColor: 'bg-blue-500/20 border-blue-500/50'
        }
    ];

    return (
        <>
            <div className="relative p-1 bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-black/70">
                <button
                    onClick={() => {
                        setShow(false);
                    }}
                    className="absolute top-2 right-2 bg-gradient-to-br from-red-600 via-red-400 to-red-400/50 hover:from-red-700 hover:via-red-500 hover:to-red-500/50 text-white p-2 rounded-lg transition-colors duration-200 z-20"
                >
                    <X size={20} />
                </button>

                <div className="relative z-10">
                    <div className="text-center mb-2">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Bot className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className={`${ebGaramond.className} text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-green-600 to-blue-600 bg-clip-text text-transparent`}>
                                    AI 3D Chat Studio
                                </h1>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/50 to-blue-500/50 text-white px-4 py-1 rounded-full text-sm">
                            💬 Chat with AI to generate, refine, and perfect your 3D models
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}