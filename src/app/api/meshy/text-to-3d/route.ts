import { NextRequest, NextResponse } from 'next/server';
import { meshyAPIConfig } from '@/components/canvas/meshy/config';
import meshyAxiosInstance from '../axios-config';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const payload = {
            prompt: body.prompt,
            art_style: body.art_style || 'realistic',
            symmetry: body.symmetry || 'auto',
            seed: body.seed || Math.floor(Math.random() * 1000000),
            mode: 'preview',
            should_remesh: true,
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