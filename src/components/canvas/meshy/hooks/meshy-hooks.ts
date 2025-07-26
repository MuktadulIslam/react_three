// src/components/canvas/meshy/hooks/meshy-hooks.ts
import { useMutation } from '@tanstack/react-query';
import { MeshyTextTo3DRequest, MeshyImageTo3DRequest, MeshyRefineRequest, Meshy3DObjectResponse } from '../types';
import axios from 'axios';

// Text to 3D hook
export const useGet3DFromText = () => {
    return useMutation({
        mutationFn: async (data: MeshyTextTo3DRequest): Promise<Meshy3DObjectResponse> => {
            const { data: responseData } = await axios.post(
                '/api/meshy/text-to-3d',
                JSON.stringify(data),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            return responseData;
        },
        onSuccess: (responseData) => {
            console.log('Text-to-3D generation successful:', responseData);
            return responseData;
        },
        onError: (error) => {
            console.error('Error in text-to-3D generation:', error);
        }
    });
};

// Image to 3D hook
export const useGet3DFromImage = () => {
    return useMutation({
        mutationFn: async (data: MeshyImageTo3DRequest): Promise<Meshy3DObjectResponse> => {
            const { data: responseData } = await axios.post(
                '/api/meshy/image-to-3d',
                JSON.stringify(data),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            return responseData;
        },
        onSuccess: (responseData) => {
            console.log('Image-to-3D generation successful:', responseData);
            return responseData;
        },
        onError: (error) => {
            console.error('Error in image-to-3D generation:', error);
        }
    });
};

// Refine model hook
export const useRefineModel = () => {
    return useMutation({
        mutationFn: async (data: MeshyRefineRequest): Promise<Meshy3DObjectResponse> => {
            const { data: responseData } = await axios.post(
                '/api/meshy/refine',
                JSON.stringify(data),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            return responseData;
        },
        onSuccess: (responseData) => {
            console.log('Model refinement successful:', responseData);
            return responseData;
        },
        onError: (error) => {
            console.error('Error in model refinement:', error);
        }
    });
};

// Get task status hook (for polling)
export const useGetTaskStatus = () => {
    return useMutation({
        mutationFn: async (taskId: string): Promise<Meshy3DObjectResponse> => {
            const { data: responseData } = await axios.get(`/api/meshy/text-to-3d/${taskId}`);
            return responseData;
        },
        onError: (error) => {
            console.error('Error getting task status:', error);
        }
    });
};