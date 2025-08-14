import { useGLTF, Html } from '@react-three/drei';
import { useMeshyModelUrl } from '../hooks/useMeshyModelUrl';
import { useModelCache } from '../hooks/useModelCache';
import { Suspense, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Loading component for when the model is being fetched
function ModelLoadingFallback() {
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center text-white w-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                <div className="text-sm">Loading model...</div>
            </div>
        </Html>
    );
}

// Error component for when model fetch fails
function ModelErrorFallback() {
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center text-red-400 w-[200px] text-center">
                <div className="text-3xl mb-2">⚠️</div>
                <div className="text-lg font-medium mb-1">Failed to load model</div>
            </div>
        </Html>
    );
}

// Cached GLTF component that uses the cache
function CachedGLTFModel({ meshyUrl, blobUrl }: { meshyUrl: string; blobUrl: string }) {
    const { setCachedModel } = useModelCache();
    const { scene } = useGLTF(blobUrl);
    useMemo(() => {
        if (scene) {
            setCachedModel(meshyUrl, scene);
        }
    }, [scene, meshyUrl, setCachedModel]);

    return <primitive object={scene} scale={1} />;
}

interface MeshyModelProps {
    url: string;
    setIsError?: React.Dispatch<React.SetStateAction<boolean>>;
}

// Updated Model component with comprehensive caching
export default function MeshyModel({ url, setIsError }: MeshyModelProps) {
    const { getCachedModel } = useModelCache();
    // Move ALL hooks to the top level - they must always be called
    const { data: blobUrl, isLoading } = useMeshyModelUrl(url);

    const cachedModel = useMemo(() => {
        return getCachedModel(url);
    }, [url, getCachedModel]);

    // Now handle the conditional logic AFTER all hooks are called
    if (cachedModel) {
        const clonedScene = cachedModel.scene.clone();
        return <primitive object={clonedScene} scale={1} />;
    }

    if (isLoading) return <ModelLoadingFallback />;
    if (!blobUrl) return <ModelLoadingFallback />;

    // Wrap the GLTF component in error boundary and suspense
    return (
        <ErrorBoundary
            fallbackRender={() => <ModelErrorFallback />}
            onError={(error) => {
                if (setIsError != null) setIsError(true);
                console.error('GLTF Model Error:', error);
            }}
        >
            <Suspense fallback={<ModelLoadingFallback />}>
                <CachedGLTFModel meshyUrl={url} blobUrl={blobUrl} />
            </Suspense>
        </ErrorBoundary>
    );
}