// src/components/canvas/meshy/hooks/getRefineModel.ts
import { useMutation } from '@tanstack/react-query';
import { MeshyRefineRequest, Meshy3DObjectResponse } from '../types';
import axios from 'axios';

export const useRefineModel = () => {
    return useMutation({
        mutationFn: async (data: MeshyRefineRequest): Promise<Meshy3DObjectResponse> => {
            // Handle both single image and multiple images for refinement
            let processedImageUrl;

            if (data.texture_image_url) {
                if (Array.isArray(data.texture_image_url)) {
                    // Multiple images provided
                    if (data.texture_image_url.length === 0) {
                        processedImageUrl = undefined;
                    } else if (data.texture_image_url.length === 1) {
                        processedImageUrl = data.texture_image_url[0];
                    } else {
                        // For multiple images, we'll use the first one as primary
                        // and potentially combine or process them differently
                        processedImageUrl = data.texture_image_url[0];
                        // Note: You might want to implement multi-image refinement logic here
                        // For now, we're using the primary image
                    }
                } else {
                    // Single image provided
                    processedImageUrl = data.texture_image_url;
                }
            }

            const requestData = {
                ...data,
                texture_image_url: processedImageUrl,
                // Force meshy-5 for multiple images
                model_version: Array.isArray(data.texture_image_url) && data.texture_image_url.length > 1
                    ? 'meshy-5'
                    : data.model_version
            };

            const { data: responseData } = await axios.post(
                '/api/meshy/refine',
                JSON.stringify(requestData),
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