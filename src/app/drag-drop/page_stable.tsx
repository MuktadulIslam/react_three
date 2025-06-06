"use client"

import { useState, useRef, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { DragControls } from 'three/addons/controls/DragControls.js'

// Define 3D object types
type ObjectType = 'box' | 'sphere' | 'cylinder'
type PlacedObject = {
  id: string
  type: ObjectType
  position: [number, number, number]
}

// Sidebar component
const Sidebar: React.FC<{
  onDragStart: (objectType: ObjectType) => void
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
            onDragStart('box')
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
            onDragStart('sphere')
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
            onDragStart('cylinder')
          }}
        >
          <div className="w-4 h-5 mr-3 bg-white/80 rounded-md"></div>
          <span>Cylinder</span>
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="text-xs opacity-50 text-center mb-2">
          Drag objects onto the plane
        </div>
        <div className="text-xs opacity-50 text-center">
          Click & drag placed objects to move them
        </div>
      </div>
    </div>
  )
}

// Ground plane component
const Ground: React.FC = () => {
  return (
    <mesh receiveShadow userData={{ ground: true }} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#fcfcfc" />
    </mesh>
  )
}

// Enhanced 3D object component with drag capability
const DraggableObject: React.FC<{
  type: ObjectType,
  position: [number, number, number],
  id: string,
  onPositionChange: (id: string, position: [number, number, number]) => void
}> = ({ type, position, id, onPositionChange }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [currentPosition, setCurrentPosition] = useState(position)
  
  // Update position when prop changes
  useEffect(() => {
    setCurrentPosition(position)
    if (meshRef.current) {
      meshRef.current.position.set(...position)
    }
  }, [position])
  
  let geometry
  let scale: [number, number, number] = [1, 1, 1]
  let color = '#4f46e5' // Default color
  
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
      ref={meshRef}
      position={currentPosition}
      scale={scale}
      castShadow
      userData={{ draggable: true, id, originalY: currentPosition[1] }}
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

// Drag Controls Handler
const DragControlsHandler: React.FC<{
  objects: PlacedObject[],
  onObjectMove: (id: string, position: [number, number, number]) => void
}> = ({ objects, onObjectMove }) => {
  const { camera, gl, scene } = useThree()
  const [draggableObjects, setDraggableObjects] = useState<THREE.Object3D[]>([])
  const [dragControls, setDragControls] = useState<any>(null)
  const orbitControlsRef = useRef<any>(null)

  // Find all draggable objects
  useEffect(() => {
    const findDraggableObjects = () => {
      const objects: THREE.Object3D[] = []
      
      scene.traverse((object) => {
        if (object.userData && object.userData.draggable) {
          objects.push(object)
        }
      })
      
      setDraggableObjects(objects)
    }
    
    // Wait a bit for all objects to be added to the scene
    const timeoutId = setTimeout(findDraggableObjects, 100)
    return () => clearTimeout(timeoutId)
  }, [scene, objects]) // Re-run when objects change

  // Initialize DragControls
  useEffect(() => {
    if (draggableObjects.length > 0) {
      // Clean up existing controls
      if (dragControls) {
        dragControls.dispose()
      }

      // Create new drag controls
      const controls = new DragControls(draggableObjects, camera, gl.domElement)
      
      // Add event listeners
      controls.addEventListener('dragstart', (event: any) => {
        // Disable orbit controls while dragging
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = false
        }
        
        // Store original Y position
        if (event.object.userData.originalY === undefined) {
          event.object.userData.originalY = event.object.position.y
        }
      })
      
      controls.addEventListener('dragend', (event: any) => {
        // Re-enable orbit controls after dragging
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = true
        }
        
        // Update object position in state
        const objectId = event.object.userData.id
        if (objectId) {
          const newPosition: [number, number, number] = [
            event.object.position.x,
            event.object.position.y,
            event.object.position.z
          ]
          onObjectMove(objectId, newPosition)
        }
      })
      
      controls.addEventListener('drag', (event: any) => {
        // Calculate proper Y position based on object type to sit on floor
        let floorY = 0
        const objectType = objects.find(obj => obj.id === event.object.userData.id)?.type
        
        switch (objectType) {
          case 'box':
            floorY = 0.5 // Half the height of the box
            break
          case 'sphere':
            floorY = 0.5 // Radius of the sphere
            break
          case 'cylinder':
            floorY = 0.75 // Half the height of the cylinder
            break
          default:
            floorY = 0.5
        }
        
        event.object.position.y = floorY
        
        // Constrain objects within floor boundaries (30x30 plane)
        const floorBoundary = 14 // Leave some margin from edge
        
        // Clamp X and Z positions
        event.object.position.x = Math.max(-floorBoundary, 
          Math.min(floorBoundary, event.object.position.x))
        event.object.position.z = Math.max(-floorBoundary, 
          Math.min(floorBoundary, event.object.position.z))
      })
      
      setDragControls(controls)
    }

    // Cleanup function
    return () => {
      if (dragControls) {
        dragControls.dispose()
      }
    }
  }, [draggableObjects, camera, gl.domElement, onObjectMove])

  return (
    <OrbitControls 
      ref={orbitControlsRef}
      minPolarAngle={0} 
      maxPolarAngle={Math.PI / 2 - 0.1} 
      enablePan={true}
    />
  )
}

// Scene component
const Scene: React.FC<{
  objects: PlacedObject[],
  setObjects: React.Dispatch<React.SetStateAction<PlacedObject[]>>,
  currentObject: { type: ObjectType } | null,
  setCurrentObject: React.Dispatch<React.SetStateAction<{ type: ObjectType } | null>>
}> = ({ objects, setObjects, currentObject, setCurrentObject }) => {
  const { camera, raycaster, scene, gl } = useThree()
  const groundRef = useRef<THREE.Mesh>(null)
  
  // Handle object position updates from drag controls
  const handleObjectMove = (id: string, newPosition: [number, number, number]) => {
    setObjects(prev => prev.map(obj => 
      obj.id === id ? { ...obj, position: newPosition } : obj
    ))
  }
  
  // Handle drop events on the ground for new objects
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
            
            // Add new object with proper Y position to sit on floor
            let floorY = 0
            switch (currentObject.type) {
              case 'box':
                floorY = 0.5 // Half the height of the box
                break
              case 'sphere':
                floorY = 0.5 // Radius of the sphere
                break
              case 'cylinder':
                floorY = 0.75 // Half the height of the cylinder
                break
            }
            
            const newObject: PlacedObject = {
              id: Date.now().toString(),
              type: currentObject.type,
              position: [point.x, floorY, point.z]
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
        child.geometry instanceof THREE.PlaneGeometry &&
        child.userData.ground
      ) as THREE.Mesh | undefined
      
      if (ground) {
        groundRef.current = ground
      }
    }
  })
  
  return (
    <>
      {objects.map(obj => (
        <DraggableObject 
          key={obj.id}
          id={obj.id}
          type={obj.type}
          position={obj.position}
          onPositionChange={handleObjectMove}
        />
      ))}
      
      <DragControlsHandler 
        objects={objects}
        onObjectMove={handleObjectMove}
      />
    </>
  )
}

// Main component
export default function EnhancedDragDrop3D() {
  const [objects, setObjects] = useState<PlacedObject[]>([])
  const [currentObject, setCurrentObject] = useState<{ type: ObjectType } | null>(null)
  
  const handleDragStart = (objectType: ObjectType) => {
    setCurrentObject({ type: objectType })
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
        
        <Ground />
        <Scene 
          objects={objects} 
          setObjects={setObjects} 
          currentObject={currentObject} 
          setCurrentObject={setCurrentObject} 
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