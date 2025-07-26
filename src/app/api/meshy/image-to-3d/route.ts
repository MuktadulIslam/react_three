// src/app/api/meshy/image-to-3d/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { meshyAPIConfig } from '@/components/canvas/meshy/config';
import meshyAxiosInstance from '../axios-config';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const payload = {
            mode: body.mode || 'preview',
            image_url: body.image_url, // This should be a base64 data URI or URL
            prompt: body.prompt || '',
            negative_prompt: body.negative_prompt || 'low quality, low resolution, low poly, ugly',
            art_style: body.art_style || 'realistic',
            seed: body.seed || Math.floor(Math.random() * 1000000),
            ai_model: meshyAPIConfig.aimodel,
        };

        console.log('Image-to-3D payload:', { ...payload, image_url: payload.image_url ? 'base64_data_present' : 'no_image' });

        const response = await meshyAxiosInstance.post(meshyAPIConfig.endpoints.imageTo3D, payload);
        console.log('Image-to-3D response:', response.data);

        // Get the task details immediately
        const taskResponse = await meshyAxiosInstance.get(meshyAPIConfig.endpoints.textGenerated3D(response.data.result));

        return NextResponse.json(taskResponse.data);

    } catch (error) {
        console.error('Image-to-3D API error:', error);

        if (error instanceof Error) {
            return NextResponse.json(
                { error: `Failed to generate 3D model from image: ${error.message}` },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to generate 3D model from image' },
            { status: 500 }
        );
    }
}