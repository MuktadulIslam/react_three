// Create this file at: app/api/sketchfab-proxy/route.ts
// (For Next.js 13+ App Router)

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { modelUid } = await request.json();

        if (!modelUid) {
            return NextResponse.json(
                { success: false, error: 'Model UID is required' },
                { status: 400 }
            );
        }

        // Replace with your actual Sketchfab OAuth token
        const SKETCHFAB_OAUTH_TOKEN = 'ef0e21b4cd3e4356b16ebd1e3236c83d';

        // Call Sketchfab API
        const response = await fetch(`https://api.sketchfab.com/v3/models/${modelUid}/download`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${SKETCHFAB_OAUTH_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json(
                    { success: false, error: 'Model not found' },
                    { status: 404 }
                );
            } else if (response.status === 401) {
                return NextResponse.json(
                    { success: false, error: 'Invalid OAuth token' },
                    { status: 401 }
                );
            } else if (response.status === 403) {
                return NextResponse.json(
                    { success: false, error: 'Model not downloadable or access forbidden' },
                    { status: 403 }
                );
            }
            return NextResponse.json(
                { success: false, error: `Sketchfab API error: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error('Sketchfab proxy error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Handle other HTTP methods
export async function GET() {
    return NextResponse.json(
        { error: 'Use POST method' },
        { status: 405 }
    );
}