// src/components/canvas/meshy/types.ts
export type ActiveTab = 'text-to-3d' | 'image-to-3d' | 'refine-model';

export interface MeshyTextTo3DRequest {
    mode: 'preview' | 'refine';
    prompt: string;
    art_style?: 'realistic' | 'cartoon' | 'low-poly' | 'sculpture';
    negative_prompt?: string;
    seed?: number;
}

export interface MeshyImageTo3DRequest {
    mode: 'preview' | 'refine';
    image_url: string;
    prompt?: string;
    negative_prompt?: string;
    art_style?: 'realistic' | 'cartoon' | 'low-poly' | 'sculpture';
    seed?: number;
}

export interface MeshyTextureRequest {
    model_id: string;
    prompt?: string;
    art_style?: 'realistic' | 'cartoon' | 'low-poly' | 'sculpture';
    negative_prompt?: string;
}

export interface MeshyRefineRequest {
    preview_task_id: string;
    texture_resolution?: '1024' | '2048';
}

export interface MeshyTask {
    id: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED';
    created_at: string;
    finished_at?: string;
    progress?: number;
    task_error?: {
        message: string;
        code: string;
    };
    prompt?: string;
    art_style?: string;
    model_urls?: {
        glb?: string;
        fbx?: string;
        usdz?: string;
        obj?: string;
    };
    model_url?: string; // Some API responses use this
    download_url?: string; // Some API responses use this
    thumbnail_url?: string;
    thumbnails?: string[]; // Some API responses use array
    video_url?: string;
}

export interface MeshyGenerationState {
    taskId: string;
    status: MeshyTask['status'];
    progress: number;
    modelUrls?: MeshyTask['model_urls'];
    thumbnailUrl?: string;
    prompt?: string;
    error?: string;
    createdAt: string;
}

export interface GeneratedModel {
    id: string;
    name: string;
    prompt: string;
    thumbnailUrl: string;
    modelUrls: {
        glb?: string;
        fbx?: string;
        usdz?: string;
        obj?: string;
    };
    artStyle: string;
    createdAt: string;
    type: 'text-to-3d' | 'image-to-3d' | 'refined';
}