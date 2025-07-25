// src/components/canvas/meshy/types.ts
export type ActiveTab = 'text-to-3d' | 'image-to-3d' | 'refine-model';
export type ArtStyles = 'realistic' | 'sculpture';
export type Symmetry = 'auto' | 'on' | 'off';

export interface MeshyTextTo3DRequest {
    prompt: string;
    art_style?: ArtStyles;
    symmetry: Symmetry;
    seed?: number;
}

export interface MeshyImageTo3DRequest {
    mode: 'preview' | 'refine';
    image_url: string;
    prompt?: string;
    negative_prompt?: string;
    art_style?: ArtStyles;
    seed?: number;
}

// export interface MeshyTextureRequest {
//     model_id: string;
//     prompt?: string;
//     art_style?: ArtStyles;
//     negative_prompt?: string;
// }

// export interface MeshyRefineRequest {
//     preview_task_id: string;
//     texture_resolution?: '1024' | '2048';
// }

export interface Meshy3DObjectResponse {
    id: string;
    model_urls?: {
        glb: string;
        fbx: string;
        usdz?: string;
        obj?: string;
        mtl?: string;
    };
    thumbnail_url?: string;
    progress?: number;
    started_at?: number;
    created_at?: number;
    expires_at?: number;
    finished_at?: number;
    texture_urls: [
        {
            base_color: string;
            metallic?: string;
            normal?: string;
            roughness?: string;
        }
    ];
}


// export interface MeshyGenerationState {
//     taskId: string;
//     status: MeshyTask['status'];
//     progress: number;
//     modelUrls?: MeshyTask['model_urls'];
//     thumbnailUrl?: string;
//     prompt?: string;
//     error?: string;
//     createdAt: string;
// }

// export interface GeneratedModel {
//     id: string;
//     name: string;
//     prompt: string;
//     thumbnailUrl: string;
//     modelUrls: {
//         glb?: string;
//         fbx?: string;
//         usdz?: string;
//         obj?: string;
//     };
//     artStyle: string;
//     createdAt: string;
//     type: 'text-to-3d' | 'image-to-3d' | 'refined';
// }