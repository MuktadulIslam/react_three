"use client";

import React, { JSX, useRef, useState } from 'react';
import { Canvas, useFrame, RootState, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Plane, Sphere, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Type definitions
interface ObjectDimensions {
  width: number;  // tiles
  height: number; // tiles
}

interface DraggableObjectProps {
  id: string;
  position: [number, number, number];
  dimensions: ObjectDimensions;
  color: string;
  roomWidth: number;
  roomHeight: number;
  orbitControlsRef: React.RefObject<any>;
  onPositionChange: (id: string, position: [number, number, number]) => void;
  onDragStart: (id: string, dimensions: ObjectDimensions) => void;
  onDragEnd: () => void;
  children: React.ReactNode;
}

interface TileHighlightProps {
  position: [number, number, number];
  dimensions: ObjectDimensions;
  color: string;
}

interface FloatingCubeProps {
  position: [number, number, number];
}

interface FloorTileProps {
  position: [number, number, number];
  isAlternate: boolean;
}

interface RoomProps {
  width: number;
  height: number;
}

interface RoomControlsProps {
  width: number;
  height: number;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
}

// Tile highlight component for showing allocated space
const TileHighlight: React.FC<TileHighlightProps> = ({ position, dimensions, color }) => {
  const tiles: JSX.Element[] = [];
  
  for (let x = 0; x < dimensions.width; x++) {
    for (let z = 0; z < dimensions.height; z++) {
      const tileX = position[0] + x - dimensions.width / 2 + 0.5;
      const tileZ = position[2] + z - dimensions.height / 2 + 0.5;
      
      tiles.push(
        <Plane
          key={`highlight-${x}-${z}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[tileX, 0.02, tileZ]}
          args={[0.95, 0.95]}
        >
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.6}
            depthWrite={false}
          />
        </Plane>
      );
    }
  }
  
  return <group>{tiles}</group>;
};

// Draggable object component
const DraggableObject: React.FC<DraggableObjectProps> = ({
  id,
  position,
  dimensions,
  color,
  roomWidth,
  roomHeight,
  orbitControlsRef,
  onPositionChange,
  onDragStart,
  onDragEnd,
  children
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { raycaster } = useThree();

  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    setIsDragging(true);
    onDragStart(id, dimensions);
    
    // Disable orbit controls when selecting an object
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = false;
    }
  };

  const handlePointerMove = (event: any) => {
    if (!isDragging) return;
    
    // Calculate new position on the floor plane
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersection = new THREE.Vector3();
    
    raycaster.ray.intersectPlane(plane, intersection);
    
    if (intersection) {
      // Snap directly to tile grid (integer positions)
      let snappedX = Math.round(intersection.x);
      let snappedZ = Math.round(intersection.z);
      
      // Apply room boundary constraints
      const halfWidth = dimensions.width / 2;
      const halfHeight = dimensions.height / 2;
      
      // Calculate room bounds (tiles are from -roomWidth/2 to +roomWidth/2)
      const minX = Math.ceil(-roomWidth / 2 + halfWidth);
      const maxX = Math.floor(roomWidth / 2 - halfWidth);
      const minZ = Math.ceil(-roomHeight / 2 + halfHeight);
      const maxZ = Math.floor(roomHeight / 2 - halfHeight);
      
      // Constrain position within room bounds
      snappedX = Math.max(minX, Math.min(maxX, snappedX));
      snappedZ = Math.max(minZ, Math.min(maxZ, snappedZ));
      
      // Only update if position changed to a different tile
      if (snappedX !== position[0] || snappedZ !== position[2]) {
        onPositionChange(id, [snappedX, position[1], snappedZ]);
      }
    }
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd();
      
      // Re-enable orbit controls after dragging
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = true;
      }
    }
  };

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {children}
      {/* Invisible collision box for easier clicking */}
      <Box
        args={[dimensions.width, 3, dimensions.height]}
        position={[0, 1.5, 0]}
        visible={false}
      />
    </group>
  );
};

// Floor tile component
const FloorTile: React.FC<FloorTileProps> = ({ position, isAlternate }) => (
  <Plane 
    rotation={[-Math.PI / 2, 0, 0]} 
    position={position} 
    args={[1, 1]}
  >
    <meshStandardMaterial 
      color={isAlternate ? "#e8e8e8" : "#f5f5f5"} 
    />
  </Plane>
);

// Floor with tiles component
const TiledFloor: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const tiles: JSX.Element[] = [];
  const tilesX = width;
  const tilesZ = height;
  
  for (let x = 0; x < tilesX; x++) {
    for (let z = 0; z < tilesZ; z++) {
      const posX = x - tilesX / 2 + 0.5;
      const posZ = z - tilesZ / 2 + 0.5;
      const isAlternate = (x + z) % 2 === 1;
      
      tiles.push(
        <FloorTile
          key={`tile-${x}-${z}`}
          position={[posX, 0.01, posZ]}
          isAlternate={isAlternate}
        />
      );
    }
  }
  
  return <group>{tiles}</group>;
};

// Animated floating cube component
const FloatingCube: React.FC<FloatingCubeProps> = ({ position }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state: RootState) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <Box ref={meshRef} position={position} args={[0.5, 0.5, 0.5]}>
      <meshStandardMaterial color="#ff6b6b" />
    </Box>
  );
};

// Room walls and structure component
const Room: React.FC<RoomProps> = ({ width, height }) => {
  const wallHeight = 5;
  
  return (
    <group>
      {/* Base floor (underneath tiles) */}
      <Plane 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        args={[width, height]}
      >
        <meshStandardMaterial color="#d0d0d0" />
      </Plane>

      {/* Tiled floor */}
      <TiledFloor width={width} height={height} />

      {/* Ceiling */}
      <Plane 
        rotation={[Math.PI / 2, 0, 0]} 
        position={[0, wallHeight, 0]} 
        args={[width, height]}
      >
        <meshStandardMaterial color="#ffffff" />
      </Plane>

      {/* Back Wall */}
      <Plane 
        position={[0, wallHeight / 2, -height / 2]} 
        args={[width, wallHeight]}
      >
        <meshStandardMaterial color="#e8e8e8" />
      </Plane>

      {/* Front Wall (partial, like an entrance) */}
      <group>
        <Plane 
          position={[-width / 4, wallHeight / 2, height / 2]} 
          args={[width / 2, wallHeight]}
        >
          <meshStandardMaterial color="#e8e8e8" />
        </Plane>
        <Plane 
          position={[width / 4, wallHeight / 2, height / 2]} 
          args={[width / 2, wallHeight]}
        >
          <meshStandardMaterial color="#e8e8e8" />
        </Plane>
      </group>

      {/* Left Wall */}
      <Plane 
        rotation={[0, Math.PI / 2, 0]}
        position={[-width / 2, wallHeight / 2, 0]} 
        args={[height, wallHeight]}
      >
        <meshStandardMaterial color="#f5f5f5" />
      </Plane>

      {/* Right Wall */}
      <Plane 
        rotation={[0, -Math.PI / 2, 0]}
        position={[width / 2, wallHeight / 2, 0]} 
        args={[height, wallHeight]}
      >
        <meshStandardMaterial color="#f5f5f5" />
      </Plane>
    </group>
  );
};

// Table component
const Table: React.FC = () => {
  const tableLegPositions: [number, number, number][] = [
    [-0.8, 0.75, -0.4], 
    [0.8, 0.75, -0.4], 
    [-0.8, 0.75, 0.4], 
    [0.8, 0.75, 0.4]
  ];

  return (
    <group>
      <Box position={[0, 1.5, 0]} args={[2, 0.1, 1]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      {tableLegPositions.map((pos, i) => (
        <Box key={`table-leg-${i}`} position={pos} args={[0.1, 1.5, 0.1]}>
          <meshStandardMaterial color="#654321" />
        </Box>
      ))}
    </group>
  );
};

// Chair component
const Chair: React.FC = () => {
  const chairLegPositions: [number, number, number][] = [
    [-0.3, 0.45, -0.3], 
    [0.3, 0.45, -0.3], 
    [-0.3, 0.45, 0.3], 
    [0.3, 0.45, 0.3]
  ];

  return (
    <group>
      <Box position={[0, 0.9, 0]} args={[0.8, 0.1, 0.8]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      <Box position={[0, 1.5, -0.35]} args={[0.8, 1.2, 0.1]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      {chairLegPositions.map((pos, i) => (
        <Box key={`chair-leg-${i}`} position={pos} args={[0.08, 0.9, 0.08]}>
          <meshStandardMaterial color="#654321" />
        </Box>
      ))}
    </group>
  );
};

// Bookshelf component
const Bookshelf: React.FC = () => {
  const shelfYPositions: number[] = [0.8, 1.6, 2.4, 3.2];
  const bookData: { position: [number, number, number]; color: string }[] = [
    { position: [0.2, 1.0, 0], color: 'hsl(0, 70%, 50%)' },
    { position: [-0.1, 1.0, 0], color: 'hsl(40, 70%, 50%)' },
    { position: [-0.4, 1.0, 0], color: 'hsl(80, 70%, 50%)' },
    { position: [0.3, 1.8, 0], color: 'hsl(120, 70%, 50%)' },
    { position: [0.0, 1.8, 0], color: 'hsl(160, 70%, 50%)' },
    { position: [-0.3, 1.8, 0], color: 'hsl(200, 70%, 50%)' },
    { position: [0.1, 2.6, 0], color: 'hsl(240, 70%, 50%)' },
    { position: [-0.2, 2.6, 0], color: 'hsl(280, 70%, 50%)' },
  ];

  return (
    <group>
      <Box position={[0, 2, 0]} args={[1.5, 4, 0.3]}>
        <meshStandardMaterial color="#DEB887" />
      </Box>
      {shelfYPositions.map((y, i) => (
        <Box key={`shelf-${i}`} position={[0, y, 0]} args={[1.4, 0.05, 0.25]}>
          <meshStandardMaterial color="#CD853F" />
        </Box>
      ))}
      {bookData.map((book, i) => (
        <Box 
          key={`book-${i}`} 
          position={book.position} 
          args={[0.15, 0.4, 0.1]}
        >
          <meshStandardMaterial color={book.color} />
        </Box>
      ))}
    </group>
  );
};

// Lamp component
const Lamp: React.FC = () => (
  <group>
    <Sphere position={[0, 0.2, 0]} args={[0.3]}>
      <meshStandardMaterial color="#2c2c2c" />
    </Sphere>
    <Box position={[0, 1.5, 0]} args={[0.05, 3, 0.05]}>
      <meshStandardMaterial color="#2c2c2c" />
    </Box>
    <mesh position={[0, 2.8, 0]}>
      <coneGeometry args={[0.8, 1, 8]} />
      <meshStandardMaterial color="#f5f5dc" side={THREE.DoubleSide} />
    </mesh>
  </group>
);

// Room controls component
const RoomControls: React.FC<RoomControlsProps> = ({ 
  width, 
  height, 
  onWidthChange, 
  onHeightChange 
}) => {
  const handleWidthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 6 && value <= 20) {
      onWidthChange(value);
    }
  };

  const handleHeightInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 6 && value <= 20) {
      onHeightChange(value);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      background: 'rgba(0,0,0,0.8)',
      padding: '20px',
      borderRadius: '8px',
      minWidth: '250px'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>Room Controls</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Width: {width} tiles
        </label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="range"
            min="6"
            max="20"
            step="1"
            value={width}
            onChange={(e) => onWidthChange(parseInt(e.target.value))}
            style={{
              flex: 1,
              height: '6px',
              borderRadius: '3px',
              background: '#ddd',
              outline: 'none'
            }}
          />
          <input
            type="number"
            min="6"
            max="20"
            value={width}
            onChange={handleWidthInputChange}
            style={{
              width: '50px',
              padding: '4px',
              borderRadius: '4px',
              border: '1px solid #555',
              background: '#333',
              color: 'white',
              fontSize: '12px'
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Height: {height} tiles
        </label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="range"
            min="6"
            max="20"
            step="1"
            value={height}
            onChange={(e) => onHeightChange(parseInt(e.target.value))}
            style={{
              flex: 1,
              height: '6px',
              borderRadius: '3px',
              background: '#ddd',
              outline: 'none'
            }}
          />
          <input
            type="number"
            min="6"
            max="20"
            value={height}
            onChange={handleHeightInputChange}
            style={{
              width: '50px',
              padding: '4px',
              borderRadius: '4px',
              border: '1px solid #555',
              background: '#333',
              color: 'white',
              fontSize: '12px'
            }}
          />
        </div>
      </div>

      <div style={{ borderTop: '1px solid #555', paddingTop: '15px' }}>
        <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '10px' }}>
          <strong>Total tiles: {width * height}</strong>
        </div>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>
          <div>🖱️ Click & drag objects tile by tile</div>
          <div>🖱️ Right click + drag to pan camera</div>
          <div>⚙️ Scroll to zoom</div>
        </div>
      </div>
    </div>
  );
};

// Main Room3D component
const Room3D: React.FC = () => {
  const [roomWidth, setRoomWidth] = useState<number>(10);
  const [roomHeight, setRoomHeight] = useState<number>(10);
  const [draggedObject, setDraggedObject] = useState<{ id: string; dimensions: ObjectDimensions } | null>(null);
  const orbitControlsRef = useRef<any>(null);

  // Initial object coordinates array (in tiles)
  const initialObjectCoordinates = [
    { id: 'table', tileX: 1, tileZ: -2, dimensions: { width: 3, height: 2 } },
    { id: 'chair1', tileX: 3, tileZ: -1, dimensions: { width: 1, height: 1 } },
    { id: 'chair2', tileX: -1, tileZ: -1, dimensions: { width: 1, height: 1 } },
    { id: 'bookshelf', tileX: -3, tileZ: -3, dimensions: { width: 2, height: 1 } },
    { id: 'lamp', tileX: 4, tileZ: 2, dimensions: { width: 1, height: 1 } },
  ];

  // Object states initialized from coordinates array
  const [objects, setObjects] = useState(
    initialObjectCoordinates.map(obj => ({
      id: obj.id,
      position: [obj.tileX, 0, obj.tileZ] as [number, number, number],
      dimensions: obj.dimensions
    }))
  );

  const [floatingCubes] = useState([
    { position: [roomWidth / 4, 3, roomHeight / 6] as [number, number, number] },
    { position: [-roomWidth / 6, 2.5, roomHeight / 4] as [number, number, number] }
  ]);

  const handleObjectPositionChange = (id: string, newPosition: [number, number, number]) => {
    setObjects(prev => prev.map(obj => 
      obj.id === id ? { ...obj, position: newPosition } : obj
    ));
  };

  const handleDragStart = (id: string, dimensions: ObjectDimensions) => {
    setDraggedObject({ id, dimensions });
  };

  const handleDragEnd = () => {
    setDraggedObject(null);
  };

  const renderObject = (obj: typeof objects[0]) => {
    switch (obj.id) {
      case 'table':
        return <Table />;
      case 'chair1':
      case 'chair2':
        return <Chair />;
      case 'bookshelf':
        return <Bookshelf />;
      case 'lamp':
        return <Lamp />;
      default:
        return null;
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas
        camera={{ position: [8, 4, 8], fov: 60 }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight 
          position={[roomWidth / 2 - 1, 3, -roomHeight / 2 + 1]} 
          intensity={0.8} 
          color="#fff8dc" 
        />

        {/* Room structure */}
        <Room width={roomWidth} height={roomHeight} />

        {/* Draggable objects */}
        {objects.map((obj) => (
          <DraggableObject
            key={obj.id}
            id={obj.id}
            position={obj.position}
            dimensions={obj.dimensions}
            color="#4CAF50"
            roomWidth={roomWidth}
            roomHeight={roomHeight}
            orbitControlsRef={orbitControlsRef}
            onPositionChange={handleObjectPositionChange}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {renderObject(obj)}
          </DraggableObject>
        ))}

        {/* Show tile allocation when dragging */}
        {draggedObject && (
          <TileHighlight
            position={objects.find(obj => obj.id === draggedObject.id)?.position || [0, 0, 0]}
            dimensions={draggedObject.dimensions}
            color="#4CAF50"
          />
        )}
        
        {/* Floating decorative elements */}
        {floatingCubes.map((cube, i) => (
          <FloatingCube 
            key={`floating-cube-${i}`} 
            position={cube.position} 
          />
        ))}
        
        {/* Text */}
        <Text
          position={[0, 3, -roomHeight / 2 + 0.2]}
          fontSize={0.5}
          color="#333"
          anchorX="center"
          anchorY="middle"
        >
          Click and drag objects tile by tile!
        </Text>

        {/* Ground shadows */}
        <ContactShadows 
          position={[0, 0.02, 0]} 
          opacity={0.4} 
          scale={Math.max(roomWidth, roomHeight)} 
          blur={1.5} 
          far={5}
        />

        {/* Environment and controls */}
        <Environment preset="apartment" />
        <OrbitControls 
          ref={orbitControlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={30}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
      
      {/* Room Controls */}
      <RoomControls
        width={roomWidth}
        height={roomHeight}
        onWidthChange={setRoomWidth}
        onHeightChange={setRoomHeight}
      />
    </div>
  );
};

export default Room3D;