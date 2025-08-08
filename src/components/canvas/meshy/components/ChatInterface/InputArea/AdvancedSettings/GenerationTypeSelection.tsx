import { ChevronDown } from 'lucide-react';
import { useMeshyChat } from "../../../../context/MeshyChatContext";
import { generationTypeOptions } from "./constent";
import { Dispatch, SetStateAction } from 'react';

interface GenerationTypeSelectionProps {
    ref: React.RefObject<HTMLDivElement | null>;
    show: boolean;
    setShow: Dispatch<SetStateAction<boolean>>;
}

export default function GenerationTypeSelection({ ref, show, setShow }: GenerationTypeSelectionProps) {
    const { currentGenerationType, setCurrentGenerationType } = useMeshyChat();

    return (<div className="relative" ref={ref}>
        <button
            onClick={() => setShow((option) => !option)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors border border-blue-400/30 text-sm text-blue-200"
            title="Select Generation Type"
        >
            {currentGenerationType.icon}
            <span className="font-medium">{currentGenerationType.label}</span>
            <ChevronDown size={14} className={`transition-transform ${show ? 'rotate-180' : ''}`} />
        </button>

        {show && (
            <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-50">
                <div className="p-2">
                    {generationTypeOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                setCurrentGenerationType(option);
                                setShow(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${currentGenerationType.value === option.value
                                ? 'bg-blue-500/20 text-blue-200'
                                : 'hover:bg-white/10 text-white'
                                }`}
                        >
                            {option.icon}
                            <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-xs text-gray-400 mt-0.5">{option.description}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        )}
    </div>);
}