import { useMutation } from '@tanstack/react-query';
import { MeshyRefineRequest, Meshy3DObjectResponse } from '../types';
import axios from 'axios';

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