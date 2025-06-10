'use client'
import React, { JSX, useRef, useState, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, DragControls } from '@react-three/drei'
import * as THREE from 'three'

type PlacedObject = {
  id: string
  component: React.ReactNode
  position: [number, number, number]
}

// Sidebar component
const Sidebar: React.FC<{
  onDragStart: (component: React.ReactNode, dragData: string) => void
}> = ({ onDragStart }) => {
  
  return (
    <div className="absolute left-0 top-0 h-full w-64 bg-gray-900/80 backdrop-blur-sm text-white p-4 flex flex-col z-10 rounded-r-lg shadow-xl border-r border-gray-700">
      <h2 className="text-xl font-bold mb-6 text-center">3D Objects</h2>
      
      <h3 className="text-sm uppercase tracking-wider mb-3 opacity-70">Objects</h3>
      <div className="flex flex-col gap-3">
        <div 
          className="flex items-center p-3 bg-gray-800 rounded-lg cursor-grab hover:bg-gray-700 transition-colors"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', 'box')
            onDragStart(<BoxObject />, 'box')
          }}
        >
          <div className="w-5 h-5 mr-3 bg-white/80 rounded-sm"></div>
          <span>Box</span>
        </div>
        
        <div 
          className="flex items-center p-3 bg-gray-800 rounded-lg cursor-grab hover:bg-gray-700 transition-colors"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', 'car')
            onDragStart(<Car />, 'car')
          }}
        >
          <div className="w-6 h-4 mr-3 bg-white/80 rounded-sm"></div>
          <span>Car</span>
        </div>
        
        <div 
          className="flex items-center p-3 bg-gray-800 rounded-lg cursor-grab hover:bg-gray-700 transition-colors"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', 'table')
            onDragStart(<Table />, 'table')
          }}
        >
          <div className="w-5 h-3 mr-3 bg-white/80 rounded-sm"></div>
          <span>Table</span>
        </div>
        
        <div 
          className="flex items-center p-3 bg-gray-800 rounded-lg cursor-grab hover:bg-gray-700 transition-colors"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', 'chair')
            onDragStart(<Chair />, 'chair')
          }}
        >
          <div className="w-4 h-5 mr-3 bg-white/80 rounded-sm"></div>
          <span>Chair</span>
        </div>

        <div 
          className="flex items-center p-3 bg-gray-800 rounded-lg cursor-grab hover:bg-gray-700 transition-colors"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', 'custom')
            onDragStart(<CustomObject />, 'custom')
          }}
        >
          <div className="w-4 h-4 mr-3 bg-white/80 rounded-full"></div>
          <span>Custom</span>
        </div>
      </div>
      
      <div className="mt-auto text-xs opacity-50 text-center">
        Drag objects onto the plane
      </div>
    </div>
  )
}

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
  const [objectPosition, setObjectPosition] = useState<[number, number, number]>([position[0], 0, position[2]])
  const [dragLimits, setDragLimits] = useState<[[number, number], [number, number], [number, number]]>([[0, groundSize.width], [0, 0], [0, groundSize.depth]])
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (groupRef.current) {
      const box = new THREE.Box3().setFromObject(groupRef.current)
      const size = new THREE.Vector3()
      box.getSize(size)
      const minEdge = box.min.clone();
      const maxEdge = box.max.clone();

      setObjectSize([size.x, size.y, size.z])

      const minX = -groundSize.width / 2 - minEdge.x
      const maxX = groundSize.width / 2 - maxEdge.x
      const minZ = -groundSize.depth / 2 - minEdge.z
      const maxZ = groundSize.depth / 2 - maxEdge.z

      setDragLimits([
        [minX, maxX],
        [0, 0],
        [minZ, maxZ]
      ]);

      setObjectPosition((position) => {
        if (position[0] < -groundSize.width / 2) position[0] = -groundSize.width / 2;
        else if (position[0] > groundSize.width / 2) position[0] = groundSize.width / 2;
        position[1] = -minEdge.y;
        if (position[2] < -groundSize.depth / 2) position[2] = -groundSize.depth / 2;
        else if (position[2] > groundSize.depth / 2) position[2] = groundSize.depth / 2;

        if (groupRef.current) {
          groupRef.current.position.set(position[0], position[1], position[2])
        }
        return position;
      })
    }
  }, [groundSize.width, groundSize.depth])

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

