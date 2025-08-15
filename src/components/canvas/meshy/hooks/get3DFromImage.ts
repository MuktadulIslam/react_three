import { useMutation } from '@tanstack/react-query';
import { MeshyImageTo3DRequest, Meshy3DObjectResponse } from '../types';
import axios from 'axios';
import { meshyAPIs } from '../config';

export const useGet3DFromImage = () => {
    return useMutation({
        mutationFn: async (data: MeshyImageTo3DRequest): Promise<Meshy3DObjectResponse> => {
            const imageData = data.image_data;

            if (imageData.length === 0 || !imageData[0]) {
                throw new Error('At least one image is required');
            }

            // Validate all images are in the correct format (base64 data URI)
            for (let i = 0; i < imageData.length; i++) {
                if (!imageData[i] || !imageData[i].startsWith('data:image/')) {
                    throw new Error(`Image ${i + 1} must be a valid data URI (data:image/...)`);
                }
            }

            if (imageData.length > 4) { throw new Error('Maximum 4 images allowed'); }

            try {
                const payload = {
                    image_data: imageData,
                    model_version: data.model_version,
                    texture_prompt: data.texture_prompt,
                    symmetry: data.symmetry,
                };

                const { data: responseData } = await axios.post(
                    meshyAPIs.imageTo3D,
                    payload,
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

                    if (error.response?.status === 400) {
                        throw new Error(`Invalid request: ${errorMessage}`);
                    } else if (error.response?.status === 408) {
                        throw new Error(`Generation timeout: ${errorMessage}`);
                    } else {
                        throw new Error(`Image-to-3D generation failed: ${errorMessage}. Details: ${errorDetails}`);
                    }
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