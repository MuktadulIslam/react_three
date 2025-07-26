'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, X, Settings, } from 'lucide-react';
import { useMeshyChat } from '../../../context/MeshyChatContext';
import { useGet3DFromText, useGet3DFromImage, useRefineModel } from '../../../hooks/meshy-hooks';
import { GenerationType, MeshyTextTo3DRequest, MeshyImageTo3DRequest, MeshyRefineRequest, MeshyModelVersion, } from '../../../types';
import AdvancedSettings from './AdvancedSettings';


export default function InputArea() {
    const {
        messages,
        addMessage,
        updateMessage,
        currentModel,
        currentInput,
        setCurrentInput,
        currentImage,
        setCurrentImage,
        isGenerating,
        setIsGenerating,
        currentGenerationType,
        currentArtStyle,
        currentSymmetry,
        setCurrent3DModel
    } = useMeshyChat();

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Mutation hooks
    const textTo3DMutation = useGet3DFromText();
    const imageTo3DMutation = useGet3DFromImage();
    const refineModelMutation = useRefineModel();

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Initialize session when component mounts or tab changes


    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setCurrentImage(result);
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setCurrentImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async () => {
        if (!currentInput.trim() && !currentImage) return;
        if (isGenerating) return;

        const userMessageContent = currentGenerationType.value === 'image-to-3d' && currentImage ?
            `${currentInput.trim() || 'Generate 3D model from uploaded image'}` :
            currentInput.trim();

        // Add user message
        const userMessageId = addMessage({
            type: 'user',
            content: userMessageContent,
            generationType: currentGenerationType.value,
            imageUrl: currentImage || undefined
        });

        // Add assistant thinking message
        const assistantMessageId = addMessage({
            type: 'assistant',
            content: `Generating your 3D model using ${currentModel.value} (${currentArtStyle.value}, ${currentSymmetry.value})...`,
            isGenerating: true
        });

        setIsGenerating(true);
        setCurrentInput('');

        try {
            let result;

            switch (currentGenerationType.value) {
                case 'text-to-3d':
                    const textRequest: MeshyTextTo3DRequest = {
                        prompt: currentInput.trim(),
                        art_style: currentArtStyle.value,
                        symmetry: currentSymmetry.value,
                        seed: Math.floor(Math.random() * 1000000),
                        model_version: currentModel.value
                    };
                    result = await textTo3DMutation.mutateAsync(textRequest);
                    break;

                case 'image-to-3d':
                    if (!currentImage) {
                        throw new Error('Please upload an image first');
                    }
                    const imageRequest: MeshyImageTo3DRequest = {
                        mode: 'preview',
                        image_url: currentImage,
                        prompt: currentInput.trim(),
                        art_style: currentArtStyle.value,
                        model_version: currentModel.value
                    };
                    result = await imageTo3DMutation.mutateAsync(imageRequest);
                    break;

                case 'refine':
                    if (!currentModel) {
                        throw new Error('Please generate a model first before refining');
                    }
                    const refineRequest: MeshyRefineRequest = {
                        texture_prompt: currentInput.trim(),
                        texture_image_url: currentImage || undefined,
                        mode: 'refine',
                        model_version: currentModel.value
                    };
                    result = await refineModelMutation.mutateAsync(refineRequest);
                    break;

                default:
                    throw new Error('Invalid generation type');
            }
            // Update current model
            setCurrent3DModel(result);

            // Update assistant message with success
            updateMessage(assistantMessageId ?? '', {
                content: getSuccessMessage(currentGenerationType.value, currentModel.value),
                isGenerating: false,
                modelData: result
            });

        } catch (error) {
            console.error('Generation error:', error);
            updateMessage(assistantMessageId ?? '', {
                content: `Sorry, there was an error generating your 3D model: ${error instanceof Error ? error.message : 'Unknown error'}`,
                isGenerating: false,
            });
        } finally {
            setIsGenerating(false);
            if (currentGenerationType.value === 'image-to-3d') {
                removeImage();
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const getPlaceholder = () => {
        switch (currentGenerationType.value) {
            case 'text-to-3d':
                return currentModel ?
                    "Describe changes to your model or create something new..." :
                    "Describe the 3D model you want to create...";
            case 'image-to-3d':
                return "Describe what you want to generate from the image (optional)...";
            case 'refine':
                return currentModel ?
                    "Describe the textures or refinements you want..." :
                    "Generate a model first, then describe refinements...";
            default:
                return "Type your message...";
        }
    };

    return (
        <div className="w-full h-auto p-2 border-t border-white/10">
            {imagePreview && currentGenerationType.value === 'image-to-3d' && (
                <div className="py-1">
                    <div className="relative inline-block">
                        <img
                            src={imagePreview}
                            alt="Upload preview"
                            className="w-16 h-16 object-cover rounded-lg border border-white/20"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs"
                        >
                            <X size={10} />
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full flex flex-col min-h-20 max-h-60 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm">
                <textarea
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={getPlaceholder()}
                    className="w-full flex-1 px-3 py-3 text-white placeholder-gray-400 focus:outline-none resize-none"
                    disabled={isGenerating}
                />

                <div className="px-2 py-1.5 grow-0 flex items-center gap-2 text-xs text-gray-400 border-t border-white/10">
                    <div className='space-x-2'>
                        {/* Image Upload Button */}
                        {(currentGenerationType.value === 'image-to-3d' || currentGenerationType.value === 'refine') && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Upload Image"
                            >
                                <Image size={20} />
                            </button>
                        )}

                        {/* Settings Toggle */}
                        <button
                            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                            className={`p-2 rounded-lg transition-colors ${showAdvancedSettings
                                ? 'text-purple-300 bg-purple-500/20'
                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                                }`}
                            title="Advanced Settings"
                        >
                            <Settings size={20} />
                        </button>
                    </div>

                    <AdvancedSettings showSettings={showAdvancedSettings} />

                    {/* Send Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={(!currentInput.trim() && !currentImage) || isGenerating}
                        className="p-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        title="Send Message"
                    >
                        {isGenerating ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send size={20} />
                        )}
                    </button>
                </div>
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />
        </div>
    );
}

function getSuccessMessage(type: GenerationType, modelVersion: MeshyModelVersion): string {
    switch (type) {
        case 'text-to-3d':
            return `🎉 Your 3D model has been generated using ${modelVersion}! You can view it above, refine it further, or create something new.`;
        case 'image-to-3d':
            return `📸 Successfully converted your image to a 3D model using ${modelVersion}! Feel free to refine it or upload another image.`;
        case 'refine':
            return `✨ Your model has been refined with new textures using ${modelVersion}! The enhanced version is ready for preview.`;
        default:
            return `✅ Generation complete using ${modelVersion}!`;
    }
}