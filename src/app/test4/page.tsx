'use client'
import React, { useRef, useState, useEffect, JSX } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { DragControls } from 'three/addons/controls/DragControls.js';

// Types
interface DraggableMeshProps {
  position: [number, number, number];
  color: number;
  geometry: JSX.Element;
  name: string;
  scale?: [number, number, number];
}

// Floor Component
const Floor: React.FC = () => {
  return (
    <mesh 
      position={[0, -1, 3]} 
      scale={[100, 2, 100]}
      castShadow 
      receiveShadow
      userData={{ ground: true }}
    >
      <boxGeometry />
      <meshPhongMaterial color={0xf9c834} />
    </mesh>
  );
};

// Generic Draggable Mesh Component
const DraggableMesh: React.FC<DraggableMeshProps> = ({ 
  position, 
  color, 
  geometry, 
  name,
  scale = [1, 1, 1]
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      castShadow
      receiveShadow
      userData={{ draggable: true, name }}
    >
      {geometry}
      <meshPhongMaterial color={color} />
    </mesh>
  );
};

// DragControlsHandler
const DragControlsHandler: React.FC = () => {
  const { camera, gl, scene } = useThree();
  const [draggableObjects, setDraggableObjects] = useState<THREE.Object3D[]>([]);
  const [dragControls, setDragControls] = useState<any>(null);
  const orbitControlsRef = useRef<any>(null);

  // Find all draggable objects
  useEffect(() => {
    const findDraggableObjects = () => {
      const objects: THREE.Object3D[] = [];
      
      scene.traverse((object) => {
        if (object.userData && object.userData.draggable) {
          objects.push(object);
        }
      });
      
      setDraggableObjects(objects);
    };
    
    // Wait a bit for all objects to be added to the scene
    const timeoutId = setTimeout(findDraggableObjects, 100);
    return () => clearTimeout(timeoutId);
  }, [scene]);

  // Initialize DragControls
  useEffect(() => {
    if (draggableObjects.length > 0 && !dragControls) {
      // Create drag controls using the imported DragControls class
      const controls = new DragControls(draggableObjects, camera, gl.domElement);
      
      // Add event listeners
      controls.addEventListener('dragstart', () => {
        // Disable orbit controls while dragging
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = false;
        }
      });
      
      controls.addEventListener('dragend', () => {
        // Re-enable orbit controls after dragging
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = true;
        }
      });
      
      controls.addEventListener('drag', (event: any) => {
        // Lock Y position to prevent floating objects
        event.object.position.y = event.object.userData.originalY || 3;
        
        // Constrain objects within floor boundaries
        // Floor is at position [0, -1, 3] with scale [100, 2, 100]
        // This creates a floor from -50 to 50 in X and -47 to 53 in Z
        const floorBoundaryX = 45; // Leave some margin from edge
        const floorBoundaryZ = 45; // Leave some margin from edge
        const floorCenterZ = 3; // Floor center Z position
        
        // Clamp X position
        event.object.position.x = Math.max(-floorBoundaryX, 
          Math.min(floorBoundaryX, event.object.position.x));
        
        // Clamp Z position around floor center
        event.object.position.z = Math.max(floorCenterZ - floorBoundaryZ, 
          Math.min(floorCenterZ + floorBoundaryZ, event.object.position.z));
      });
      
      // Save original Y positions
      draggableObjects.forEach(obj => {
        obj.userData.originalY = obj.position.y;
      });
      
      setDragControls(controls);
    }
  }, [draggableObjects, camera, gl.domElement, dragControls]);

  return (
    <OrbitControls 
      ref={orbitControlsRef}
      enablePan={true} 
      enableRotate={true} 
      enableZoom={true} 
    />
  );
};

// Main Scene Component
const Scene: React.FC = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[-30, 50, -30]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
      />

      {/* Floor */}
      <Floor />
      
      {/* Draggable Objects */}
      <DraggableMesh 
        position={[15, 3, 15]} 
        color={0xDC143C} 
        scale={[6, 6, 6]}
        geometry={<boxGeometry />} 
        name="BOX" 
      />
      
      <DraggableMesh 
        position={[15, 4, -15]} 
        color={0x43a1f4} 
        geometry={<sphereGeometry args={[4, 32, 32]} />} 
        name="SPHERE" 
      />
      
      <DraggableMesh 
        position={[-15, 3, 15]} 
        color={0x90ee90} 
        geometry={<cylinderGeometry args={[4, 4, 6, 32]} />} 
        name="CYLINDER" 
      />

      {/* Controls */}
      <DragControlsHandler />
    </>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <div className="w-screen h-screen">
      <Canvas
        camera={{ 
          position: [-35, 70, 100], 
          fov: 30,
          near: 1,
          far: 1500
        }}
        shadows
        style={{ background: '#bfd1e5' }}
      >
        <Scene />
      </Canvas>
      
      {/* Instructions */}
      <div className="absolute top-5 left-5 text-white bg-black bg-opacity-70 p-4 rounded-lg font-sans text-sm">
        <h3 className="m-0 mb-2 text-base font-semibold">Interactive 3D Scene</h3>
        <p className="my-1">• Click and drag objects to move them</p>
        <p className="my-1">• Objects are constrained within the floor boundaries</p>
        <p className="my-1">• Camera controls automatically disable while dragging</p>
        <p className="my-1">• Use mouse to orbit camera when not dragging</p>
      </div>
    </div>
  );
};

export default App;