'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Settings } from 'lucide-react';
import { useMeshyChat } from '../../../context/MeshyChatContext';
import { GenerationType, MeshyTextTo3DRequest, MeshyImageTo3DRequest, MeshyRefineRequest, MeshyModelVersion, } from '../../../types';
import AdvancedSettings from './AdvancedSettings';
import { useGet3DFromText } from '../../../hooks/get3DFromText';
import { useGet3DFromImage } from '../../../hooks/get3DFromImage';
import { useRefineModel } from '../../../hooks/getRefineModel';
import ImagePreview from './ImagePreview';
import ChatInput from './ChatInput';

export default function InputArea() {
    const {
        messages,
        addMessage,
        updateMessage,
        currentModel,
        currentInput,
        setCurrentInput,
        currentImages,
        addCurrentImage,
        clearCurrentImages,
        isGenerating,
        setIsGenerating,
        currentGenerationType,
        currentArtStyle,
        currentSymmetry,
        setCurrent3DModel,
        currentRefineModelData,
        setCurrentRefineModelData
    } = useMeshyChat();

    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Mutation hooks
    const textTo3DMutation = useGet3DFromText();
    const imageTo3DMutation = useGet3DFromImage();
    const refineModelMutation = useRefineModel();

    const processImageFile = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                reject(new Error('Image file size must be less than 10MB'));
                return;
            }

            // Check file type
            const supportedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!supportedTypes.includes(file.type)) {
                reject(new Error('Please upload a JPG, JPEG or PNG image'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                resolve(result);
            };
            reader.onerror = () => {
                reject(new Error('Error reading the image file'));
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        // Check if adding these files would exceed the limit
        if (currentImages.length + files.length > 4) {
            const remainingSlots = 4 - currentImages.length;
            if (remainingSlots === 0) {
                alert('You can upload a maximum of 4 images. Please remove some images first.');
                return;
            } else {
                alert(`You can only add ${remainingSlots} more image(s). Only the first ${remainingSlots} will be uploaded.`);
            }
        }

        const filesToProcess = files.slice(0, 4 - currentImages.length);

        try {
            for (const file of filesToProcess) {
                const dataUri = await processImageFile(file);
                addCurrentImage(dataUri);
            }
        } catch (error) {
            console.error('Error processing images:', error);
            alert(error instanceof Error ? error.message : 'Error processing images');
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async () => {
        if (!currentInput.trim() && currentImages.length === 0) return;
        if (isGenerating) return;
        clearCurrentImages();
        setCurrentRefineModelData(null);


        // Add user message with multiple images
        addMessage({
            type: 'user',
            content: currentInput.trim(),
            generationType: currentGenerationType.value,
            imageUrls: currentImages.length > 0 ? currentImages : undefined,
            imageUrl: currentImages.length > 0 ? currentImages[0] : undefined, // Backward compatibility
            refineModelData: currentRefineModelData ?? undefined,
        });

        // Add assistant thinking message
        const assistantMessageId = addMessage({
            type: 'assistant',
            content: `Generating your 3D model using ${currentModel.value} (${currentArtStyle.value}, ${currentSymmetry.value})${currentImages.length > 1 ? ` with ${currentImages.length} images` : ''}...`,
            isGenerating: true
        });

        setIsGenerating(true);
        try {
            let result;

            if (currentRefineModelData != null) {
                const refineRequest: MeshyRefineRequest = {
                    preview_task_id: currentRefineModelData.preview_task_id,
                    texture_prompt: currentInput.trim(),
                    texture_image_url: currentImages,
                    model_version: currentModel.value,
                    moderation: true
                };
                result = await refineModelMutation.mutateAsync(refineRequest);
            }
            else if (currentGenerationType.value == 'text-to-3d') {
                const textRequest: MeshyTextTo3DRequest = {
                    prompt: currentInput.trim(),
                    art_style: currentArtStyle.value,
                    symmetry: currentSymmetry.value,
                    seed: Math.floor(Math.random() * 1000000),
                    model_version: currentModel.value
                };
                result = await textTo3DMutation.mutateAsync(textRequest);
            }
            else if (currentGenerationType.value == 'image-to-3d') {
                const imageRequest: MeshyImageTo3DRequest = {
                    image_data: currentImages,
                    symmetry: currentSymmetry.value,
                    model_version: currentModel.value,
                    texture_prompt: currentInput.trim(),
                };
                result = await imageTo3DMutation.mutateAsync(imageRequest);
            }
            else {
                throw new Error('Invalid generation type');
            }

            // Update current model
            setCurrent3DModel(result);

            // Update assistant message with success
            updateMessage(assistantMessageId ?? '', {
                content: getSuccessMessage(currentGenerationType.value, currentModel.value, currentImages.length),
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
            clearCurrentImages();
        }
    };


    const getPlaceholder = () => {
        switch (currentGenerationType.value) {
            case 'text-to-3d':
                return currentModel ?
                    "Describe changes to your model or create something new..." :
                    "Describe the 3D model you want to create...";
            case 'image-to-3d':
                return currentImages.length > 0 ?
                    `Describe what you want to generate from ${currentImages.length} image(s) (optional)...` :
                    "Upload images and describe what you want to generate (optional)...";
            default:
                return "Type your message...";
        }
    };

    return (
        <div className="w-full h-auto p-2 border-t border-white/10">
            <ImagePreview fileInputRef={fileInputRef} />

            <div className="w-full flex flex-col min-h-20 max-h-96 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm">
                <ChatInput
                    onSendMessage={handleSubmit}
                    placeholder={getPlaceholder()}
                    minHeight={50}
                    maxHeight={250}
                    disabled={isGenerating}
                />

                <div className="px-2 py-1.5 grow-0 flex items-center gap-2 text-xs text-gray-400 border-t border-white/10">
                    <div className='space-x-2'>
                        {/* Image Upload Button */}
                        {(currentGenerationType.value === 'image-to-3d' ||  currentRefineModelData) && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title={`Upload Images (${currentImages.length}/4)`}
                                disabled={currentImages.length >= 4}
                            >
                                <ImageIcon size={20} />
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
                        disabled={(!currentInput.trim() && currentImages.length === 0) || isGenerating}
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
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
                multiple
            />
        </div>
    );
}

function getSuccessMessage(type: GenerationType, modelVersion: MeshyModelVersion, imageCount: number): string {
    switch (type) {
        case 'text-to-3d':
            return `🎉 Your 3D model has been generated using ${modelVersion}! You can view it above, refine it further, or create something new.`;
        case 'image-to-3d':
            const imageText = imageCount > 1 ? `${imageCount} images` : 'your image';
            return `📸 Successfully converted ${imageText} to a 3D model using ${modelVersion}! Feel free to refine it or upload more images.`;
        default:
            return `✅ Generation complete using ${modelVersion}!`;
    }
}