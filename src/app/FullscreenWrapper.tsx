'use client'

import React, { useState, useEffect } from 'react';
import { CgMaximizeAlt, CgMinimize } from "react-icons/cg";

interface FullscreenWrapperProps {
    children: React.ReactNode;
    iconPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    showIcon?: boolean
    iconClasses?: string
    fullScreenByKey?: boolean
}


export default function FullscreenWrapper({ children, iconPosition = 'top-right', showIcon = true, iconClasses, fullScreenByKey= false }: FullscreenWrapperProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Handle escape key press
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
            else if ((event.key === 'F' || event.key === 'f') && fullScreenByKey) {
                setIsFullscreen((pre)=> !pre);
            }
        };

        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isFullscreen]);

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const wrapperClasses = isFullscreen
        ? 'fixed w-screen h-screen top-0 left-0 z-50 bg-white'
        : 'relative w-full h-full';

    let positionClass: string;
    if (iconPosition == 'top-right') positionClass = 'top-4 right-4'
    else if (iconPosition == 'top-left') positionClass = 'top-4 left-4'
    else if (iconPosition == 'bottom-left') positionClass = 'bottom-4 left-4'
    else if (iconPosition == 'bottom-right') positionClass = 'bottom-4 right-4'
    else positionClass = 'top-4 right-4'

    return (
        <div className={wrapperClasses}>
            {children}

            {/* Toggle button */}
            {showIcon &&
                <button
                    onClick={toggleFullscreen}
                    className={iconClasses ? iconClasses : `absolute ${positionClass} p-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-lg transition-colors duration-200 z-10`}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
            {isFullscreen ? (
                <CgMinimize size={20} />
            ) : (
                <CgMaximizeAlt size={20} />
            )}
        </button>
            }
        </div >
    );
};