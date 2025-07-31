import { ArtStyleOption, GenerationTypeOption, ModelOption, SymmetryOption } from "@/components/canvas/meshy/types";

export const artStyleOptions: ArtStyleOption[] = [
    { value: 'realistic', label: 'Realistic', description: 'Photorealistic 3D models', icon: '📷' },
    { value: 'sculpture', label: 'Sculpture', description: 'Artistic sculptural style', icon: '🗿' }
];

export const generationTypeOptions: GenerationTypeOption[] = [
    { value: 'text-to-3d', label: 'Text to 3D', description: 'Generate 3D models from text descriptions', icon: '📝' },
    { value: 'image-to-3d', label: 'Image to 3D', description: 'Convert images to 3D models', icon: '🖼️' },
];

export const symmetryOptions: SymmetryOption[] = [
    { value: 'auto', label: 'Auto', description: 'Automatically detect symmetry', icon: '🤖' },
    { value: 'on', label: 'On', description: 'Force symmetrical generation', icon: '⚖️' },
    { value: 'off', label: 'Off', description: 'Allow asymmetrical generation', icon: '🎭' }
];

export const modelOptions: ModelOption[] = [
    { value: 'meshy-4', label: 'Meshy-4', description: 'Fast and efficient 3D generation', icon: '✨' },
    { value: 'meshy-5', label: 'Meshy-5', description: 'Latest model with improved quality', icon: '✨' }
];