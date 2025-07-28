import { NextRequest, NextResponse } from 'next/server';
import { meshyAPIConfig } from '@/components/canvas/meshy/config';
import meshyAxiosInstance from '../axios-config';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const payload = {
            image_url: body.image_data,
            ai_model: body.model_version || meshyAPIConfig.aimodel,
            symmetry: body.symmetry || 'auto',
            topology: meshyAPIConfig.topology,
            should_remesh: true,
        };

        const response = await meshyAxiosInstance.post(meshyAPIConfig.endpoints.imageTo3D, payload);
        console.log("Image-to-3d= ", response)
        const object = await meshyAxiosInstance.get(meshyAPIConfig.endpoints.imageGenerated3D(response.data.result));
        return NextResponse.json(object.data);

    } catch (error) {
        console.error('Text-to-3D API error:', error);
        return NextResponse.json(
            { error: 'Failed to generate 3D model from text' },
            { status: 500 }
        );
    }
}