export type GenerationType = 'text-to-3d' | 'image-to-3d' | 'refine';
export type ArtStyles = 'realistic' | 'sculpture';
export type Symmetry = 'auto' | 'on' | 'off';
export type MeshyModelVersion = 'meshy-4' | 'meshy-5';

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
    art_style?: ArtStyles;
    symmetry: Symmetry;
    seed?: number;
    model_version?: MeshyModelVersion;
}

export interface MeshyImageTo3DRequest {
    mode: 'preview' | 'refine';
    image_url: string;
    prompt?: string;
    negative_prompt?: string;
    art_style?: ArtStyles;
    seed?: number;
    model_version?: MeshyModelVersion;
}

export interface MeshyRefineRequest {
    texture_prompt: string;
    texture_image_url?: string; // Optional base64 image
    mode: 'refine';
    moderation?: boolean;
    ai_model?: string;
    model_version?: MeshyModelVersion;
}

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