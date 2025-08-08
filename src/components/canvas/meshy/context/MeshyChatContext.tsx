'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ChatMessage, ChatSession, GenerationType, Meshy3DObjectResponse, GenerationContext, ModelOption, GenerationTypeOption, SymmetryOption, ArtStyleOption, MeshyRefineModel } from '../types';
import { artStyleOptions, generationTypeOptions, modelOptions, symmetryOptions } from '../components/ChatInterface/InputArea/AdvancedSettings/constent';

interface MeshyChatContextType {
    // Current session
    currentSession: ChatSession | null;

    // Messages
    messages: ChatMessage[];
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
    updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;

    // Generation context for refinements
    generationContext: GenerationContext;
    updateGenerationContext: (context: Partial<GenerationContext>) => void;

    // Session management
    startNewSession: (type: GenerationType) => void;
    clearSession: () => void;

    // State
    isGenerating: boolean;
    setIsGenerating: (generating: boolean) => void;

    // Current input
    currentInput: string;
    setCurrentInput: (input: string) => void;

    // Current images for image-to-3d (now supports multiple)
    currentImages: string[];
    setCurrentImages: (images: string[]) => void;
    addCurrentImage: (image: string) => void;
    removeCurrentImage: (index: number) => void;
    clearCurrentImages: () => void;

    // Legacy single image support (for backward compatibility)
    currentImage: string | null;
    setCurrentImage: (image: string | null) => void;

    // current 3D model
    current3DModel: Meshy3DObjectResponse | null;
    setCurrent3DModel: (model: Meshy3DObjectResponse | null) => void;

    // Current model and context
    currentModel: ModelOption;
    setCurrentModel: (model: ModelOption) => void;

    // Current Generation Type
    currentGenerationType: GenerationTypeOption;
    setCurrentGenerationType: (generationType: GenerationTypeOption) => void;

    // current art style
    currentArtStyle: ArtStyleOption;
    setCurrentArtStyle: (artstyle: ArtStyleOption) => void;

    // current Symmetry Type
    currentSymmetry: SymmetryOption;
    setCurrentSymmetry: (symmetry: SymmetryOption) => void;

    // current MeshyRefineModel
    currentRefineModelData: MeshyRefineModel | null
    setCurrentRefineModelData: (model: MeshyRefineModel | null) => void
}

const MeshyChatContext = createContext<MeshyChatContextType | undefined>(undefined);

interface MeshyChatProviderProps {
    children: ReactNode;
}

