import { NextRequest, NextResponse } from 'next/server';
import { meshyAPIConfig } from '@/components/canvas/meshy/config';
import meshyAxiosInstance from '../axios-config';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const payload = {
            mode: "refine",
            preview_task_id: body.preview_task_id,
            texture_prompt: body.texture_prompt,
            texture_image_url:  body.texture_image_url[0],      // This image should be in base-64 formet & meshy model only takes 1 image for texture
            ai_model: body.model_version || meshyAPIConfig.aimodel,
            moderation: body.moderation || true
        };

        const response = await meshyAxiosInstance.post(meshyAPIConfig.endpoints.textTo3D, payload);
        
        let attempts = 0;
        const maxAttempts = 30;
        const pollInterval = 10000;
        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, pollInterval));
            attempts++;
            
            const object = await meshyAxiosInstance.get(meshyAPIConfig.endpoints.textGenerated3D(response.data.result));
            if (object.data.status === 'SUCCEEDED') {
                return NextResponse.json(object.data);
            }
        }

        return NextResponse.json(
            { error: '3D model refine failed' },
            { status: 500 }
        );
    } catch (error) {
        console.error('3D model refine API error:', error);
        return NextResponse.json(
            { error: '3D model refine failed' },
            { status: 500 }
        );
    }
}