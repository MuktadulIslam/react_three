import React, { useEffect, useState } from 'react';
import { Wand2, Sparkles } from 'lucide-react';
import { useMeshy } from '../context/MeshyContext';
import { MeshyTextTo3DRequest, Symmetry } from '../types';
import { useGet3DFromText } from '../hooks/get3DFromText';

export default function TextTo3DForm({ setModelUrl }: { setModelUrl: (url: string) => void }) {
    const { isPending, isSuccess, data: meshyResponse, mutate } = useGet3DFromText();
    const [formData, setFormData] = useState<MeshyTextTo3DRequest>({
        seed: Math.floor(Math.random() * 1000000),
        prompt: '',
        art_style: 'realistic',
        symmetry: 'auto', // Add symmetry to the form data
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        mutate(formData);
    };

    useEffect(() => {
        if (isSuccess && meshyResponse) {
            setModelUrl(meshyResponse.model_urls?.glb ?? '');
            console.log(meshyResponse);
        }
    }, [meshyResponse, isSuccess])

    const symmetryOptions = [
        {
            id: 'on' as const,
            label: 'On',
            color: 'text-green-500',
            activeColor: 'bg-green-500/30 border-green-500/50'
        },
        {
            id: 'off' as const,
            label: 'Off',
            color: 'text-red-500',
            activeColor: 'bg-red-500/30 border-red-500/50'
        },
        {
            id: 'auto' as const,
            label: 'Auto',
            color: 'text-blue-500',
            activeColor: 'bg-blue-500/30 border-blue-500/50'
        }
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
                <Wand2 size={20} className="text-purple-600" />
                <h3 className="text-lg font-semibold text-white">Text to 3D</h3>
            </div>

            {/* Prompt Input */}
            <div>
                <label className="block text-sm font-medium text-gray-100 mb-1">
                    Describe your 3D model
                </label>
                <textarea
                    value={formData.prompt}
                    onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                    placeholder="e.g., A realistic wooden chair with curved back..."
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                    rows={3}
                    disabled={false} // Disable if you want to prevent input during loading
                />
            </div>

            {/* Art Style */}
            <div>
                <label className="block text-sm font-medium text-gray-100 mb-1">
                    Art Style
                </label>
                <select
                    value={formData.art_style}
                    onChange={(e) => setFormData(prev => ({ ...prev, art_style: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    disabled={false}
                >
                    <option value="realistic">Realistic</option>
                    <option value="sculpture">Sculpture</option>
                </select>
            </div>

            {/* Symmetry Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                    Symmetry
                </label>
                <div className="flex gap-2 p-1 rounded-lg">
                    {symmetryOptions.map((option) => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, symmetry: option.id }))}
                            className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${formData.symmetry === option.id
                                ? `${option.activeColor} text-white border`
                                : `text-gray-300 hover:text-white border border-gray-600/80 bg-gray-600/60 hover:bg-gray-400/50`
                                }`}
                        >
                            <span className={formData.symmetry === option.id ? 'text-white' : option.color}>
                                {option.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Generate Button */}
            <button
                type="submit"
                disabled={!formData.prompt.trim() || false} // Replace false with actual loading state if needed
                className="w-full mt-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
                {isPending ? ( // Replace false with actual loading state if needed
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating...
                    </>
                ) : (
                    <>
                        <Sparkles size={18} />
                        Generate 3D Model
                    </>
                )}
            </button>
        </form>
    );
}