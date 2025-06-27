"use client";

import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Download, Heart, Eye, X, Play } from 'lucide-react';
import { SketchfabModel, SketchfabResponse } from './types';
import ModelCard from './ModelCard';
import ModelViewer from './ModelViewer';

const SketchfabSearch: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [models, setModels] = useState<SketchfabModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const [selectedModel, setSelectedModel] = useState<SketchfabModel | null>(null);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [currentQuery, setCurrentQuery] = useState<string>('');

    const searchModels = async (query: string, isLoadMore: boolean = false) => {
        if (!query.trim()) return;

        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
            setError('');
            setHasSearched(true);
            setModels([]);
            setNextUrl(null);
            setCurrentQuery(query);
        }

        try {
            let searchUrl;

            if (isLoadMore && nextUrl) {
                // Use the next URL from Sketchfab's pagination
                searchUrl = nextUrl;
            } else {
                // Initial search
                searchUrl = `https://api.sketchfab.com/v3/search?type=models&q=${encodeURIComponent(query)}&downloadable=true&count=20&sort_by=-likeCount`;
            }

            console.log('Fetching:', searchUrl); // Debug log

            const response = await fetch(searchUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: SketchfabResponse = await response.json();
            console.log(data);

            console.log('API Response:', data); // Debug log

            // Additional filtering to ensure only free and downloadable models
            const freeDownloadableModels = data.results.filter(model =>
                model.isDownloadable
            );

            if (isLoadMore) {
                setModels(prevModels => [...prevModels, ...freeDownloadableModels]);
            } else {
                setModels(freeDownloadableModels);
            }

            // Set the next URL for pagination
            setNextUrl(data.next);

            console.log('Next URL:', data.next); // Debug log
            console.log('Models loaded:', freeDownloadableModels.length); // Debug log

        } catch (err) {
            setError('Failed to fetch downloadable models from Sketchfab. Please try again.');
            console.error('Search error:', err);
        } finally {
            if (isLoadMore) {
                setLoadingMore(false);
            } else {
                setLoading(false);
            }
        }
    };

    const handleDownloadModel = async (model: SketchfabModel) => {
        // Option 1: Direct redirect to Sketchfab model page
        // This is the most reliable method
        const sketchfabModelUrl = `https://sketchfab.com/3d-models/${model.name.replace(/\s+/g, '-').toLowerCase()}-${model.uid}#download`;
        window.open(sketchfabModelUrl, '_blank');

        // Option 2: Try to construct download URL (less reliable)
        // Uncomment if you want to try direct download approach
        /*
        try {
            // Show loading state
            console.log('Attempting to download model:', model.name);
            
            // Construct the potential download URL
            // Note: This may not work without proper authentication
            const downloadUrl = `https://sketchfab.com/models/${model.uid}/download`;
            
            // Try to trigger download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${model.name.replace(/[^a-zA-Z0-9]/g, '_')}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Fallback to opening the model page if download fails
            setTimeout(() => {
                window.open(sketchfabModelUrl, '_blank');
            }, 2000);
            
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback to opening the model page
            window.open(sketchfabModelUrl, '_blank');
        }
        */
    };

    // Alternative: More user-friendly approach with confirmation
    const handleDownloadModelWithConfirmation = async (model: SketchfabModel) => {
        const confirmed = window.confirm(
            `This will open the Sketchfab page for "${model.name}" where you can download the model. You may need to sign in to Sketchfab. Continue?`
        );

        if (confirmed) {
            const sketchfabModelUrl = `https://sketchfab.com/3d-models/${model.name.replace(/\s+/g, '-').toLowerCase()}-${model.uid}`;
            window.open(sketchfabModelUrl, '_blank');
        }
    };

    // Enhanced version with analytics tracking (optional)
    const handleDownloadModelEnhanced = async (model: SketchfabModel) => {
        try {
            // Optional: Track download attempts
            console.log('Download initiated for model:', {
                uid: model.uid,
                name: model.name,
                user: model.user.displayName
            });

            // Show a brief loading/redirect message
            const notification = document.createElement('div');
            notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                font-family: system-ui, sans-serif;
            ">
                🚀 Redirecting to Sketchfab download page...
            </div>
        `;
            document.body.appendChild(notification);

            // Remove notification after 3 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);

            // Redirect to Sketchfab model page
            const sketchfabModelUrl = `https://sketchfab.com/3d-models/${model.name.replace(/\s+/g, '-').toLowerCase()}-${model.uid}`;
            window.open(sketchfabModelUrl, '_blank');

        } catch (error) {
            console.error('Error in download process:', error);
            alert('There was an error redirecting to the download page. Please try again.');
        }
    };

    const closeViewer = () => {
        setSelectedModel(null);
    };

    const handleSearch = (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault();
        searchModels(searchQuery, false);
    };

    const handleLoadMore = () => {
        console.log('Load more clicked, nextUrl:', nextUrl, 'currentQuery:', currentQuery); // Debug log
        if (nextUrl && currentQuery && !loadingMore) {
            searchModels(currentQuery, true);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-7">
                    <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Explore & Download 3D Models
                    </h1>
                    <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                        Discover amazing free and downloadable 3D models from Sketchfab's vast collection
                    </p>
                    <div className="mt-2 inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-1 rounded-full text-sm">
                        💡 Tip: You may need a free Sketchfab account to download models
                    </div>
                </div>

                {/* Search Form */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                            placeholder="Search for free downloadable 3D models..."
                            className="w-full px-6 py-2 text-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading || !searchQuery.trim()}
                            className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                        >
                            <Search size={20} />
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-center">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                        <p className="text-gray-300 mt-4">Searching for models...</p>
                    </div>
                )}

                {/* Results */}
                {hasSearched && !loading && models.length === 0 && !error && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-xl">No free downloadable models found for "{searchQuery}"</p>
                        <p className="text-gray-500 mt-2">Try a different search term or check if there are downloadable models available</p>
                    </div>
                )}

                {models.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {models.map((model) => (
                                <ModelCard
                                    key={model.uid}
                                    model={model}
                                    setSelectedModel={setSelectedModel}
                                    handleDownloadModel={handleDownloadModel}
                                />
                            ))}
                        </div>

                        {/* Show More Button */}
                        {nextUrl && !loading && !loadingMore && (
                            <div className="text-center mt-12">
                                <button
                                    onClick={handleLoadMore}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium text-lg transition-all duration-300 flex items-center gap-2 mx-auto"
                                >
                                    <Download size={20} />
                                    Show More Models
                                </button>
                                <p className="text-gray-400 text-sm mt-2">
                                    Showing {models.length} models
                                </p>
                            </div>
                        )}

                        {/* Loading More State */}
                        {loadingMore && (
                            <div className="text-center mt-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                                <p className="text-gray-300 mt-2">Loading more models...</p>
                            </div>
                        )}

                        {/* End of Results */}
                        {!nextUrl && models.length > 0 && !loading && !loadingMore && (
                            <div className="text-center mt-12">
                                <p className="text-gray-400">
                                    All models loaded ({models.length} total)
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* 3D Model Viewer Modal */}
                {selectedModel != null && (
                    <ModelViewer
                        model={selectedModel}
                        handleDownloadModel={handleDownloadModel}
                        closeViewer={closeViewer}
                    />
                )}
            </div>
        </div>
    );
};

export default SketchfabSearch;