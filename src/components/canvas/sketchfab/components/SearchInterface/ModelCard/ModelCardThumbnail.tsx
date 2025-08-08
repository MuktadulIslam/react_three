import Image from 'next/image';
import { SketchfabModel } from '../../../types';
import AddToSidebarOverlay from './AddToSidebarOverlay';

interface ModelCardThumbnailProps {
    model: SketchfabModel;
    isThisModelAddingToSidebar: boolean;
    addToSidebarProgress: number;
    isAlreadyInSidebar: boolean;
}

export default function ModelCardThumbnail({ model, isThisModelAddingToSidebar, addToSidebarProgress, isAlreadyInSidebar }: ModelCardThumbnailProps) {
    return (
        <div className="relative aspect-square overflow-hidden">
            {model.thumbnails?.images?.[0]?.url ? (
                <Image
                    width={300}
                    height={300}
                    src={model.thumbnails.images[0].url}
                    alt={model.name || 'Untitled Model'}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-2 left-2 right-2">
                <h3 className="text-white font-semibold text-base truncate">
                    {model.name || 'Untitled Model'}
                </h3>
                {isAlreadyInSidebar && (
                    <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-green-300 text-xs font-medium">Added to Sidebar</span>
                    </div>
                )}
            </div>

            {isThisModelAddingToSidebar && (
                <AddToSidebarOverlay progress={addToSidebarProgress} />
            )}
        </div>
    );
}