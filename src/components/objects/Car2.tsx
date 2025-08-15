'use client'
import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import ScaledModelWrapper from '../canvas/components/ScaledModelWrapper'

export default function CarModel() {
  const { scene } = useGLTF('./model.glb')
  const clonedScene = useMemo(() => scene.clone(), [scene])

  return <ScaledModelWrapper>
    <primitive object={clonedScene} />
  </ScaledModelWrapper>
}