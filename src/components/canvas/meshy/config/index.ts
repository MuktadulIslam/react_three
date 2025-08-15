import { MeshyModelVersion, Topology } from "../types";

export const meshyAPIs = {
    imageTo3D: '/api/meshy/image-to-3d',
    textTo3D: '/api/meshy/text-to-3d',
    refineTextTo3D: '/api/meshy/refine'
}

export const meshyFormats = {
    supportedImageFormats: ['image/jpeg', 'image/png', 'image/webp'],
    supportedModelFormats: ['.fbx', '.glb', '.obj'],
    maxImageSize: 10 * 1024 * 1024, // 10MB
    maxModelSize: 50 * 1024 * 1024,  // 50MB
    maxImages: 4 // Maximum images for multi-image endpoint
};

export const meshyDefaults = {
    artStyles: [
        { value: 'realistic', label: 'Realistic' },
        { value: 'sculpture', label: 'Sculpture' }
    ],
    textureResolutions: [
        { value: '1024', label: '1024x1024' },
        { value: '2048', label: '2048x2048' }
    ],
    defaultNegativePrompt: 'low quality, low resolution, low poly, ugly, blurry, pixelated',
    
    // Multi-image specific defaults
    multiImageDefaults: {
        model: 'meshy-5' as MeshyModelVersion,
        topology: 'triangle' as Topology,
        target_polycount: 30000,
        symmetry_mode: 'auto',
        should_remesh: true,
        should_texture: true,
        moderation: false
    }
};