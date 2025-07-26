"use client";

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Html } from '@react-three/drei';
import { LuRotate3D } from "react-icons/lu";
import { RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { Meshy3DObjectResponse } from '../types';

interface ModelViewerProps {
    modelUrl: string | null;
    modelData?: Meshy3DObjectResponse;
    showControls?: boolean;
    showPreview?: boolean;
}

function Model({ url }: { url: string }) {
    const proxyUrl = `/api/meshy/model?url=${encodeURIComponent(url)}`;
    const { scene } = useGLTF(proxyUrl);
    return <primitive object={scene} scale={1} />;
}

function LoadingSpinner() {
    return (
        <Html center>
            <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        </Html>
    );
}

export function ModelViewer({ modelUrl, modelData, showControls = true, showPreview = true }: ModelViewerProps) {
    const [resetKey, setResetKey] = useState(0);
    const [autoRotate, setAutoRotate] = useState(false);
    const [isExpanded, setExpanded] = useState(false);

    const handleReset = () => {
        setResetKey(prev => prev + 1);
    };

    const onToggleExpand = () => { setExpanded(!isExpanded) }


    if (!modelUrl) {
        return (
            <div className="h-96 bg-slate-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🎨</div>
                    <p className="text-slate-400">
                        Your 3D model will appear here
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="h-[450px] w-full flex flex-col relative mt-2 bg-gray-800/60 backdrop-blur-md rounded-lg overflow-hidden">
                <div className="w-full h-auto flex gap-1 items-center justify-between text-sky-400 py-1 px-2">
                    <div className="flex-1 items-center gap-3">
                        {showPreview ? (<>
                            <div className='flex items-center'>
                                <LuRotate3D size={20} />
                                <h2 className="text-base font-semibold ml-1 mr-2">
                                    3D Model Preview
                                </h2>
                                {modelData && (
                                    <span className="text-xs text-gray-300 bg-black/50 px-2 py-0.5 rounded">
                                        {modelData.id}
                                    </span>
                                )}
                            </div>
                        </>) : (
                            <div className="flex flex-row items-center text-xs text-green-400">
                                <LuRotate3D size={15} />
                                <div className='whitespace-nowrap ml-1 mr-2'>3D Model</div>
                                {modelData && (
                                    <div className="text-gray-300 whitespace-nowrap text-ellipsis">
                                        {modelData.id.slice(0, 20)}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {showControls && (
                        <div className="flex items-center gap-1 text-white">
                            <button
                                onClick={() => setAutoRotate(!autoRotate)}
                                className={`p-2 rounded-lg transition-colors ${autoRotate
                                    ? 'text-blue-300 bg-blue-500/40'
                                    : 'hover:bg-white/20 rounded-lg'
                                    }`}
                                title="Toggle Auto Rotate"
                            >
                                <LuRotate3D size={18} />
                            </button>

                            <button
                                onClick={handleReset}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                title="Reset View"
                            >
                                <RotateCcw size={17} />
                            </button>

                            {showPreview &&
                                <button
                                    onClick={onToggleExpand}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                    title={isExpanded ? "Minimize" : "Expand"}
                                >
                                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                </button>
                            }
                        </div>
                    )}
                </div>

                <div className="flex-1 bg-gradient-to-b from-gray-600 to-gray-950 bg-slate-700 overflow-hidden">
                    <Canvas
                        camera={{ position: [0, 0, 5], fov: 50 }}
                        key={resetKey}
                    >
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1} />
                        <directionalLight position={[-10, -10, -5]} intensity={0.3} />

                        <Suspense fallback={<LoadingSpinner />}>
                            <Model url={modelUrl} />
                            <Environment preset="studio" />
                        </Suspense>

                        <OrbitControls
                            enablePan={true}
                            enableZoom={true}
                            enableRotate={true}
                            minDistance={1}
                            maxDistance={100}
                            autoRotate={autoRotate}
                            autoRotateSpeed={3}
                            dampingFactor={0.05}
                            enableDamping={true}
                            target={[0, 0, 0]} // Ensure orbit controls target the center
                            makeDefault
                        />
                    </Canvas>
                </div>
            </div>
        </>
    );
}