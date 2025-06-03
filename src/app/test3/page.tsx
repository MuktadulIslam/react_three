"use client"

import { useState, useRef, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Physics, usePlane, useBox } from '@react-three/cannon'
import { OrbitControls, Html, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// Define 3D object types
type ObjectType = 'box' | 'sphere' | 'cylinder'
type PlacedObject = {
  id: string
  type: ObjectType
  position: [number, number, number]
  color: string
}

// Sidebar component
const Sidebar: React.FC<{
  onDragStart: (objectType: ObjectType, color: string) => void
}> = ({ onDragStart }) => {
  const [activeColor, setActiveColor] = useState<string>('#4f46e5')
  
  const colors = [
    '#4f46e5', // indigo
    '#ef4444', // red
    '#22c55e', // green
    '#eab308', // yellow
    '#06b6d4', // cyan
    '#ec4899'  // pink
  ]
  
  return (
    <div className="absolute left-0 top-0 h-full w-64 bg-gray-900/80 backdrop-blur-sm text-white p-4 flex flex-col z-10 rounded-r-lg shadow-xl border-r border-gray-700">
      <h2 className="text-xl font-bold mb-6 text-center">3D Objects</h2>
      
      <div className="mb-6">
        <h3 className="text-sm uppercase tracking-wider mb-2 opacity-70">Color</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map(color => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full transition-all ${activeColor === color ? 'ring-2 ring-white scale-110' : 'opacity-80 hover:opacity-100'}`}
              style={{ backgroundColor: color }}
              onClick={() => setActiveColor(color)}
            />
          ))}
        </div>
      </div>
      
      <h3 className="text-sm uppercase tracking-wider mb-3 opacity-70">Objects</h3>
      <div className="flex flex-col gap-3">
        <div 
          className="flex items-center p-3 bg-gray-800 rounded-lg cursor-grab hover:bg-gray-700 transition-colors"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', 'box')
            onDragStart('box', activeColor)
          }}
        >
          <div className="w-5 h-5 mr-3 bg-white/80 rounded-sm"></div>
          <span>Cube</span>
        </div>
        
        <div 
          className="flex items-center p-3 bg-gray-800 rounded-lg cursor-grab hover:bg-gray-700 transition-colors"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', 'sphere')
            onDragStart('sphere', activeColor)
          }}
        >
          <div className="w-5 h-5 mr-3 bg-white/80 rounded-full"></div>
          <span>Sphere</span>
        </div>
        
        <div 
          className="flex items-center p-3 bg-gray-800 rounded-lg cursor-grab hover:bg-gray-700 transition-colors"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', 'cylinder')
            onDragStart('cylinder', activeColor)
          }}
        >
          <div className="w-4 h-5 mr-3 bg-white/80 rounded-md"></div>
          <span>Cylinder</span>
        </div>
      </div>
      
      <div className="mt-auto text-xs opacity-50 text-center">
        Drag objects onto the plane
      </div>
    </div>
  )
}

// Ground plane component
const Ground: React.FC = () => {
  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    type: 'Static'
  }))
  
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#fcfcfc" />
    </mesh>
  )
}

// Simple 3D object component (non-interactive)
const SimpleObject: React.FC<{
  type: ObjectType,
  position: [number, number, number],
  color: string,
  id: string
}> = ({ type, position, color, id }) => {
  const [ref, api] = useBox(() => ({ 
    mass: 1,
    position,
    args: type === 'box' ? [1, 1, 1] : 
          type === 'sphere' ? [1, 1, 1] : 
          [0.5, 1.5, 0.5]
  }))
  
  let geometry
  switch (type) {
    case 'box':
      geometry = <boxGeometry args={[1, 1, 1]} />
      break
    case 'sphere':
      geometry = <sphereGeometry args={[0.5, 32, 32]} />
      break
    case 'cylinder':
      geometry = <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />
      break
  }
  
  return (
    <mesh 
      ref={ref as React.RefObject<THREE.Mesh>} 
      castShadow
    >
      {geometry}
      <meshStandardMaterial 
        color={color} 
        roughness={0.7} 
        metalness={0.2} 
      />
    </mesh>
  )
}

// Scene component
const Scene: React.FC<{
  objects: PlacedObject[],
  setObjects: React.Dispatch<React.SetStateAction<PlacedObject[]>>,
  currentObject: { type: ObjectType, color: string } | null,
  setCurrentObject: React.Dispatch<React.SetStateAction<{ type: ObjectType, color: string } | null>>
}> = ({ objects, setObjects, currentObject, setCurrentObject }) => {
  const { camera, raycaster, scene, gl } = useThree()
  const groundRef = useRef<THREE.Mesh>(null)
  
  // Handle drop events on the ground
  useEffect(() => {
    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      
      if (currentObject) {
        // Convert mouse position to 3D position
        const canvas = gl.domElement
        const rect = canvas.getBoundingClientRect()
        const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
        const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1
        
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera)
        
        if (groundRef.current) {
          const intersects = raycaster.intersectObject(groundRef.current)
          
          if (intersects.length > 0) {
            const point = intersects[0].point
            
            // Add new object
            const newObject: PlacedObject = {
              id: Date.now().toString(),
              type: currentObject.type,
              position: [point.x, 1, point.z], // Position 1 unit above the ground
              color: currentObject.color
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
  
  // Ground for raycasting
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
      {objects.map(obj => (
        <SimpleObject 
          key={obj.id}
          id={obj.id}
          type={obj.type}
          position={obj.position}
          color={obj.color}
        />
      ))}
    </>
  )
}

// Main component
export default function DragDrop3DObjects() {
  const [objects, setObjects] = useState<PlacedObject[]>([])
  const [currentObject, setCurrentObject] = useState<{ type: ObjectType, color: string } | null>(null)
  
  const handleDragStart = (objectType: ObjectType, color: string) => {
    setCurrentObject({ type: objectType, color })
  }
  
  return (
    <div className="relative w-full h-screen bg-gray-100">
      <Sidebar onDragStart={handleDragStart} />
      
      <Canvas shadows className="touch-none" camera={{ position: [5, 5, 5], fov: 50 }}>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} />
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        <Physics>
          <Ground />
          <Scene 
            objects={objects} 
            setObjects={setObjects} 
            currentObject={currentObject} 
            setCurrentObject={setCurrentObject} 
          />
        </Physics>
        
        <OrbitControls 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2 - 0.1} 
          enablePan={true}
        />
      </Canvas>
      
      <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm p-3 rounded-lg text-white">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm">{objects.length} objects</span>
        </div>
      </div>
    </div>
  )
}