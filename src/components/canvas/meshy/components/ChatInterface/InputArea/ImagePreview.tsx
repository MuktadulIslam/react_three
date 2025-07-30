// src/components/canvas/meshy/components/ChatInterface/InputArea/ImagePreview.tsx
import { Image, X, AlertCircle } from 'lucide-react';
import { useMeshyChat } from "../../../context/MeshyChatContext";

interface ImagePreviewProps {
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function ImagePreview({ fileInputRef }: ImagePreviewProps) {
    const { currentImages, currentGenerationType, removeCurrentImage } = useMeshyChat();

    if (currentImages.length === 0 || (currentGenerationType.value !== 'image-to-3d' && currentGenerationType.value !== 'refine')) {
        return null;
    }

    return (
        <div className="py-2">
            <div className="flex flex-wrap gap-2">
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
            {currentImages.length > 1 && (
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-300">
                    <AlertCircle size={14} />
                    <span>
                        {currentImages.length} images selected - using advanced Meshy-5 model for better multi-image processing
                    </span>
                </div>
            )}
        </div>
    );
}