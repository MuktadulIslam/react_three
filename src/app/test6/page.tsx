'use client'

import React, { useState, useRef, Suspense, useEffect, JSX } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html } from '@react-three/drei'
import { Group } from 'three'
import * as THREE from 'three'

// Type definitions
interface ModelProps {
  modelUrl: string
  onError?: () => void
}

interface AppState {
  modelUrl: string | null
  loading: boolean
  error: string | null
}

// Loading component
function Loader(): JSX.Element {
  return (
    <Html center>
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-white">Loading model...</span>
      </div>
    </Html>
  )
}

// Error boundary for model loading
function ModelErrorBoundary({ children, onError }: { 
  children: React.ReactNode
  onError?: () => void 
}): JSX.Element {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (hasError) {
      onError?.()
    }
  }, [hasError, onError])

  if (hasError) {
    return (
      <Html center>
        <div className="text-center text-red-400">
          <div className="text-4xl mb-2">⚠️</div>
          <div className="text-lg">Failed to load model</div>
          <div className="text-sm text-gray-400">Please check if the GLB file is valid</div>
        </div>
      </Html>
    )
  }

  try {
    return <>{children}</>
  } catch (error) {
    console.error('Model loading error:', error)
    if (!hasError) {
      setHasError(true)
    }
    return (
      <Html center>
        <div className="text-center text-red-400">
          <div className="text-4xl mb-2">⚠️</div>
          <div className="text-lg">Failed to load model</div>
          <div className="text-sm text-gray-400">Please check if the GLB file is valid</div>
        </div>
      </Html>
    )
  }
}

// Model component that handles the uploaded GLB file
function Model({ modelUrl, onError }: ModelProps): JSX.Element | null {
  const modelRef = useRef<Group>(null)
  const [modelLoaded, setModelLoaded] = useState(false)
  
  // Always call useGLTF hook
  const gltf = useGLTF(modelUrl, true) // Enable loading validation
  
  // Effect to handle loading success/failure
  useEffect(() => {
    if (gltf && gltf.scene) {
      console.log('Model loaded successfully:', gltf)
      setModelLoaded(true)
      
      // Center and scale the model
      const box = new THREE.Box3().setFromObject(gltf.scene)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      
      // Center the model
      gltf.scene.position.sub(center)
      
      // Scale the model to fit in a reasonable size
      const maxSize = Math.max(size.x, size.y, size.z)
      if (maxSize > 0) {
        const scale = 2 / maxSize // Adjust this value to change model size
        gltf.scene.scale.setScalar(scale)
      }
    } else if (gltf === undefined) {
      console.error('Failed to load GLB model')
      onError?.()
    }
  }, [gltf, onError])
  
  // Always call useFrame, but conditionally execute the animation
  useFrame((state) => {
    if (modelRef.current && modelLoaded) {
      modelRef.current.rotation.y += 0.005 // Smooth continuous rotation
    }
  })
  
  // Return early if no scene loaded
  if (!gltf || !gltf.scene || !modelLoaded) {
    return null
  }
  
  return (
    <group ref={modelRef}>
      <primitive object={gltf.scene} />
    </group>
  )
}

export default function App(): JSX.Element {
  const [state, setState] = useState<AppState>({
    modelUrl: null,
    loading: false,
    error: null
  })
  
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (state.modelUrl) {
        URL.revokeObjectURL(state.modelUrl)
      }
    }
  }, [state.modelUrl])

  const processFile = async (file: File): Promise<void> => {
    // Check if file is GLB
    if (!file.name.toLowerCase().endsWith('.glb')) {
      setState(prev => ({ ...prev, error: 'Please upload a .glb file' }))
      return
    }
    
    // Check file size (limit to 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setState(prev => ({ ...prev, error: 'File size too large. Please upload a file smaller than 50MB.' }))
      return
    }
    
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      // Create object URL for the uploaded file
      const url = URL.createObjectURL(file)
      
      // Test if the file can be read as ArrayBuffer (basic validation)
      const arrayBuffer = await file.arrayBuffer()
      if (arrayBuffer.byteLength === 0) {
        throw new Error('File appears to be empty')
      }
      
      console.log(`Loading GLB file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)
      setState(prev => ({ ...prev, modelUrl: url, loading: false }))
      
    } catch (error) {
      console.error('File validation error:', error)
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to process the uploaded file. Please ensure it\'s a valid GLB file.',
        loading: false 
      }))
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (!file) return
    await processFile(file)
  }

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()
    
    // Only set dragOver to false if we're leaving the drop zone entirely
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>): Promise<void> => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await processFile(files[0])
    }
  }

  const handleModelError = (): void => {
    setState(prev => ({
      ...prev,
      error: 'Failed to load the 3D model. Please check if the file is valid.',
      loading: false
    }))
  }

  const clearModel = (): void => {
    if (state.modelUrl) {
      URL.revokeObjectURL(state.modelUrl)
    }
    setState({ modelUrl: null, loading: false, error: null })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900">
      {/* Header with upload controls */}
      <div className="bg-gray-800 p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">3D Model Viewer</h1>
          
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".glb"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            
            <label
              htmlFor="file-upload"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {state.loading ? 'Processing...' : 'Upload GLB File'}
            </label>
            
            {state.modelUrl && (
              <button
                onClick={clearModel}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear
              </button>
            )}
          </div>
        </div>
        
        {/* Error message */}
        {state.error && (
          <div className="mt-4 max-w-4xl mx-auto">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {state.error}
            </div>
          </div>
        )}
      </div>

      {/* Canvas area with drag and drop */}
      <div 
        ref={dropZoneRef}
        className={`flex-1 relative transition-colors duration-200 ${
          isDragOver ? 'bg-blue-50 border-2 border-blue-400 border-dashed' : ''
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-blue-900 bg-opacity-75 backdrop-blur-sm">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">📁</div>
              <div className="text-2xl font-bold mb-2">Drop GLB file here</div>
              <div className="text-lg text-blue-200">Release to upload your 3D model</div>
            </div>
          </div>
        )}

        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          className="bg-gradient-to-b from-gray-800 to-gray-900"
        >
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={20}
          />
          
          {/* Lighting setup */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />
          <directionalLight position={[0, 10, 5]} intensity={0.5} />
          
          {/* Model rendering */}
          {state.modelUrl && (
            <Suspense fallback={<Loader />}>
              <ModelErrorBoundary onError={handleModelError}>
                <Model modelUrl={state.modelUrl} onError={handleModelError} />
              </ModelErrorBoundary>
            </Suspense>
          )}
          
          {/* Default message when no model is loaded */}
          {!state.modelUrl && !state.loading && (
            <Html center>
              <div className="text-center text-white">
                <div className="text-6xl mb-4">📦</div>
                <div className="text-xl font-semibold mb-2">No 3D Model Loaded</div>
                <div className="text-gray-300 mb-4">Drag & drop a .glb file here</div>
                <div className="text-sm text-gray-400">or use the upload button above</div>
              </div>
            </Html>
          )}
        </Canvas>
        
        {/* Controls info */}
        <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 rounded-lg p-3">
          <div className="text-sm font-semibold mb-1">Controls:</div>
          <div className="text-xs space-y-1">
            <div>• Left click + drag: Rotate</div>
            <div>• Right click + drag: Pan</div>
            <div>• Scroll: Zoom in/out</div>
            <div>• Drag & drop GLB files anywhere</div>
          </div>
        </div>
      </div>
    </div>
  )
}