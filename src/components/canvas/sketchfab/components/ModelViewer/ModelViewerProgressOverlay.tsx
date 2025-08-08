interface ModelViewerProgressOverlayProps {
    progress: number;
}

export default function ModelViewerProgressOverlay({ progress }: ModelViewerProgressOverlayProps) {
    return (
        <div className="absolute top-16 left-6 right-6 z-10">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8">
                        <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                            <circle
                                cx="16"
                                cy="16"
                                r="14"
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="2"
                                fill="none"
                            />
                            <circle
                                cx="16"
                                cy="16"
                                r="14"
                                stroke="#10b981"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 14}`}
                                strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress / 100)}`}
                                className="transition-all duration-300"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{Math.round(progress)}%</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-white text-sm font-medium">Adding to Sidebar...</p>
                        <p className="text-gray-300 text-xs">
                            {progress < 20 && "Getting download options..."}
                            {progress >= 20 && progress < 40 && "Downloading GLB file..."}
                            {progress >= 40 && progress < 60 && "Processing file..."}
                            {progress >= 60 && progress < 80 && "Preparing model data..."}
                            {progress >= 80 && "Finalizing..."}
                        </p>
                    </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                    <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}