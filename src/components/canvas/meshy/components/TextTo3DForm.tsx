import React, { useState } from 'react';
import { Wand2, Sparkles } from 'lucide-react';
import { useMeshy } from '../context/MeshyContext';
import { MeshyTextTo3DRequest } from '../types';

export default function TextTo3DForm() {
    const [formData, setFormData] = useState<MeshyTextTo3DRequest>({
        mode: 'preview',
        prompt: '',
        art_style: 'realistic',
        negative_prompt: 'low quality, low resolution, low poly, ugly',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    };

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
                    disabled={false} // Disable if you want to prevent selection during loading
                >
                    <option value="realistic">Realistic</option>
                    <option value="sculpture">Sculpture</option>
                </select>
            </div>

            {/* Negative Prompt */}
            <div>
                <label className="block text-sm font-medium text-gray-100 mb-1">
                    Negative Prompt (Optional)
                </label>
                <input
                    type="text"
                    value={formData.negative_prompt}
                    onChange={(e) => setFormData(prev => ({ ...prev, negative_prompt: e.target.value }))}
                    placeholder="Things to avoid in the model..."
                    className="w-full px-3 py-2 bg-gray-800/60 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    disabled={false} // Disable if you want to prevent input during loading
                />
            </div>

            {/* Generate Button */}
            <button
                type="submit"
                disabled={!formData.prompt.trim() || false} // Replace false with actual loading state if needed
                className="w-full mt-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
                {false ? ( // Replace false with actual loading state if needed
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