"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Box, Sphere, Cone } from '@react-three/drei';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import * as THREE from 'three';

// Types
interface DroppedObject {
  id: string;
  type: '3d-object';
  shape: 'box' | 'sphere' | 'cone';
  position: [number, number, number];
  color: string;
}

interface DragItem {
  type: '3d-object';
  shape: 'box' | 'sphere' | 'cone';
  color: string;
}

// Sidebar item component
const SidebarItem: React.FC<{ shape: 'box' | 'sphere' | 'cone'; color: string }> = ({ shape, color }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: '3d-object',
    item: { type: '3d-object', shape, color },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`w-20 h-20 rounded-lg flex items-center justify-center cursor-move transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 hover:scale-105'
      }`}
      style={{ backgroundColor: color + '40', border: `2px solid ${color}` }}
    >
      <div className="text-center">
        <div className="text-2xl mb-1">
          {shape === 'box' && '🟦'}
          {shape === 'sphere' && '🔵'}
          {shape === 'cone' && '🔺'}
        </div>
        <div className="text-xs font-medium capitalize">{shape}</div>
      </div>
    </div>
  );
};

// 3D Object component
const Object3D: React.FC<{ object: DroppedObject }> = ({ object }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const renderShape = () => {
    const props = {
      position: object.position,
      ref: meshRef,
      onPointerOver: () => setHovered(true),
      onPointerOut: () => setHovered(false),
    };

    switch (object.shape) {
      case 'box':
        return (
          <Box {...props} args={[1, 1, 1]}>
            <meshStandardMaterial color={object.color} />
          </Box>
        );
      case 'sphere':
        return (
          <Sphere {...props} args={[0.5, 32, 32]}>
            <meshStandardMaterial color={object.color} />
          </Sphere>
        );
      case 'cone':
        return (
          <Cone {...props} args={[0.5, 1, 32]}>
            <meshStandardMaterial color={object.color} />
          </Cone>
        );
      default:
        return null;
    }
  };

  return <>{renderShape()}</>;
};

