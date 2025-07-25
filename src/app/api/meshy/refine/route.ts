import { NextRequest, NextResponse } from 'next/server';
import { meshyAPIConfig } from '@/components/canvas/meshy/config';
import meshyAxiosInstance from '../axios-config';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const payload = {
            texture_prompt: body.texture_prompt,
            texture_image_url: body.image,  //Data URI: A base64-encoded data URI of the image. Example of a data URI: data:image/jpeg;base64,<your base64-encoded image data>
            mode: 'refine',
            moderation: true,
            ai_model: meshyAPIConfig.aimodel,
        };

        const response = await meshyAxiosInstance.post(meshyAPIConfig.endpoints.textTo3D, payload);
        const object = await meshyAxiosInstance.get(meshyAPIConfig.endpoints.textGenerated3D(response.data.result));
        return NextResponse.json(object.data);

    } catch (error) {
        console.error('Text-to-3D API error:', error);
        return NextResponse.json(
            { error: 'Failed to generate 3D model from text' },
            { status: 500 }
        );
    }
}