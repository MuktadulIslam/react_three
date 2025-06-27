'use client';
import React, { useState } from 'react';

// TypeScript interfaces
interface SketchfabArchiveFormat {
    url: string;
    size: number;
    expires: number;
}

interface SketchfabDownloadResponse {
    gltf?: SketchfabArchiveFormat;
    usdz?: SketchfabArchiveFormat;
}

interface BackendProxyResponse {
    success: boolean;
    data?: SketchfabDownloadResponse;
    error?: string;
}

interface SketchfabDownloaderProps {
    backendProxyUrl?: string;
}

const SketchfabDownloader: React.FC<SketchfabDownloaderProps> = ({
    backendProxyUrl = '/api/sketchfab-proxy'
}) => {
    const [modelUid, setModelUid] = useState<string>('');
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [downloadInfo, setDownloadInfo] = useState<SketchfabDownloadResponse | null>(null);
    const [showBackendInstructions, setShowBackendInstructions] = useState<boolean>(false);

    const downloadViaBackend = async (): Promise<void> => {
        if (!modelUid.trim()) {
            setError('Please enter a valid model UID');
            return;
        }

        setIsDownloading(true);
        setError('');
        setDownloadInfo(null);

        try {
            // Call your backend proxy endpoint
            const response: Response = await fetch(backendProxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    modelUid: modelUid.trim(),
                    format: 'gltf'
                })
            });

            if (!response.ok) {
                throw new Error(`Backend proxy error: ${response.status} ${response.statusText}`);
            }

            const result: BackendProxyResponse = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Backend proxy failed');
            }

            if (!result.data?.gltf) {
                throw new Error('GLTF format not available for this model');
            }

            setDownloadInfo(result.data);

            // Download the ZIP archive from the authenticated URL
            const archiveResponse: Response = await fetch(result.data.gltf.url);
            if (!archiveResponse.ok) {
                throw new Error('Failed to download model archive');
            }

            const blob: Blob = await archiveResponse.blob();

            // Create download link for the ZIP file
            const url: string = window.URL.createObjectURL(blob);
            const link: HTMLAnchorElement = document.createElement('a');
            link.href = url;
            link.download = `${modelUid}_gltf_archive.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (err: unknown) {
            const errorMessage: string = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            console.error('Download error:', err);
        } finally {
            setIsDownloading(false);
        }
    };

    // Fallback method: Open Sketchfab download page
    const openSketchfabDownloadPage = (): void => {
        if (!modelUid.trim()) {
            setError('Please enter a valid model UID');
            return;
        }

        const sketchfabUrl = `https://sketchfab.com/3d-models/${modelUid}`;
        window.open(sketchfabUrl, '_blank');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setModelUid(e.target.value);
        setError('');
        setDownloadInfo(null);
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Sketchfab GLB Downloader
            </h2>

            <div className="space-y-4">
                <div>
                    <label htmlFor="modelUid" className="block text-sm font-medium text-gray-700 mb-2">
                        Model UID
                    </label>
                    <input
                        type="text"
                        id="modelUid"
                        value={modelUid}
                        onChange={handleInputChange}
                        placeholder="e.g., 49d97ca2fbf34f85b6c88ae8ebc7514f"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isDownloading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Find the UID in the Sketchfab URL: sketchfab.com/3d-models/model-name-<strong>UID</strong>
                    </p>
                </div>

                {downloadInfo && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
                        <p><strong>Download Available:</strong></p>
                        {downloadInfo.gltf && (
                            <p>GLTF: {(downloadInfo.gltf.size / 1024 / 1024).toFixed(2)} MB</p>
                        )}
                        {downloadInfo.usdz && (
                            <p>USDZ: {(downloadInfo.usdz.size / 1024 / 1024).toFixed(2)} MB</p>
                        )}
                        <p className="text-xs text-gray-600 mt-1">
                            Archive expires in {downloadInfo.gltf?.expires || downloadInfo.usdz?.expires} seconds
                        </p>
                    </div>
                )}

                {error && (
                    <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                        <strong>Error:</strong> {error}
                        {error.includes('Backend proxy error') && (
                            <div className="mt-2">
                                <button
                                    onClick={() => setShowBackendInstructions(!showBackendInstructions)}
                                    className="text-blue-600 underline text-xs"
                                >
                                    Show backend setup instructions
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-2">
                    <button
                        onClick={downloadViaBackend}
                        disabled={isDownloading || !modelUid.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                        type="button"
                    >
                        {isDownloading ? 'Downloading...' : 'Download via Backend Proxy'}
                    </button>

                    <button
                        onClick={openSketchfabDownloadPage}
                        disabled={!modelUid.trim()}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                        type="button"
                    >
                        Open in Sketchfab (Manual Download)
                    </button>
                </div>

                {showBackendInstructions && (
                    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md text-sm">
                        <h3 className="font-semibold mb-2">Backend Proxy Setup Required</h3>
                        <p className="mb-2">Due to CORS restrictions, you need a backend proxy. Create an API endpoint:</p>

                        <div className="bg-gray-800 text-green-400 p-3 rounded text-xs font-mono mb-2">
                            <div>// /pages/api/sketchfab-proxy.ts (Next.js)</div>
                            <div>export default async function handler(req, res) {'{'}</div>
                            <div>  const {'{ modelUid, format }'} = req.body;</div>
                            <div>  const response = await fetch(</div>
                            <div>    `https://api.sketchfab.com/v3/models/${'${modelUid}'}/download`,</div>
                            <div>    {'{'}</div>
                            <div>      headers: {'{'}</div>
                            <div>        'Authorization': 'Bearer YOUR_OAUTH_TOKEN'</div>
                            <div>      {'}'}</div>
                            <div>    {'}'}</div>
                            <div>  );</div>
                            <div>  const data = await response.json();</div>
                            <div>  res.json({'{ success: true, data }'});</div>
                            <div>{'}'}</div>
                        </div>

                        <p className="text-xs text-gray-600">
                            Replace YOUR_OAUTH_TOKEN with your actual Sketchfab OAuth token from your developer settings.
                        </p>
                    </div>
                )}

                <div className="text-xs text-gray-600 space-y-2 border-t pt-3">
                    <div>
                        <p><strong>Why Backend Proxy is Required:</strong></p>
                        <ul className="list-disc list-inside ml-2 space-y-1">
                            <li>Sketchfab API has CORS restrictions preventing direct browser calls</li>
                            <li>OAuth tokens shouldn't be exposed in frontend code</li>
                            <li>Backend proxy handles authentication securely</li>
                        </ul>
                    </div>
                    <div>
                        <p><strong>Alternative Solutions:</strong></p>
                        <ul className="list-disc list-inside ml-2 space-y-1">
                            <li>Use the "Open in Sketchfab" button for manual download</li>
                            <li>Set up a Chrome extension (no CORS restrictions)</li>
                            <li>Use Sketchfab's iframe embedding instead of downloading</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SketchfabDownloader;