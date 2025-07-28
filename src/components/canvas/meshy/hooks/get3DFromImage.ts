// src/components/canvas/meshy/hooks/get3DFromImage.ts
import { useMutation } from '@tanstack/react-query';
import { MeshyImageTo3DRequest, Meshy3DObjectResponse } from '../types';
import axios from 'axios';

export const useGet3DFromImage = () => {
    return useMutation({
        mutationFn: async (data: MeshyImageTo3DRequest): Promise<Meshy3DObjectResponse> => {
            // Handle both single image and multiple images
            const imageData = Array.isArray(data.image_data) ? data.image_data : [data.image_data];

            if (imageData.length === 0 || !imageData[0]) {
                throw new Error('At least one image is required');
            }

            // Validate all images are in the correct format (base64 data URI)
            for (let i = 0; i < imageData.length; i++) {
                if (!imageData[i].startsWith('data:image/')) {
                    throw new Error(`Image ${i + 1} must be a valid data URI (data:image/...)`);
                }
            }

            try {
                // For multiple images, send as array; for single image, send as string for backward compatibility
                const requestData = {
                    ...data,
                    image_data: imageData.length === 1 ? imageData[0] : imageData,
                    // Force meshy-5 for multiple images
                    model_version: imageData.length > 1 ? 'meshy-5' : data.model_version
                };

                const { data: responseData } = await axios.post(
                    '/api/meshy/image-to-3d',
                    requestData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        timeout: 300000 // 5 minutes timeout
                    }
                );
                return responseData;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const errorMessage = error.response?.data?.error || error.message;
                    const errorDetails = error.response?.data?.details || 'Unknown error';
                    throw new Error(`Image-to-3D generation failed: ${errorMessage}. Details: ${errorDetails}`);
                }

                throw error;
            }
        },
        onSuccess: (responseData) => {
            return responseData;
        },
        onError: (error) => {
            console.error('Error in image-to-3D generation:', error);
        }
    });
};