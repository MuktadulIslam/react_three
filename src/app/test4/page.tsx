'use client'
import React, { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Types
interface Position {
  x: number;
  y: number;
  z: number;
}

interface DraggableObject {
  object: THREE.Object3D;
  name: string;
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

// Draggable Box Component
const DraggableBox: React.FC<{ onDrag: (object: THREE.Object3D) => void }> = ({ onDrag }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    if (meshRef.current) {
      onDrag(meshRef.current);
    }
  }, [onDrag]);

  return (
    <mesh
      ref={meshRef}
      position={[15, 3, 15]}
      scale={[6, 6, 6]}
      castShadow
      receiveShadow
      onClick={handleClick}
      userData={{ draggable: true, name: 'BOX' }}
    >
      <boxGeometry />
      <meshPhongMaterial color={0xDC143C} />
    </mesh>
  );
};

// Draggable Sphere Component
const DraggableSphere: React.FC<{ onDrag: (object: THREE.Object3D) => void }> = ({ onDrag }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    if (meshRef.current) {
      onDrag(meshRef.current);
    }
  }, [onDrag]);

  return (
    <mesh
      ref={meshRef}
      position={[15, 4, -15]}
      castShadow
      receiveShadow
      onClick={handleClick}
      userData={{ draggable: true, name: 'SPHERE' }}
    >
      <sphereGeometry args={[4, 32, 32]} />
      <meshPhongMaterial color={0x43a1f4} />
    </mesh>
  );
};

// Draggable Cylinder Component
const DraggableCylinder: React.FC<{ onDrag: (object: THREE.Object3D) => void }> = ({ onDrag }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    if (meshRef.current) {
      onDrag(meshRef.current);
    }
  }, [onDrag]);

  return (
    <mesh
      ref={meshRef}
      position={[-15, 3, 15]}
      castShadow
      receiveShadow
      onClick={handleClick}
      userData={{ draggable: true, name: 'CYLINDER' }}
    >
      <cylinderGeometry args={[4, 4, 6, 32]} />
      <meshPhongMaterial color={0x90ee90} />
    </mesh>
  );
};

// Simple Castle Component (using a scaled box as placeholder since we can't load OBJ files)
const DraggableCastle: React.FC<{ onDrag: (object: THREE.Object3D) => void }> = ({ onDrag }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    if (meshRef.current) {
      onDrag(meshRef.current);
    }
  }, [onDrag]);

  return (
    <group 
      ref={meshRef}
      position={[-15, 0, -15]} 
      scale={[5, 5, 5]}
      userData={{ draggable: true, name: 'CASTLE' }}
      onClick={handleClick}
    >
      {/* Main castle body */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhongMaterial color={0x8B4513} />
      </mesh>
      {/* Castle towers */}
      <mesh position={[-0.8, 1.8, -0.8]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.6, 8]} />
        <meshPhongMaterial color={0x696969} />
      </mesh>
      <mesh position={[0.8, 1.8, -0.8]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.6, 8]} />
        <meshPhongMaterial color={0x696969} />
      </mesh>
      <mesh position={[-0.8, 1.8, 0.8]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.6, 8]} />
        <meshPhongMaterial color={0x696969} />
      </mesh>
      <mesh position={[0.8, 1.8, 0.8]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.6, 8]} />
        <meshPhongMaterial color={0x696969} />
      </mesh>
    </group>
  );
};

// Drag Handler Hook
const DragHandler: React.FC<{ 
  draggableObject: DraggableObject | null, 
  setDraggableObject: (obj: DraggableObject | null) => void,
  setOrbitEnabled: (enabled: boolean) => void
}> = ({ draggableObject, setDraggableObject, setOrbitEnabled }) => {
  const { camera, raycaster, scene } = useThree();
  const [mousePosition, setMousePosition] = useState<THREE.Vector2>(new THREE.Vector2());
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  useFrame(() => {
    if (draggableObject && isMouseDown) {
      raycaster.setFromCamera(mousePosition, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      for (const intersect of intersects) {
        if (intersect.object.userData?.ground) {
          const target = intersect.point;
          draggableObject.object.position.x = target.x;
          draggableObject.object.position.z = target.z;
          break;
        }
      }
    }
  });

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    setMousePosition(new THREE.Vector2(x, y));
  }, []);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    if (event.button === 0) { // Left mouse button
      setIsMouseDown(true);
      if (draggableObject) {
        setOrbitEnabled(false);
        console.log(`dragging ${draggableObject.name}`);
      }
    }
  }, [draggableObject, setOrbitEnabled]);

  const handleMouseUp = useCallback((event: MouseEvent) => {
    if (event.button === 0) { // Left mouse button
      setIsMouseDown(false);
      if (draggableObject) {
        console.log(`dropping draggable ${draggableObject.name}`);
        setDraggableObject(null);
        setOrbitEnabled(true);
      }
    }
  }, [draggableObject, setDraggableObject, setOrbitEnabled]);

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp]);

  return null;
};

// Main Scene Component
const Scene: React.FC = () => {
  const [draggableObject, setDraggableObject] = useState<DraggableObject | null>(null);
  const [orbitEnabled, setOrbitEnabled] = useState<boolean>(true);

  const handleObjectDrag = useCallback((object: THREE.Object3D) => {
    if (!draggableObject) {
      const name = object.userData.name || 'UNKNOWN';
      console.log(`found draggable ${name}`);
      setDraggableObject({ object, name });
    }
  }, [draggableObject]);

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

      {/* Objects */}
      <Floor />
      <DraggableBox onDrag={handleObjectDrag} />
      <DraggableSphere onDrag={handleObjectDrag} />
      <DraggableCylinder onDrag={handleObjectDrag} />
      <DraggableCastle onDrag={handleObjectDrag} />

      {/* Controls */}
      <OrbitControls 
        enablePan={true} 
        enableRotate={orbitEnabled} 
        enableZoom={true} 
      />
      
      {/* Drag Handler */}
      <DragHandler 
        draggableObject={draggableObject} 
        setDraggableObject={setDraggableObject}
        setOrbitEnabled={setOrbitEnabled}
      />
    </>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
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
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '15px',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Interactive 3D Scene</h3>
        <p style={{ margin: '5px 0' }}>• Click objects to select them</p>
        <p style={{ margin: '5px 0' }}>• Hold LEFT mouse button and move to drag</p>
        <p style={{ margin: '5px 0' }}>• Release mouse button to drop</p>
        <p style={{ margin: '5px 0' }}>• Camera rotation disabled while dragging</p>
        <p style={{ margin: '5px 0' }}>• Use mouse to orbit camera when not dragging</p>
      </div>
    </div>
  );
};

export default App;