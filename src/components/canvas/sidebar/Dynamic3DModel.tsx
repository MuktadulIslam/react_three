'use client'
import { useGLTF, useFBX } from '@react-three/drei'
import { useMemo } from 'react'
import ScaledModelWrapper from '../components/ScaledModelWrapper'
import MeshyModel from '../meshy/components/MeshyModel'

interface Dynamic3DModelProps {
    url: string;
    fileType: 'glb' | 'fbx';
    isMeshyUrl?: boolean;
}

// Separate component for GLB files
function GLBModel({ url }: { url: string }) {
    const gltf = useGLTF(url);

    const clonedScene = useMemo(() => {
        return gltf.scene.clone();
    }, [gltf]);

    return (
        <ScaledModelWrapper>
            <primitive object={clonedScene} />
        </ScaledModelWrapper>
    );
}

// Separate component for FBX files
function FBXModel({ url }: { url: string }) {
    const fbx = useFBX(url);

    const clonedScene = useMemo(() => {
        return fbx.clone();
    }, [fbx]);

    return (
        <ScaledModelWrapper>
            <primitive object={clonedScene} />
        </ScaledModelWrapper>
    );
}

// Main component that conditionally renders the appropriate model component
export default function Dynamic3DModel({ url, fileType, isMeshyUrl = false }: Dynamic3DModelProps) {
    // Check if this is a Meshy URL (either by prop or URL pattern)
    const isMeshyModelUrl = isMeshyUrl || url.includes('assets.meshy.ai');
    
    if (isMeshyModelUrl && fileType === 'glb') {
        // Use MeshyModel for Meshy URLs - it handles the proxy and blob conversion
        return <MeshyModel url={url} />;
    } else if (fileType === 'glb') {
        return <GLBModel url={url} />;
    } else if (fileType === 'fbx') {
        return <FBXModel url={url} />;
    }

    return null;
}