import { useGLTF, Html } from '@react-three/drei';
import { useMeshyModelUrl } from '../hooks/useMeshyModelUrl';
import { Suspense } from 'react';
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

// Separate component for the actual GLTF loading
function GLTFModel({ blobUrl }: { blobUrl: string }) {
    // Remove try-catch - let React's error boundary handle errors
    const { scene } = useGLTF(blobUrl);
    return <primitive object={scene} scale={1} />;
}

// Updated Model component with comprehensive error handling
export default function MeshyModel({ url }: { url: string }) {
    // Use the hook to get the blob URL
    const { data: blobUrl, isLoading, isError } = useMeshyModelUrl(url);

    if (isLoading) return <ModelLoadingFallback />;
    if (isError) return <ModelErrorFallback />;
    if (!blobUrl) return <ModelLoadingFallback />;

    // Wrap the GLTF component in error boundary and suspense
    return (
        <ErrorBoundary
            fallbackRender={() => <ModelErrorFallback/>}
            onError={(error) => {
                console.error('GLTF Model Error:', error);
            }}
        >
            <Suspense fallback={<ModelLoadingFallback />}>
                <GLTFModel blobUrl={blobUrl} />
            </Suspense>
        </ErrorBoundary>
    );
}