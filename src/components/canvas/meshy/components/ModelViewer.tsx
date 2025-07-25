"use client";

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Html } from '@react-three/drei';
import { LuRotate3D } from "react-icons/lu";

interface ModelViewerProps {
    modelUrl: string | null;
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

export function ModelViewer({ modelUrl }: ModelViewerProps) {
    return (
        <div className="bg-stone-400/50 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="w-full h-auto flex gap-1 items-cente text-white mb-4">
                <LuRotate3D size={25} />
                <h2 className="text-xl font-semibold">
                    3D Model Preview
                </h2>
            </div>


            {!modelUrl ? (<div className="h-96 bg-slate-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🎨</div>
                    <p className="text-slate-400">
                        Your 3D model will appear here
                    </p>
                </div>
            </div>) :
                (<div className="h-96 bg-slate-700 rounded-lg overflow-hidden">
                    <Canvas
                        camera={{ position: [0, 0, 5], fov: 50 }}
                        style={{ background: 'linear-gradient(to bottom, #0f0f0f, #1e293b)' }}
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
                            maxDistance={20}
                        />
                    </Canvas>
                </div>)}

        </div>
    );
}