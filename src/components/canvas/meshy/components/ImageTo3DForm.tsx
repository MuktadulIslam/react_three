import React, { useState, useRef } from 'react';
import { Image, Upload, X } from 'lucide-react';
import { useMeshy } from '../context/MeshyContext';
import { MeshyImageTo3DRequest } from '../types';


export default function ImageTo3DForm() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<MeshyImageTo3DRequest>({
        mode: 'preview',
        image_url: '',
        prompt: '',
        art_style: 'realistic',
        negative_prompt: 'low quality, low resolution, low poly, ugly',
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
        }
    };

    const removeImage = () => {
        setSelectedFile(null);
        setPreviewUrl('');
        setFormData(prev => ({ ...prev, image_url: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.image_url) return;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Image size={20} className="text-green-600" />
                <h3 className="text-lg font-semibold text-white">Image to 3D</h3>
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-100 mb-1">
                    Upload Reference Image
                </label>

                {!previewUrl ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-32 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors bg-gray-800/30"
                    >
                        <div className="text-center text-gray-300 ">
                            <Upload size={24} className="mx-auto mb-2" />
                            <p className="text-sm">Click to upload image</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>


            {/* Generate Button */}
            <button
                type="submit"
                disabled={!formData.image_url || false} // Replace false with actual loading state if needed
                className="w-full mt-10 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
                {false ? ( // Replace false with actual loading state if needed
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating...
                    </>
                ) : (
                    <>
                        <Image size={18} />
                        Generate from Image
                    </>
                )}
            </button>
        </form>
    );
}