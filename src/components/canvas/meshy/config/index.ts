import { MeshyModelVersion, Topology } from "../types";

const baseUrl = 'https://api.meshy.ai/openapi';

export const meshyAPIConfig = {
    // apiKey: process.env.MESHY_API_KEY || 'msy_dummy_api_key_for_test_mode_12345678',
    apiKey: process.env.MESHY_API_KEY || 'msy_P5hZAvmeUPtsFhlz69WMHiIM4Ypdl4odFDtN' || 'msy_dummy_api_key_for_test_mode_12345678',
    aimodel: 'meshy-4' as MeshyModelVersion,
    topology: 'triangle' as Topology,
    target_polycount: 30000,
    endpoints: {
        // Text to 3D uses v2
        textTo3D: `v2/text-to-3d`,
        textGenerated3D: (taskId: string) => `v2/text-to-3d/${taskId}`,

        imageTo3D: `v1/image-to-3d`,
        imageGenerated3D: (taskId: string) => `v1/image-to-3d/${taskId}`,

        // Refine uses v2 text-to-3d endpoint
        refine: `v2/text-to-3d`,
    },
    timeout: 30000, // 30 seconds for initial requests
    baseUrl: baseUrl,
};

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