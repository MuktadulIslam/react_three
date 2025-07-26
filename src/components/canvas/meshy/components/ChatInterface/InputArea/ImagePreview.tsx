import { useMeshyChat } from "../../../context/MeshyChatContext";
import { X, } from 'lucide-react';
export default function ImagePreview({ removeImage }: { removeImage: () => void }) {
    const { currentImage, currentGenerationType } = useMeshyChat();

    return (
        <>
            {currentImage && currentGenerationType.value === 'image-to-3d' && (
                <div className="py-1">
                    <div className="relative inline-block">
                        <img
                            src={currentImage}
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
        </>
    );
}