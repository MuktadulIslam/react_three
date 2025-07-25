import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const url = searchParams.get('url');
        if (!url) {
            return NextResponse.json(
                { error: 'URL parameter is required' },
                { status: 400 }
            );
        }
        if (!url.startsWith('https://assets.meshy.ai/')) {
            return NextResponse.json(
                { error: 'Invalid URL domain' },
                { status: 400 }
            );
        }

        // Fetch the model file from Meshy
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch model: ${response.status}`);
        }

        // Get the file data
        const fileData = await response.arrayBuffer();

        console.log("FileDate: ", fileData)

        // Return the file with proper CORS headers
        return new NextResponse(fileData, {
            status: 200,
            headers: {
                'Content-Type': 'model/gltf-binary',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
            },
        });

    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to proxy model' },
            { status: 500 }
        );
    }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}