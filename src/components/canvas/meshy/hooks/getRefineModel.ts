import { useMutation } from '@tanstack/react-query';
import { MeshyRefineRequest, Meshy3DObjectResponse } from '../types';
import axios from 'axios';
import { meshyAPIs } from '../config';

export const useRefineModel = () => {
    return useMutation({
        mutationFn: async (data: MeshyRefineRequest): Promise<Meshy3DObjectResponse> => {
            if (data.preview_task_id == null || data.preview_task_id == '') {
                throw new Error('Valid preview task id is required');
            }

            const payload = { ...data }

            const { data: responseData } = await axios.post(
                meshyAPIs.refineTextTo3D,
                JSON.stringify(payload),
                { headers: { 'Content-Type': 'application/json', } }
            );
            return responseData;
        },
        onSuccess: (responseData) => {
            return responseData;
        },
        onError: (error) => {
            console.error('Error in model refinement:', error);
        }
    });
};