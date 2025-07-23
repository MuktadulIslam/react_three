import { X, Wand2, Image, Sparkles, Bot } from 'lucide-react';
import { EB_Garamond } from 'next/font/google';
import { ActiveTab } from './types';


const ebGaramond = EB_Garamond({
    subsets: ['latin'],
    weight: ['800'],
});

interface MeshyHeaderProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
    setShow: (show: boolean) => void;
}

export default function MeshyHeader({ activeTab, setActiveTab, setShow }: MeshyHeaderProps) {
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
            id: 'refine-model' as const,
            label: 'Refine Model',
            icon: <Sparkles size={16} />,
            color: 'text-blue-400',
            activeColor: 'bg-blue-500/20 border-blue-500/50'
        }
    ];

    return (<>
        <div className="relative p-2 bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-black/70 border-b-2 border-gray-700/50">

            <button
                onClick={() => {
                    setShow(false);
                }}
                className="absolute top-2 right-2 bg-gradient-to-br from-red-600 via-red-400 to-red-400/50 hover:from-red-700 hover:via-red-500 hover:to-red-500/50 text-white p-2 rounded-lg transition-colors duration-200 z-20"
            >
                <X size={20} />
            </button>

            <div className="relative z-10">
                <div className="text-center mb-3">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Bot className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className={`${ebGaramond.className} text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-green-600 to-blue-600 bg-clip-text text-transparent`}>
                                AI 3D Generation
                            </h1>
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-green-500/50 text-green-100 px-4 py-1 rounded-full text-sm">
                        💡 Generate from text, images, or refine existing models with AI-powered generation
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-3 p-1 rounded-lg">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-md text-base font-medium transition-all duration-200 ${activeTab === tab.id
                                ? `${tab.activeColor} text-white border`
                                : `text-gray-300 hover:text-white border border-gray-600/80 bg-gray-600/60 hover:bg-gray-400/50`
                                }`}
                        >
                            <span className={activeTab === tab.id ? 'text-white' : tab.color}>
                                {tab.icon}
                            </span>
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </>);
}