interface AddToSidebarOverlayProps {
    progress: number;
}

export default function AddToSidebarOverlay({ progress }: AddToSidebarOverlayProps) {
    return (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <div className="w-16 h-16 relative mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                    <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="4"
                        fill="none"
                    />
                    <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#3b82f6"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                        className="transition-all duration-300"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{Math.round(progress)}%</span>
                </div>
            </div>
            <span className="text-white text-sm font-medium">Adding to Sidebar...</span>
        </div>
    );
}