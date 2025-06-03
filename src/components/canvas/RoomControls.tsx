import React from 'react';

interface RoomControlsProps {
    width: number;
    height: number;
    onWidthChange: (width: number) => void;
    onHeightChange: (height: number) => void;
}

// Room controls component
export default function RoomControls({
    width,
    height,
    onWidthChange,
    onHeightChange
}: RoomControlsProps) {
    const MAX_WIDTH = 30;
    const MIN_WIDTH = 6;
    const MAX_HEIGHT = 30;
    const MIN_HEIGHT = 6;

    const handleWidthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= MIN_WIDTH && value <= MAX_WIDTH) {
            onWidthChange(value);
        }
    };

    const handleHeightInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= MIN_HEIGHT && value <= MAX_HEIGHT) {
            onHeightChange(value);
        }
    };

    return (
        <div className="absolute top-5 left-5 text-white font-sans text-sm bg-black bg-opacity-80 p-5 rounded-lg min-w-[250px]">
            <h3 className="m-0 mb-4 text-white">Room Controls</h3>

            <div className="mb-4">
                <label className="block mb-1">
                    Width: {width} tiles
                </label>
                <div className="flex gap-2.5 items-center">
                    <input
                        type="range"
                        min={MIN_WIDTH}
                        max={MAX_WIDTH}
                        step="1"
                        value={width}
                        onChange={(e) => onWidthChange(parseInt(e.target.value))}
                        className="flex-1 h-1.5 rounded bg-gray-300 outline-none appearance-none slider"
                    />
                    <input
                        type="number"
                        min={MIN_WIDTH}
                        max={MAX_WIDTH}
                        value={width}
                        onChange={handleWidthInputChange}
                        className="w-12 p-1 rounded border border-gray-600 bg-gray-800 text-white text-xs"
                    />
                </div>
            </div>

            <div className="mb-5">
                <label className="block mb-1">
                    Height: {height} tiles
                </label>
                <div className="flex gap-2.5 items-center">
                    <input
                        type="range"
                        min={MIN_HEIGHT}
                        max={MAX_HEIGHT}
                        step="1"
                        value={height}
                        onChange={(e) => onHeightChange(parseInt(e.target.value))}
                        className="flex-1 h-1.5 rounded bg-gray-300 outline-none appearance-none slider"
                    />
                    <input
                        type="number"
                        min={MIN_HEIGHT}
                        max={MAX_HEIGHT}
                        value={height}
                        onChange={handleHeightInputChange}
                        className="w-12 p-1 rounded border border-gray-600 bg-gray-800 text-white text-xs"
                    />
                </div>
            </div>

            <div className="border-t border-gray-600 pt-4">
                <div className="text-xs opacity-80 mb-2.5">
                    <strong>Total tiles: {width * height}</strong>
                </div>
                <div className="text-xs opacity-80">
                    <div>⚙️ Scroll to zoom</div>
                    <div>🔧 Ctrl+Shift+S to toggle controls</div>
                </div>
            </div>
        </div>
    );
};