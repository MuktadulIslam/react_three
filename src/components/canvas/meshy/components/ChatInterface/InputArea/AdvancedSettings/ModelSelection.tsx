'use client'
import { Sparkles, ChevronDown } from 'lucide-react';
import { useMeshyChat } from "../../../../context/MeshyChatContext";
import { modelOptions } from "./constent";
import { Dispatch, SetStateAction } from 'react';


interface ModelSelectionProps {
    ref: React.RefObject<HTMLDivElement | null>;
    show: boolean;
    setShow: Dispatch<SetStateAction<boolean>>
}

export default function ModelSelection({ ref, show, setShow }: ModelSelectionProps) {
    const { currentModel, setCurrentModel } = useMeshyChat();
    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setShow((option) => !option)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20 text-sm"
                title="Select Model Version"
            >
                <Sparkles size={16} color='#51a2ff' />
                <span className="font-medium">{currentModel.label}</span>
                <ChevronDown size={14} className={`transition-transform ${show ? 'rotate-180' : ''}`} />
            </button>

            {show && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-50">
                    <div className="p-2">
                        {modelOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    setCurrentModel(option);
                                    setShow(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${currentModel.value === option.value
                                    ? 'bg-purple-500/20 text-purple-200'
                                    : 'hover:bg-white/10 text-white'
                                    }`}
                            >
                                <div className="font-medium">{option.label}</div>
                                <div className="text-xs text-gray-400 mt-0.5">{option.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}