import { useMutation, } from '@tanstack/react-query';
import { MeshyTextTo3DRequest, Meshy3DObjectResponse } from '../types';
import axios from 'axios';
import { meshyAPIs } from '../config';

export const useGet3DFromText = () => {
    return useMutation({
        mutationFn: async (data: MeshyTextTo3DRequest): Promise<Meshy3DObjectResponse> => {
            const { data: responseData } = await axios.post(
                meshyAPIs.textTo3D,
                JSON.stringify(data),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            return responseData
        },
        onSuccess: (responseData) => {
            return responseData;
        },
        onError: (error) => {
            console.error('Error updating the simulation!', error);
        }
    });
};