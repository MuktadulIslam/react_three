import { useMutation } from '@tanstack/react-query';
import { MeshyImageTo3DRequest, Meshy3DObjectResponse } from '../types';
import axios from 'axios';

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