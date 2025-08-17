'use client';

import { useEffect, useState } from "react";

interface SearchBarProps {
    onSearch: (newQuery: string) => void;
    currentQuery: string;
    isSearching: boolean;
}

export default function SearchBar({ onSearch, currentQuery, isSearching }: SearchBarProps) {
    const [inputValue, setInputValue] = useState(currentQuery);

    useEffect(() => {
        setInputValue(currentQuery);
    }, [currentQuery]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch(inputValue);
        }
    };

    return (
        <div className="max-w-[650px] mx-auto mb-12">
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search for free downloadable 3D models..."
                    className="w-full px-6 py-2 text-base font-semibold bg-white/50 backdrop-blur-md border border-gray-800 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    disabled={isSearching}
                />
                {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </div>
    );
}