// src/app/api/meshy/image-to-3d/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { meshyAPIConfig } from '@/components/canvas/meshy/config';
import meshyAxiosInstance from '../axios-config';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Handle both single image and multiple images
        const imageData = body.image_data;
        if (!imageData) {
            return NextResponse.json({ error: 'image_data is required' },{ status: 400 });
        }
        // Validate image data format
        const images = Array.isArray(imageData) ? imageData : [imageData];


        // Check image count limit
        if (images.length > 4) {
            return NextResponse.json({ error: 'Maximum 4 images allowed' },{ status: 400 });
        }

        const enhancedPrompt = body.texture_prompt ?
                `${body.texture_prompt} (Generat 3D model from ${images.length > 1 ? 'these' : 'this'} reference ${images.length > 1 ? 'images' : 'image'})` :
                `3D model generat from ${images.length} reference ${images.length > 1 ? 'images' : 'image'}`;

        const payload = {
            image_url: images,
            ai_model: images.length > 1 ? 'meshy-5' : (body.model_version || meshyAPIConfig.aimodel),
            texture_prompt: enhancedPrompt,
            symmetry_mode: body.symmetry || 'auto',
            should_remesh: true,
            should_texture: true,
            enable_pbr: true,
        };

        console.log("payload for image to 3D= ", payload);
        
        
        
        const response = await meshyAxiosInstance.post(meshyAPIConfig.endpoints.imageTo3D, payload);
        const taskId = response.data.result;
        console.log("response for image to 3D= ", response);

        if (!taskId) {
            throw new Error('No task ID received from Meshy API');
        }

        // Poll for completion
        let attempts = 0;
        const maxAttempts = 5; // Standard attempts regardless of image count
        const pollInterval = 5000; // Standard 5 second interval

        console.log(`Starting polling for task ${taskId} (${images.length} images processed)`);

        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, pollInterval));
            attempts++;

            try {
                const statusResponse = await meshyAxiosInstance.get(meshyAPIConfig.endpoints.imageGenerated3D(taskId));
                const status = statusResponse.data.status;

                console.log(`Attempt ${attempts}/${maxAttempts}: Task ${taskId} status: ${status}`);

                if (status === 'SUCCEEDED') {
                    console.log('Image-to-3D generation completed successfully');
                    return NextResponse.json(statusResponse.data);
                } else if (status === 'FAILED') {
                    const errorMessage = statusResponse.data.task_error?.message || 'Generation failed';
                    console.error('Generation failed:', errorMessage);
                    throw new Error(`Generation failed: ${errorMessage}`);
                }
                // Continue polling for PENDING or IN_PROGRESS status
            } catch (pollError) {
                console.error(`Polling attempt ${attempts} failed:`, pollError);
                if (attempts === maxAttempts) {
                    throw pollError;
                }
                // Continue polling on error unless it's the last attempt
            }
        }

        // If we reach here, polling timed out
        console.error('Polling timed out for task:', taskId);
        return NextResponse.json(
            {
                error: 'Image-to-3D generation timed out',
                details: `Task ${taskId} did not complete within ${maxAttempts * pollInterval / 1000} seconds. Processing ${images.length} image(s).`,
                taskId: taskId
            },
            { status: 408 }
        );

    } catch (error) {
        console.error('Image-to-3D API error:', error);

        if (error instanceof Error) {
            return NextResponse.json(
                {
                    error: 'Failed to generate 3D model from image(s)',
                    details: error.message
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to generate 3D model from image(s)' },
            { status: 500 }
        );
    }
}