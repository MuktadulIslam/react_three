import { NextRequest, NextResponse } from 'next/server';
import { meshyAPIConfig } from '@/components/canvas/meshy/config';
import meshyAxiosInstance from '../../axios-config';
import axios from 'axios';

export async function GET({ params }: { params: { taskId: string } }) {
    try {
        const { taskId } = params;
        if (!taskId) {
            return NextResponse.json(
                { error: 'Task ID is required' },
                { status: 400 }
            );
        }

        const response = await meshyAxiosInstance.get(meshyAPIConfig.endpoints.textGenerated3D(taskId));
        return NextResponse.json(response.data);

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const message = error.response?.data?.error || error.message;

            return NextResponse.json(
                { error: `Failed to get task status: ${message}` },
                { status }
            );
        }
        return NextResponse.json(
            { error: 'Failed to get task status' },
            { status: 500 }
        );
    }
}