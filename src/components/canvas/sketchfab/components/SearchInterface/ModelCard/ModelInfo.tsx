import { Download, Heart, Eye, } from 'lucide-react';
import Image from 'next/image';
import { SketchfabModel } from '../../../types';

export default function ModelInfo({ model }: { model: SketchfabModel }) {
    const formatNumber = (num: number | undefined): string => {
        if (num === undefined || num === null) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div>
            <div className="flex items-center gap-2 mb-1">
                {model.user?.avatar?.images?.[0]?.url && (
                    <Image
                        width={50}
                        height={50}
                        src={model.user.avatar.images[0].url}
                        alt={model.user.displayName || 'User'}
                        className="w-6 h-6 rounded-full"
                    />
                )}
                <span className="text-gray-700 text-sm font-semibold truncate">
                    {model.user?.displayName || 'Unknown User'}
                </span>
            </div>

            {model.description &&
                <p className="text-gray-700 text-xs mb-1 line-clamp-2">
                    {model.description}
                </p>
            }

            <div className="flex items-center gap-4 mb-2 text-gray-500 text-sm">
                <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span>{formatNumber(model.viewCount)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Heart size={14} />
                    <span>{formatNumber(model.likeCount)}</span>
                </div>
                <div className="flex items-center gap-1 relative">
                    <Download size={14} />
                    <span>{formatNumber(model.downloadCount)}</span>
                </div>
            </div>

            {model.tags && model.tags.length != 0 &&
                <div className="flex flex-wrap gap-1 mb-4">
                    {model.tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 pt-0.5 pb-1 bg-gray-600/20 text-[#212b3c] text-xs border border-gray-500 rounded-full"
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
            }
        </div>

    )
}