import { useEffect, useRef, useState } from "react";
import GenerationTypeSelection from "./GenerationTypeSelection";
import ModelSelection from "./ModelSelection";
import ArtStyleSelection from "./ArtStyleSelection";
import SymmetrySelection from "./SymmetrySelection";
import { useMeshyChat } from "../../../../context/MeshyChatContext";

interface AdvancedSettingsProps {
    showSettings: boolean
}

export default function AdvancedSettings({ showSettings }: AdvancedSettingsProps) {
    const [showModelDropdown, setShowModelDropdown] = useState(false);
    const [showArtStyleDropdown, setShowArtStyleDropdown] = useState(false);
    const [showSymmetryDropdown, setShowSymmetryDropdown] = useState(false);
    const [showGenerationTypeDropdown, setShowGenerationTypeDropdown] = useState(false);

    const modelDropdownRef = useRef<HTMLDivElement>(null);
    const artStyleDropdownRef = useRef<HTMLDivElement>(null);
    const symmetryDropdownRef = useRef<HTMLDivElement>(null);
    const generationTypeDropdownRef = useRef<HTMLDivElement>(null);

    const { currentModel, currentArtStyle, currentSymmetry, currentGenerationType } = useMeshyChat();


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
                setShowModelDropdown(false);
            }
            if (artStyleDropdownRef.current && !artStyleDropdownRef.current.contains(event.target as Node)) {
                setShowArtStyleDropdown(false);
            }
            if (symmetryDropdownRef.current && !symmetryDropdownRef.current.contains(event.target as Node)) {
                setShowSymmetryDropdown(false);
            }
            if (generationTypeDropdownRef.current && !generationTypeDropdownRef.current.contains(event.target as Node)) {
                setShowGenerationTypeDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            {showSettings ? (
                <div className="flex-1 flex items-center gap-3 flex-wrap text-gray-200">
                    <ModelSelection ref={modelDropdownRef} setShow={setShowModelDropdown} show={showModelDropdown} />
                    {currentGenerationType.value == 'text-to-3d' &&
                        <ArtStyleSelection ref={artStyleDropdownRef} setShow={setShowArtStyleDropdown} show={showArtStyleDropdown} />
                    }
                    <SymmetrySelection ref={symmetryDropdownRef} setShow={setShowSymmetryDropdown} show={showSymmetryDropdown} />
                </div>
            ) : (
                <div className="h-auto flex-1 flex items-center justify-start gap-2 text-sm pl-5">
                    <span className="flex items-center gap-1">
                        <span>{currentModel.icon}</span>
                        {currentModel.label}
                    </span>
                    {currentGenerationType.value == 'text-to-3d' &&
                        <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <span>{currentArtStyle.icon}</span>
                                {currentArtStyle.label}
                            </span>
                        </>
                    }
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <span>{currentSymmetry.icon}</span>
                        {currentSymmetry.label}
                    </span>
                </div>
            )}
            <GenerationTypeSelection ref={generationTypeDropdownRef} setShow={setShowGenerationTypeDropdown} show={showGenerationTypeDropdown} />
        </>
    );
}