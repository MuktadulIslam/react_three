import { useMutation } from '@tanstack/react-query';
import { MeshyImageTo3DRequest, Meshy3DObjectResponse } from '../types';
import axios from 'axios';

export const useGet3DFromImage = () => {
    return useMutation({
        mutationFn: async (data: MeshyImageTo3DRequest): Promise<Meshy3DObjectResponse> => {
            if (!data.image_data) {
                throw new Error('Image data is required');
            }
            // Ensure image_data is in the correct format (base64 data URI)
            if (!data.image_data.startsWith('data:image/')) {
                throw new Error('Image data must be a valid data URI (data:image/...)');
            }

            try {
                const { data: responseData } = await axios.post(
                    '/api/meshy/image-to-3d',
                    data,
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