export type GenerationType = 'text-to-3d' | 'image-to-3d';
export type ArtStyles = 'realistic' | 'sculpture';
export type Symmetry = 'auto' | 'on' | 'off';
export type MeshyModelVersion = 'meshy-4' | 'meshy-5';
export type Topology = 'quad' | 'triangle';

interface Options {
    label: string;
    description: string;
    icon: string;
}
export interface ArtStyleOption extends Options {
    value: ArtStyles;
}
export interface GenerationTypeOption extends Options {
    value: GenerationType;
}
export interface SymmetryOption extends Options {
    value: Symmetry;
}
export interface ModelOption extends Options {
    value: MeshyModelVersion;
}

export interface MeshyRefineModel {
    model_thumbnail_url: string,
    preview_task_id: string
}

export interface MeshyTextTo3DRequest {
    prompt: string;
    art_style: ArtStyles;
    symmetry: Symmetry;
    seed?: number;
    model_version: MeshyModelVersion;
    texture_image_url?: string;
}

export interface MeshyImageTo3DRequest {
    image_data: string[];
    model_version: MeshyModelVersion;
    symmetry: Symmetry;
    texture_prompt: string;
}

export interface MeshyRefineRequest {
    preview_task_id: string;
    texture_prompt?: string;
    texture_image_url?: string[];
    model_version?: MeshyModelVersion;
    moderation?: boolean;
}

export interface Meshy3DObjectResponse {
    id: string;
    model_urls?: {
        glb?: string;
        fbx?: string;
        usdz?: string;
        obj?: string;
        mtl?: string;
    };
    thumbnail_url?: string;
    texture_prompt?: string;
    progress?: number;
    status: 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';
    started_at?: number;
    created_at?: number;
    expires_at?: number;
    finished_at?: number;
    texture_urls?: Array<{
        base_color?: string;
        metallic?: string;
        normal?: string;
        roughness?: string;
    }>;
    preceding_tasks?: number;
    task_error?: {
        message: string;
    } | null;
}

export interface ChatMessage {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    generationType?: GenerationType;
    imageUrl?: string;
    imageUrls?: string[];
    modelData?: Meshy3DObjectResponse;
    isGenerating?: boolean;
    refineModelData?: MeshyRefineModel;
}

export interface ChatSession {
    id: string;
    messages: ChatMessage[];
    currentModel?: Meshy3DObjectResponse;
    activeGenerationType: GenerationType;
    createdAt: Date;
    updatedAt: Date;
}

export interface GenerationContext {
    currentModel?: Meshy3DObjectResponse;
    basePrompt?: string;
    baseImage?: string;
    baseImages?: string[];
    generationHistory: ChatMessage[];
}

// Interface for sidebar model data
export interface SidebarModelData {
    id: string;
    name: string;
    url: string;
    fileType: 'glb';
    model: Meshy3DObjectResponse;
}