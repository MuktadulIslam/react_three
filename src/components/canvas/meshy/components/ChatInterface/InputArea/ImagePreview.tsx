// src/components/canvas/meshy/components/ChatInterface/InputArea/ImagePreview.tsx
import { useMeshyChat } from "../../../context/MeshyChatContext";
import { X, Image as ImageIcon } from 'lucide-react';

export default function ImagePreview({ removeImage }: { removeImage: () => void }) {
    const { currentImages, currentGenerationType, removeCurrentImage } = useMeshyChat();

    if (currentImages.length === 0 || (currentGenerationType.value !== 'image-to-3d' && currentGenerationType.value !== 'refine')) {
        return null;
    }

    return (
        <div className="py-2">
            <div className="flex flex-wrap gap-2">
                {currentImages.map((image, index) => (
                    <div key={index} className="relative inline-block group">
                        <img
                            src={image}
                            alt={`Upload preview ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg border border-white/20 group-hover:border-white/40 transition-colors"
                        />

                        {/* Remove button */}
                        <button
                            onClick={() => removeCurrentImage(index)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition-opacity"
                            title={`Remove image ${index + 1}`}
                        >
                            <X size={10} />
                        </button>

                        {/* Image number */}
                        <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1 rounded text-[10px]">
                            {index + 1}
                        </div>
                    </div>
                ))}
            </div>

            {/* Multi-image information */}
            {currentImages.length > 1 && (
                <div className="mt-2 p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-blue-200">
                        <ImageIcon size={16} />
                        <span>
                            <strong>{currentImages.length} images</strong> selected - using advanced Meshy-5 model for optimal multi-image processing
                        </span>
                    </div>
                </div>
            )}

            {/* Usage tips */}
            {currentImages.length > 0 && (
                <div className="mt-2 text-xs text-gray-400 space-y-1">
                    <div>💡 <strong>Tips:</strong></div>
                    <div>• First image is used as primary reference</div>
                    {currentImages.length > 1 && (
                        <>
                            <div>• Additional images provide context and details</div>
                            <div>• Multiple images automatically use Meshy-5 for better results</div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}