// Droppable Plane component
const DroppablePlane: React.FC<{ 
  onDrop: (item: DragItem, position: [number, number, number]) => void;
  isOver: boolean;
}> = ({ onDrop, isOver }) => {
  const planeRef = useRef<THREE.Mesh>(null);
  const { camera, gl } = useThree();

  useEffect(() => {
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      
      // Get the drag data
      const data = e.dataTransfer?.getData('text/plain');
      if (data && planeRef.current) {
        try {
          const item = JSON.parse(data) as DragItem;
          
          // Convert screen coordinates to 3D world coordinates
          const rect = gl.domElement.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          
          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
          
          const intersects = raycaster.intersectObject(planeRef.current);
          if (intersects.length > 0) {
            const point = intersects[0].point;
            onDrop(item, [point.x, 0.5, point.z]);
          }
        } catch (err) {
          console.error('Failed to parse drop data:', err);
        }
      }
    };

    const canvas = gl.domElement;
    canvas.addEventListener('drop', handleDrop);
    canvas.addEventListener('dragover', (e) => e.preventDefault());

    return () => {
      canvas.removeEventListener('drop', handleDrop);
      canvas.removeEventListener('dragover', (e) => e.preventDefault());
    };
  }, [camera, gl, onDrop]);

  return (
    <mesh
      ref={planeRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
    >
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial 
        color={isOver ? '#4ade80' : '#e5e7eb'} 
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Canvas Wrapper with Drop Zone
const CanvasDropZone: React.FC<{ 
  children: React.ReactNode;
  onDrop: (item: DragItem, position: [number, number, number]) => void;
}> = ({ children, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: '3d-object',
    drop: (item: DragItem) => {
      // This is handled by the canvas drop event
      return undefined;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        
        <DroppablePlane onDrop={onDrop} isOver={isOver} />
        
        {children}
        
        <gridHelper args={[10, 10, '#9ca3af', '#e5e7eb']} />
      </Canvas>
    </div>
  );
};

// Updated Sidebar item with native drag
const SidebarItemNative: React.FC<{ shape: 'box' | 'sphere' | 'cone'; color: string }> = ({ shape, color }) => {
  const handleDragStart = (e: React.DragEvent) => {
    const dragData: DragItem = { type: '3d-object', shape, color };
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="w-20 h-20 rounded-lg flex items-center justify-center cursor-move transition-all hover:scale-105 active:scale-95"
      style={{ backgroundColor: color + '40', border: `2px solid ${color}` }}
    >
      <div className="text-center select-none">
        <div className="text-2xl mb-1">
          {shape === 'box' && '🟦'}
          {shape === 'sphere' && '🔵'}
          {shape === 'cone' && '🔺'}
        </div>
        <div className="text-xs font-medium capitalize">{shape}</div>
      </div>
    </div>
  );
};

// Main component
const DragDrop3D: React.FC = () => {
  const [droppedObjects, setDroppedObjects] = useState<DroppedObject[]>([]);
  const [useDndLibrary, setUseDndLibrary] = useState(false);

  const handleDrop = (item: DragItem, position: [number, number, number]) => {
    const newObject: DroppedObject = {
      id: `object-${Date.now()}`,
      type: '3d-object',
      shape: item.shape,
      position,
      color: item.color,
    };
    setDroppedObjects([...droppedObjects, newObject]);
  };

  const clearObjects = () => {
    setDroppedObjects([]);
  };

  if (useDndLibrary) {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4">3D Objects</h2>
            <div className="space-y-4">
              <SidebarItem shape="box" color="#3b82f6" />
              <SidebarItem shape="sphere" color="#ef4444" />
              <SidebarItem shape="cone" color="#10b981" />
            </div>
            <div className="mt-8 space-y-2">
              <button
                onClick={clearObjects}
                className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
              >
                Clear All Objects
              </button>
              <button
                onClick={() => setUseDndLibrary(false)}
                className="w-full px-3 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded text-sm"
              >
                Use Native Drag
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>Using: React DnD</p>
              <p className="mt-2">Drag and drop objects onto the 3D plane</p>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="flex-1 relative">
            <CanvasDropZone onDrop={handleDrop}>
              {droppedObjects.map((obj) => (
                <Object3D key={obj.id} object={obj} />
              ))}
            </CanvasDropZone>

            {/* Instructions */}
            <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold mb-2">Controls:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Left click + drag: Rotate view</li>
                <li>• Right click + drag: Pan view</li>
                <li>• Scroll: Zoom in/out</li>
              </ul>
            </div>
          </div>
        </div>
      </DndProvider>
    );
  }

  // Native drag and drop implementation
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4">3D Objects</h2>
        <div className="space-y-4">
          <SidebarItemNative shape="box" color="#3b82f6" />
          <SidebarItemNative shape="sphere" color="#ef4444" />
          <SidebarItemNative shape="cone" color="#10b981" />
        </div>
        <div className="mt-8 space-y-2">
          <button
            onClick={clearObjects}
            className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Clear All Objects
          </button>
          <button
            onClick={() => setUseDndLibrary(true)}
            className="w-full px-3 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded text-sm"
          >
            Use React DnD
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>Using: Native HTML5</p>
          <p className="mt-2">Drag and drop objects onto the 3D plane</p>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[5, 5, 5]} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          
          <DroppablePlane onDrop={handleDrop} isOver={false} />
          
          {droppedObjects.map((obj) => (
            <Object3D key={obj.id} object={obj} />
          ))}
          
          <gridHelper args={[10, 10, '#9ca3af', '#e5e7eb']} />
        </Canvas>

        {/* Instructions */}
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold mb-2">Controls:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Left click + drag: Rotate view</li>
            <li>• Right click + drag: Pan view</li>
            <li>• Scroll: Zoom in/out</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DragDrop3D;