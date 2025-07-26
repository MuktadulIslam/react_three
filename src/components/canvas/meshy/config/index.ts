// src/components/canvas/meshy/config/index.ts
export type AImodel = 'meshy-4' | 'meshy-5';
export type Topology = 'quad' | 'triangle';
const baseUrl = 'https://api.meshy.ai/v2';

export const meshyAPIConfig = {
    apiKey: process.env.MESHY_API_KEY || 'msy_dummy_api_key_for_test_mode_12345678',
    aimodel: 'meshy-4' as AImodel,
    topology: 'triangle' as Topology,
    target_polycount: 30000,
    endpoints: {
        textTo3D: `text-to-3d`,
        textGenerated3D: (taskId: string) => `text-to-3d/${taskId}`,
        imageTo3D: `image-to-3d`, // Updated endpoint
        imageGenerated3D: (taskId: string) => `image-to-3d/${taskId}`, // Added for consistency
    },
    timeout: 30000, // 30 seconds
    baseUrl: baseUrl,
};

export const meshyFormats = {
    supportedImageFormats: ['image/jpeg', 'image/png', 'image/webp'],
    supportedModelFormats: ['.fbx', '.glb', '.obj'],
    maxImageSize: 10 * 1024 * 1024, // 10MB
    maxModelSize: 50 * 1024 * 1024  // 50MB
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
    defaultNegativePrompt: 'low quality, low resolution, low poly, ugly, blurry, pixelated'
};