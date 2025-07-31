// src/components/canvas/meshy/components/ChatInterface/InputArea/ImagePreview.tsx
import { Image, X, Sparkles } from 'lucide-react';
import { useMeshyChat } from "../../../context/MeshyChatContext";

interface ImagePreviewProps {
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function ImagePreview({ fileInputRef }: ImagePreviewProps) {
    const { currentImages, currentGenerationType, removeCurrentImage, currentRefineModelData, setCurrentRefineModelData } = useMeshyChat();

    const shouldShow = (currentGenerationType.value === 'text-to-3d' && (currentImages.length > 0 || currentRefineModelData) ||
        (currentImages.length !== 0 && currentGenerationType.value == 'image-to-3d'));

    if (!shouldShow) {
        return null;
    }


    return (
        <div className="py-2">
            <div className="flex flex-wrap gap-2">
                {/* Show current model thumbnail if we're refining */}
                {currentRefineModelData && (
                    <div className="relative inline-block">
                        <div className="relative">
                            <img
                                src={currentRefineModelData.model_thumbnail_url}
                                alt="Model to refine"
                                className="w-16 h-16 object-cover rounded-lg border border-purple-400 bg-gray-800"
                            />
                            {/* Model indicator overlay */}
                            <div className="absolute inset-0 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <Sparkles size={12} className="text-purple-300" />
                            </div>
                            {/* Model label */}
                            <div className="absolute -bottom-1 left-0 right-0 bg-purple-500 text-white text-[8px] text-center rounded-b-lg px-1">
                                3D MODEL
                            </div>
                        </div>
                        <button
                            onClick={() => setCurrentRefineModelData(null)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs"
                            title="Remove model from refinement"
                        >
                            <X size={10} />
                        </button>
                    </div>
                )}

                {currentImages.map((image, index) => (
                    <div key={index} className="relative inline-block">
                        <img
                            src={image}
                            alt={`Upload preview ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg border border-white/20"
                        />
                        <button
                            onClick={() => removeCurrentImage(index)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs"
                        >
                            <X size={10} />
                        </button>
                    </div>
                ))}

                {/* Add more images button */}
                {currentImages.length < 4 && (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-16 h-16 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-colors"
                    >
                        <Image size={20} />
                    </button>
                )}
            </div>

            {/* Multi-image info */}
            {/* {currentImages.length > 1 && (
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-300">
                    <AlertCircle size={14} />
                    <span>
                        {currentImages.length} images selected - using advanced Meshy-5 model for better multi-image processing
                    </span>
                </div>
            )} */}
        </div>
    );
}