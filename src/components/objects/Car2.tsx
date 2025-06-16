'use client'
import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'

export default function CarModel() {
  const { scene } = useGLTF('./model.glb')
  const clonedScene = useMemo(() => scene.clone(), [scene])

  return <primitive object={clonedScene} />
}