export function MeshyChatProvider({ children }: MeshyChatProviderProps) {
    const [current3DModel, setCurrent3DModel] = useState<Meshy3DObjectResponse | null>(null);
    const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
    const [currentRefineModel, setCurrentRefineModel] = useState<MeshyRefineModel | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [generationContext, setGenerationContext] = useState<GenerationContext>({
        generationHistory: []
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentInput, setCurrentInput] = useState('');

    // Multi-image support
    const [currentImages, setCurrentImages] = useState<string[]>([]);

    // Legacy single image support (computed from currentImages)
    const currentImage = currentImages.length > 0 ? currentImages[0] : null;

    const [currentModel, setCurrentModel] = useState<ModelOption>(modelOptions.find(option => option.value === 'meshy-4') || modelOptions[0]);
    const [currentGenerationType, setCurrentGenerationType] = useState<GenerationTypeOption>(generationTypeOptions.find(option => option.value === 'text-to-3d') || generationTypeOptions[0]);
    const [currentArtStyle, setCurrentArtStyle] = useState<ArtStyleOption>(artStyleOptions.find(option => option.value === 'realistic') || artStyleOptions[0]);
    const [currentSymmetry, setCurrentSymmetry] = useState<SymmetryOption>(symmetryOptions.find(option => option.value === 'auto') || symmetryOptions[0]);

    // Auto-switch to meshy-5 when multiple images are uploaded
    // const handleImagesChange = useCallback((images: string[]) => {
    //     // Auto-switch to meshy-5 if more than one image and currently on meshy-4
    //     if (images.length > 1 && currentModel.value === 'meshy-4') {
    //         const meshy5Option = modelOptions.find(option => option.value === 'meshy-5');
    //         if (meshy5Option) {
    //             setCurrentModel(meshy5Option);
    //         }
    //     }
    // }, [currentModel.value]);

    const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        const newMessage: ChatMessage = {
            ...message,
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);

        // Update generation context if this is a generation message
        if (message.generationType && message.type === 'user') {
            setGenerationContext(prev => ({
                ...prev,
                generationHistory: [...prev.generationHistory, newMessage]
            }));
        }

        return newMessage.id;
    }, []);

    const updateMessage = useCallback((messageId: string, updates: Partial<ChatMessage>) => {
        setMessages(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, ...updates } : msg
        ));
    }, []);

    const updateGenerationContext = useCallback((context: Partial<GenerationContext>) => {
        setGenerationContext(prev => ({ ...prev, ...context }));
    }, []);

    const setCurrentRefineModelData = useCallback((model: MeshyRefineModel | null) => {
        if (model && model.model_thumbnail_url != '' && model.preview_task_id != '') setCurrentRefineModel(model);
        else setCurrentRefineModel(model);
    }, []);

    const startNewSession = useCallback((type: GenerationType) => {
        const newSession: ChatSession = {
            id: `session-${Date.now()}`,
            messages: [],
            activeGenerationType: type,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        setCurrentSession(newSession);
        setMessages([]);
        setGenerationContext({ generationHistory: [] });
        setCurrentInput('');
        setCurrentImages([]);
        setIsGenerating(false);

        // Add welcome message
        const welcomeMessage: ChatMessage = {
            id: `welcome-${Date.now()}`,
            type: 'assistant',
            content: getWelcomeMessage(type),
            timestamp: new Date()
        };

        setMessages([welcomeMessage]);
    }, []);

    const clearSession = useCallback(() => {
        setCurrentSession(null);
        setMessages([]);
        setGenerationContext({ generationHistory: [] });
        setCurrentInput('');
        setCurrentImages([]);
        setIsGenerating(false);
    }, []);

    // Multi-image management functions
    const setCurrentImagesFunction = useCallback((images: string[]) => {
        setCurrentImages(images);
        // handleImagesChange(images);
    }, []);

    const addCurrentImage = useCallback((image: string) => {
        setCurrentImages(prev => {
            if (prev.length >= 4) {
                // Replace the last image if we're at the limit
                return [...prev.slice(0, 3), image];
            }
            const newImages = [...prev, image];
            // handleImagesChange(newImages);
            return newImages;
        });
    }, []);

    const removeCurrentImage = useCallback((index: number) => {
        setCurrentImages(prev => {
            const newImages = prev.filter((_, i) => i !== index);
            return newImages;
        });
    }, []);

    const clearCurrentImages = useCallback(() => {
        setCurrentImages([]);
    }, []);

    // Legacy single image setter (for backward compatibility)
    const setCurrentImage = useCallback((image: string | null) => {
        if (image === null) {
            setCurrentImages([]);
        } else {
            setCurrentImages([image]);
        }
    }, []);

    const contextValue: MeshyChatContextType = {
        current3DModel,
        setCurrent3DModel,
        currentSession,
        messages,
        addMessage,
        updateMessage,
        currentModel,
        setCurrentModel,
        generationContext,
        updateGenerationContext,
        startNewSession,
        clearSession,
        isGenerating,
        setIsGenerating,
        currentInput,
        setCurrentInput,
        currentImages,
        setCurrentImages: setCurrentImagesFunction,
        addCurrentImage,
        removeCurrentImage,
        clearCurrentImages,
        currentImage,
        setCurrentImage,
        currentGenerationType,
        setCurrentGenerationType,
        currentArtStyle,
        setCurrentArtStyle,
        currentSymmetry,
        setCurrentSymmetry,
        currentRefineModelData: currentRefineModel,
        setCurrentRefineModelData
    };

    return (
        <MeshyChatContext.Provider value={contextValue}>
            {children}
        </MeshyChatContext.Provider>
    );
}

export function useMeshyChat() {
    const context = useContext(MeshyChatContext);
    if (context === undefined) {
        throw new Error('useMeshyChat must be used within a MeshyChatProvider');
    }
    return context;
}

function getWelcomeMessage(type: GenerationType): string {
    switch (type) {
        case 'text-to-3d':
            return "👋 Hi! I'm your AI 3D model generator. Describe what you'd like to create and I'll generate a 3D model for you. You can also refine and iterate on models throughout our conversation!";
        case 'image-to-3d':
            return "📸 Hi! Upload up to 4 images and I'll convert them into a 3D model. The first image will be used as the primary reference, with additional images providing context. Multiple images automatically use our advanced Meshy-5 model!";
        default:
            return "✨ Hi! I can help you refine existing 3D models by adding textures and details. Upload a model or generate one first, then tell me how you'd like to improve it!";
    }
}