// 3D object components
function Car({ color = 'red', isHovered = false }: { color?: string, isHovered?: boolean }): JSX.Element {
  const materialColor = isHovered ? new THREE.Color(color).multiplyScalar(1.5) : color

  return (
    <group>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2, 0.6, 1]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[1.2, 0.4, 0.8]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
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
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[2, 0.1, 1.5]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
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
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
      <mesh position={[0, 0.9, -0.35]}>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
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

function CustomObject({ color = 'purple', isHovered = false }: { color?: string, isHovered?: boolean }): JSX.Element {
  const materialColor = isHovered ? new THREE.Color(color).multiplyScalar(1.5) : color

  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.4]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
    </group>
  )
}

function BoxObject({ color = 'green', isHovered = false }: { color?: string, isHovered?: boolean }): JSX.Element {
  const materialColor = isHovered ? new THREE.Color(color).multiplyScalar(1.5) : color

  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={materialColor} />
    </mesh>
  )
}



// Scene component with drop functionality
const Scene: React.FC<{
  objects: PlacedObject[],
  setObjects: React.Dispatch<React.SetStateAction<PlacedObject[]>>,
  currentObject: { component: React.ReactNode } | null,
  setCurrentObject: React.Dispatch<React.SetStateAction<{ component: React.ReactNode } | null>>,
  setOrbitEnabled: (enabled: boolean) => void
}> = ({ objects, setObjects, currentObject, setCurrentObject, setOrbitEnabled }) => {
  const { camera, raycaster, scene, gl } = useThree()
  const groundRef = useRef<THREE.Mesh>(null)
  
  const groundSize = {
    width: 20,
    depth: 20
  }

  // Handle drop events
  useEffect(() => {
    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      
      if (currentObject) {
        const canvas = gl.domElement
        const rect = canvas.getBoundingClientRect()
        const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
        const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1
        
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera)
        
        if (groundRef.current) {
          const intersects = raycaster.intersectObject(groundRef.current)
          
          if (intersects.length > 0) {
            const point = intersects[0].point
            
            const newObject: PlacedObject = {
              id: Date.now().toString(),
              component: currentObject.component,
              position: [point.x, 1, point.z]
            }
            
            setObjects(prev => [...prev, newObject])
          }
        }
        
        setCurrentObject(null)
      }
    }

    const preventDefaults = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }
    
    document.addEventListener('drop', handleDrop)
    document.addEventListener('dragover', preventDefaults)
    
    return () => {
      document.removeEventListener('drop', handleDrop)
      document.removeEventListener('dragover', preventDefaults)
    }
  }, [currentObject, setCurrentObject, camera, raycaster, gl, setObjects])

  // Find ground for raycasting
  useFrame(() => {
    if (!groundRef.current) {
      const ground = scene.children.find(child => 
        child instanceof THREE.Mesh && 
        child.geometry instanceof THREE.PlaneGeometry
      ) as THREE.Mesh | undefined
      
      if (ground) {
        groundRef.current = ground
      }
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Render dropped objects */}
      {objects.map(obj => (
        <DraggableObject
          key={obj.id}
          position={obj.position}
          groundSize={groundSize}
          setOrbitEnabled={setOrbitEnabled}
        >
          {React.cloneElement(obj.component as React.ReactElement, { key: obj.id })}
        </DraggableObject>
      ))}

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[groundSize.width, groundSize.depth]} />
        <meshStandardMaterial color="lightgray" opacity={0.7} transparent />
      </mesh>

      {/* Grid lines for better visual reference */}
      <gridHelper args={[groundSize.width, 20, 'gray', 'gray']} position={[0, 0.01, 0]} />
    </>
  )
}

export default function App(): JSX.Element {
  const [objects, setObjects] = useState<PlacedObject[]>([])
  const [currentObject, setCurrentObject] = useState<{ component: React.ReactNode } | null>(null)
  const [orbitEnabled, setOrbitEnabled] = useState(true)
  
  const handleDragStart = (component: React.ReactNode, dragData: string) => {
    setCurrentObject({ component })
  }

  return (
    <div className="relative w-full h-screen bg-gray-100">
      <Sidebar onDragStart={handleDragStart} />
      
      <div style={{ width: '100vw', height: '100vh' }}>
        <Canvas camera={{ position: [0, 12, 12], fov: 75 }}>
          <Scene 
            objects={objects}
            setObjects={setObjects}
            currentObject={currentObject}
            setCurrentObject={setCurrentObject}
            setOrbitEnabled={setOrbitEnabled}
          />
          <OrbitControls enabled={orbitEnabled} />
        </Canvas>
      </div>
      

    </div>
  )
}