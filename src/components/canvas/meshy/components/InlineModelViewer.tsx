// src/components/canvas/meshy/components/InlineModelViewer.tsx
"use client";

import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Html } from '@react-three/drei';
import { Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { Meshy3DObjectResponse } from '../types';
import React from 'react';

interface InlineModelViewerProps {
    modelData: Meshy3DObjectResponse;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
}

function Model({ url }: { url: string }) {
    const proxyUrl = `/api/meshy/model?url=${encodeURIComponent(url)}`;
    try {
        const { scene } = useGLTF(proxyUrl);
        return <primitive object={scene} scale={1} />;
    } catch (error) {
        console.warn('Failed to load model:', error);
        return null;
    }
}

function LoadingSpinner() {
    return (
        <Html center>
            <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
        </Html>
    );
}

function ErrorFallback() {
    return (
        <Html center>
            <div className="text-center text-red-400">
                <div className="text-2xl mb-2">⚠️</div>
                <p className="text-sm">Failed to load model</p>
            </div>
        </Html>
    );
}

export default function InlineModelViewer({
    modelData,
    isExpanded = false,
    onToggleExpand
}: InlineModelViewerProps) {
    const [resetKey, setResetKey] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const modelUrl = modelData.model_urls?.glb;

    // Intersection Observer to only render when visible
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        observer.observe(containerRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    if (!modelUrl) {
        return (
            <div className="w-full h-32 bg-gray-800/50 rounded-lg flex items-center justify-center border border-gray-600/30">
                <div className="text-center text-gray-400">
                    <div className="text-2xl mb-2">📦</div>
                    <p className="text-sm">Model not available</p>
                </div>
            </div>
        );
    }

    const handleReset = () => {
        setResetKey(prev => prev + 1);
    };

    return (
        <div
            ref={containerRef}
            className="w-full bg-gray-900/50 rounded-lg overflow-hidden border border-gray-600/30"
        >
            {/* Controls Bar */}
            <div className="flex items-center justify-between p-2 bg-gray-800/60 border-b border-gray-600/30">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>3D Model • {modelData.id.slice(0, 30)}</span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={handleReset}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                        title="Reset View"
                    >
                        <RotateCcw size={14} />
                    </button>

                    {onToggleExpand && (
                        <button
                            onClick={onToggleExpand}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                            title={isExpanded ? "Minimize" : "Expand"}
                        >
                            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                        </button>
                    )}
                </div>
            </div>

            {/* 3D Viewer - Only render when visible */}
            <div className="w-full flex-1 relative" style={{ height: 'calc(450px - 48px)' }}>
                {isVisible ? (
                    <Canvas
                        key={resetKey}
                        camera={{ position: [0, 0, 5], fov: 50 }}
                        style={{
                            background: 'linear-gradient(135deg, #1e293b 0%, #0f1419 100%)',
                            width: '100%',
                            height: '100%'
                        }}
                        gl={{
                            antialias: false, // Reduce GPU load
                            alpha: false,
                            powerPreference: "high-performance"
                        }}
                        frameloop="demand" // Only render when needed
                    >
                        <ambientLight intensity={0.4} />
                        <directionalLight position={[5, 5, 2]} intensity={0.8} />
                        <directionalLight position={[-5, -5, -2]} intensity={0.2} />

                        <Suspense fallback={<LoadingSpinner />}>
                            <ErrorBoundary fallback={<ErrorFallback />}>
                                <Model url={modelUrl} />
                                <Environment preset="studio" />
                            </ErrorBoundary>
                        </Suspense>

                        <OrbitControls
                            enablePan={true}
                            enableZoom={true}
                            enableRotate={true}
                            minDistance={1}
                            maxDistance={15}
                            autoRotate={false}
                            dampingFactor={0.05}
                            enableDamping={true}
                            makeDefault
                        />
                    </Canvas>
                ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <div className="text-gray-400 text-sm">
                            <div className="animate-pulse">Loading viewer...</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Simple Error Boundary component
class ErrorBoundary extends React.Component<
    { children: React.ReactNode; fallback: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.warn('3D Model Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}