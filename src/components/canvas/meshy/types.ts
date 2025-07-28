// src/components/canvas/meshy/types.ts
export type GenerationType = 'text-to-3d' | 'image-to-3d' | 'refine';
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

export interface MeshyTextTo3DRequest {
    prompt: string;
    art_style: ArtStyles;
    symmetry: Symmetry;
    seed?: number;
    model_version: MeshyModelVersion;
}

export interface MeshyImageTo3DRequest {
    image_data: string; // Base64 data URI
    model_version: MeshyModelVersion;
    symmetry: Symmetry;
    texture_prompt: string;
}

export interface MeshyRefineRequest {
    texture_prompt: string;
    texture_image_url?: string; // Optional base64 image
    mode: 'refine';
    moderation?: boolean;
    ai_model?: string;
    model_version?: MeshyModelVersion;
}

// Updated response type to match Meshy API
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
    task_error?: {
        message: string;
    } | null;
}

// Chat interface types
export interface ChatMessage {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    generationType?: GenerationType;
    imageUrl?: string; // For image-to-3d messages
    modelData?: Meshy3DObjectResponse;
    isGenerating?: boolean;
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
    generationHistory: ChatMessage[];
}