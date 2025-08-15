import { NextRequest, NextResponse } from 'next/server';
import { downloadAPIConfig } from '@/components/canvas/sketchfab/config/apiConfig';
import { oauth } from '@/components/canvas/sketchfab/config';

export async function GET(request: NextRequest): Promise<NextResponse> {
    // Generate a random state for security
    const state: string = Math.random().toString(36).substring(2, 15);
    const url = new URL(request.url)

    // Build authorization URL exactly like PHP implementation
    const authParams = new URLSearchParams({
        response_type: 'code',
        client_id: downloadAPIConfig.clientId,
        redirect_uri: downloadAPIConfig.redirectUri(url.origin),
        state: state
    });

    const authUrl: string = `${downloadAPIConfig.oauthBaseUrl}/authorize/?${authParams.toString()}`;

    const response: NextResponse = NextResponse.redirect(authUrl);
    response.cookies.set(oauth.state, state, {
        httpOnly: true,
        path: '/',
        maxAge: 600, // 10 minutes
        sameSite: 'lax' // Changed from 'strict' to 'lax' for OAuth compatibility
    });

    return response;
}