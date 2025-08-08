interface SearchSkeletonProps {
    count?: number;
}

function ModelCardSkeleton() {
    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden animate-pulse">
            {/* Thumbnail skeleton */}
            <div className="relative aspect-square overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-600/50 to-gray-700/50"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-2 left-2 right-2">
                    <div className="h-4 bg-white/30 rounded mb-1"></div>
                    <div className="h-3 bg-white/20 rounded w-3/4"></div>
                </div>
            </div>

            {/* Content skeleton */}
            <div className="p-2">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-gray-600/50 rounded-full"></div>
                    <div className="h-3 bg-gray-600/50 rounded flex-1"></div>
                </div>

                <div className="space-y-1 mb-1">
                    <div className="h-2 bg-gray-600/40 rounded"></div>
                    <div className="h-2 bg-gray-600/40 rounded w-4/5"></div>
                </div>

                <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-600/50 rounded"></div>
                        <div className="h-2 w-6 bg-gray-600/50 rounded"></div>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-600/50 rounded"></div>
                        <div className="h-2 w-6 bg-gray-600/50 rounded"></div>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-600/50 rounded"></div>
                        <div className="h-2 w-6 bg-gray-600/50 rounded"></div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                    <div className="h-5 w-12 bg-gray-600/30 rounded-full"></div>
                    <div className="h-5 w-16 bg-gray-600/30 rounded-full"></div>
                    <div className="h-5 w-10 bg-gray-600/30 rounded-full"></div>
                </div>

                <div className="flex gap-1">
                    <div className="flex-1 h-8 bg-gradient-to-r from-gray-600/50 to-gray-700/50 rounded-lg"></div>
                    <div className="w-8 h-8 bg-gray-600/50 rounded-lg"></div>
                    <div className="w-8 h-8 bg-gray-600/50 rounded-lg"></div>
                    <div className="w-8 h-8 bg-gray-600/50 rounded-lg"></div>
                </div>

                <div className="h-2 bg-gray-600/40 rounded mt-2 mx-auto w-16"></div>
            </div>
        </div>
    );
}

export default function SearchSkeleton({ count = 18 }: SearchSkeletonProps) {
    return (
        <div className="w-full h-full">
            <div className="grid grid-cols-3 gap-4 p-2">
                {Array.from({ length: count }).map((_, index) => (
                    <ModelCardSkeleton key={`skeleton-${index}`} />
                ))}
            </div>
        </div>
    );
}