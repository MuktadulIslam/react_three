import { useMutation, } from '@tanstack/react-query';
import { MeshyTextTo3DRequest, Meshy3DObjectResponse } from '../types';
import axios from 'axios';

export const useGet3DFromText = () => {
    return useMutation({
        mutationFn: async (data: MeshyTextTo3DRequest): Promise<Meshy3DObjectResponse> => {
            const { data: responseData } = await axios.post(
                '/api/meshy/text-to-3d',
                JSON.stringify(data)
            );
            return responseData
        },
        onSuccess: (responseData) => {
            return responseData;
        },
        onError: (error) => {
            console.log('Error updating the simulation!', error);
        }
    });
};