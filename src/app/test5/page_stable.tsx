'use client'
import React, { JSX, useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, DragControls } from '@react-three/drei'
import * as THREE from 'three'

interface DraggableObjectProps {
  position: [number, number, number],
  groundSize: { width: number, depth: number },
  setOrbitEnabled: (enabled: boolean) => void,
  children: React.ReactNode
}

function DraggableObject({
  position,
  groundSize,
  setOrbitEnabled,
  children
}: DraggableObjectProps) {

  const [isHovered, setIsHovered] = useState(false)
  const [objectSize, setObjectSize] = useState<[number, number, number]>([1, 1, 1])
  const [objectPosition, setObjectPosition] = useState<[number, number, number]>([position[0], 0, position[2]]) // for now everything should be on ground
  const [dragLimits, setDragLimits] = useState<[[number, number], [number, number], [number, number]]>([[0, groundSize.width], [0, 0], [0, groundSize.depth]])
  const groupRef = useRef<THREE.Group>(null)


  // Fixed useEffect in DraggableObject component
  useEffect(() => {
    if (groupRef.current) {
      const box = new THREE.Box3().setFromObject(groupRef.current)
      const size = new THREE.Vector3()
      box.getSize(size)
      const minEdge = box.min.clone();
      const maxEdge = box.max.clone();

      setObjectSize([size.x, size.y, size.z])
      const [objectWidth, objectHeight, objectDepth] = [size.x, size.y, size.z];

      const minX = -groundSize.width / 2 - minEdge.x
      const maxX = groundSize.width / 2 - maxEdge.x
      const minZ = -groundSize.depth / 2 - minEdge.z
      const maxZ = groundSize.depth / 2 - maxEdge.z
      console.log(minEdge)

      setDragLimits([
        [minX, maxX], // X limits
        [0, 0], // Y fixed to place object on ground
        [minZ, maxZ]  // Z limits
      ]);


      setObjectPosition((position) => {
        // for x-axis
        if (position[0] < -groundSize.width / 2) position[0] = -groundSize.width / 2;
        else if (position[0] > groundSize.width / 2) position[0] = groundSize.width / 2;
        // for y-axis
        position[1] = -minEdge.y;
        // for z-asis
        if (position[2] < -groundSize.depth / 2) position[2] = -groundSize.depth / 2;
        else if (position[2] > groundSize.depth / 2) position[2] = groundSize.depth / 2;

        if (groupRef.current) {
          groupRef.current.position.set(position[0], position[1], position[2])
        }
        return position;
      })
    }
  }, [groundSize.width, groundSize.depth]) // Removed children dependency

  return (
    <DragControls
      onDragStart={() => setOrbitEnabled(false)}
      onDragEnd={() => setOrbitEnabled(true)}
      dragLimits={dragLimits}
    >
      <group
        ref={groupRef}
        position={objectPosition}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        {/* Pass hover state to children */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as any, {
              ...((child.props as object) || {}),
              isHovered
            })
          }
          return child
        })}
      </group>
    </DragControls>
  )
}

// Simple 3D object components that accept isHovered prop
function Car({ color = 'red', isHovered = false }: { color?: string, isHovered?: boolean }): JSX.Element {
  const materialColor = isHovered ? new THREE.Color(color).multiplyScalar(1.5) : color

  return (
    <group>
      {/* Car body */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2, 0.6, 1]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
      {/* Car roof */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[1.2, 0.4, 0.8]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
      {/* Wheels */}
      <mesh position={[-0.7, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.7, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.7, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.7, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  )
}

function Table({ color = 'brown', isHovered = false }: { color?: string, isHovered?: boolean }): JSX.Element {
  const materialColor = isHovered ? new THREE.Color(color).multiplyScalar(1.5) : color

  return (
    <group>
      {/* Table top */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[2, 0.1, 1.5]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
      {/* Table legs */}
      <mesh position={[-0.8, 0.4, -0.6]}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
      <mesh position={[0.8, 0.4, -0.6]}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
      <mesh position={[-0.8, 0.4, 0.6]}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
      <mesh position={[0.8, 0.4, 0.6]}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
    </group>
  )
}

function Chair({ color = 'blue', isHovered = false }: { color?: string, isHovered?: boolean }): JSX.Element {
  const materialColor = isHovered ? new THREE.Color(color).multiplyScalar(1.5) : color

  return (
    <group>
      {/* Seat */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.9, -0.35]}>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
      {/* Chair legs */}
      <mesh position={[-0.3, 0.25, -0.3]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
      <mesh position={[0.3, 0.25, -0.3]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
      <mesh position={[-0.3, 0.25, 0.3]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
      <mesh position={[0.3, 0.25, 0.3]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
    </group>
  )
}

function Scene(): JSX.Element {
  const [orbitEnabled, setOrbitEnabled] = useState(true)
  const groundSize = {
    width: 20,
    depth: 20
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Simple box - auto-calculated dimensions */}
      <DraggableObject
        position={[-6, 4, 3]}
        groundSize={groundSize}
        setOrbitEnabled={setOrbitEnabled}
      >
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="green" />
        </mesh>
      </DraggableObject>

      {/* Car - auto-calculated dimensions */}
      <DraggableObject
        position={[-2, 0, 0]}
        groundSize={groundSize}
        setOrbitEnabled={setOrbitEnabled}
      >
        <Car color="red" />
      </DraggableObject>

      {/* Table - auto-calculated dimensions */}
      <DraggableObject
        position={[2, 0, 0]}
        groundSize={groundSize}
        setOrbitEnabled={setOrbitEnabled}
      >
        <Table color="brown" />
      </DraggableObject>

      {/* Chair - auto-calculated dimensions */}
      <DraggableObject
        position={[5, 0, 2]}
        groundSize={groundSize}
        setOrbitEnabled={setOrbitEnabled}
      >
        <Chair color="blue" />
      </DraggableObject>

      {/* Complex custom object - auto-calculated dimensions */}
      <DraggableObject
        position={[0, 0, -4]}
        groundSize={groundSize}
        setOrbitEnabled={setOrbitEnabled}
      >
        <group>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 1]} />
            <meshStandardMaterial color="purple" />
          </mesh>
          <mesh position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.4]} />
            <meshStandardMaterial color="purple" />
          </mesh>
        </group>
      </DraggableObject>

      {/* Wide box - auto-calculated dimensions */}
      <DraggableObject
        position={[-4, 0, -4]}
        groundSize={groundSize}
        setOrbitEnabled={setOrbitEnabled}
      >
        <mesh>
          <boxGeometry args={[3, 0.5, 2]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </DraggableObject>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[groundSize.width, groundSize.depth]} />
        <meshStandardMaterial color="lightgray" opacity={0.7} transparent />
      </mesh>

      {/* Grid lines for better visual reference */}
      <gridHelper args={[groundSize.width, 20, 'gray', 'gray']} position={[0, 0.01, 0]} />
      <OrbitControls enabled={orbitEnabled} />
    </>
  )
}

export default function App(): JSX.Element {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 12, 12], fov: 75 }}>
        <axesHelper args={[5]} />
        <Scene />
      </Canvas>
    </div>
  )
}