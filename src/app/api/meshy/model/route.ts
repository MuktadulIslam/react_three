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

        // Validate URL domain
        if (!url.startsWith('https://assets.meshy.ai/')) {
            return NextResponse.json(
                { error: 'Invalid URL domain' },
                { status: 400 }
            );
        }

        console.log('Fetching model from URL:', url);

        // Fetch the model file from Meshy with additional headers
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; MeshyProxy/1.0)',
                'Accept': '*/*',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            },
            // Add timeout and retry logic
            signal: AbortSignal.timeout(30000) // 30 second timeout
        });

        console.log('Meshy response status:', response.status);
        console.log('Meshy response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            // Log the error response body for debugging
            const errorText = await response.text();
            console.error('Meshy fetch error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText.substring(0, 500) // First 500 chars
            });

            // Handle specific error cases
            if (response.status === 403) {
                return NextResponse.json(
                    { 
                        error: 'Access denied to model file. The URL may have expired or be invalid.',
                        details: 'The signed URL from Meshy may have expired. Please regenerate the model.'
                    },
                    { status: 403 }
                );
            } else if (response.status === 404) {
                return NextResponse.json(
                    { 
                        error: 'Model file not found',
                        details: 'The model file does not exist or has been deleted.'
                    },
                    { status: 404 }
                );
            } else {
                return NextResponse.json(
                    { 
                        error: `Failed to fetch model: ${response.status} ${response.statusText}`,
                        details: errorText
                    },
                    { status: response.status }
                );
            }
        }

        // Get the file data
        const fileData = await response.arrayBuffer();
        
        // Determine content type based on URL
        let contentType = 'application/octet-stream';
        if (url.includes('.glb')) {
            contentType = 'model/gltf-binary';
        } else if (url.includes('.fbx')) {
            contentType = 'application/octet-stream';
        } else if (url.includes('.obj')) {
            contentType = 'text/plain';
        } else if (url.includes('.usdz')) {
            contentType = 'model/vnd.usdz+zip';
        }

        console.log('Successfully fetched model:', {
            size: fileData.byteLength,
            contentType: contentType
        });

        // Return the file with proper CORS headers
        return new NextResponse(fileData, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour instead of 1 year
                'Content-Length': fileData.byteLength.toString(),
            },
        });

    } catch (error) {
        console.error('Proxy error:', error);
        
        // Handle timeout errors
        if (error instanceof Error && error.name === 'AbortError') {
            return NextResponse.json(
                { 
                    error: 'Request timeout',
                    details: 'The request to fetch the model file timed out after 30 seconds.'
                },
                { status: 408 }
            );
        }

        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Failed to proxy model',
                details: 'An unexpected error occurred while fetching the model file.'
            },
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