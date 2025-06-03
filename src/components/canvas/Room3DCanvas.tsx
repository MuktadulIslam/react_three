"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useProgress, Html } from '@react-three/drei';
import Room from '@/components/rooms/room1/Room';
import RoomControls from '@/components/canvas/RoomControls'

const HtmlLoader = () => {
  return (
    <Html center>
      <div className="spinner"></div>
      <style>{`
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top: 4px solid #fff;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Html>
  )
}

export default function Room3DCanvas() {
    const [roomWidth, setRoomWidth] = useState<number>(10);
    const [roomHeight, setRoomHeight] = useState<number>(10);
    const [controlsVisible, setControlsVisible] = useState<boolean>(true);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check for Ctrl+Shift+S combination
            if (event.ctrlKey && event.shiftKey && event.key === 'S') {
                event.preventDefault(); // Prevent default browser save dialog
                setControlsVisible(prev => !prev);
            }
        };

        // Add event listener
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className="w-screen h-screen bg-[#226764a8]">
            <Canvas
                camera={{ position: [8, 4, 8], fov: 60 }}
                shadows
            >
                <Suspense fallback={<HtmlLoader />}>
                    {/* Lighting */}
                    <ambientLight intensity={0.3} />
                    <directionalLight
                        position={[10, 10, 5]}
                        intensity={1}
                        castShadow
                    />
                    <pointLight
                        position={[roomWidth / 2 - 1, 3, -roomHeight / 2 + 1]}
                        intensity={0.8}
                        color="#fff8dc"
                    />

                    {/* Room structure */}
                    <Room width={roomWidth} length={roomHeight} />

                    {/* Environment and controls */}
                    <Environment preset="apartment" />
                    <OrbitControls
                        enableZoom={true}
                        enableRotate={true}
                        minDistance={1}
                        maxDistance={50}
                        enableDamping={true}
                        dampingFactor={0.05}
                    />
                </Suspense>
            </Canvas>

            {/* Room Controls */}
            {controlsVisible &&
                <RoomControls
                    width={roomWidth}
                    height={roomHeight}
                    onWidthChange={setRoomWidth}
                    onHeightChange={setRoomHeight}
                />
            }
        </div>
    );
};