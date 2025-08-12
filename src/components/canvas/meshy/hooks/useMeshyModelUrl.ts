import { useQuery } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';

export const useMeshyModelUrl = (meshyUrl: string) => {
  // Keep track of created blob URLs to clean them up
  const blobUrlRef = useRef<string | null>(null);

  const query = useQuery({
    queryKey: ['meshy-model-url', meshyUrl],
    queryFn: async (): Promise<string> => {
      if (!meshyUrl || !meshyUrl.startsWith('https://assets.meshy.ai/')) {
        throw new Error('Invalid Meshy URL');
      }

      // Try different CORS proxies in order of preference (fastest/most reliable first)
      const proxies = [
        `https://proxy.cors.sh/${meshyUrl}`, // Fast, reliable, no rate limits
        `https://corsproxy.io/?${encodeURIComponent(meshyUrl)}`, // Fast and stable
        `https://api.allorigins.win/raw?url=${encodeURIComponent(meshyUrl)}`, // Good uptime
        `https://thingproxy.freeboard.io/fetch/${meshyUrl}`, // Reliable backup
        `https://cors-anywhere.herokuapp.com/${meshyUrl}`, // Often rate-limited, use as fallback
        `https://cors-proxy.htmldriven.com/?url=${encodeURIComponent(meshyUrl)}`, // Slower but works
      ];

      let lastError: Error | null = null;
      
      for (let i = 0; i < proxies.length; i++) {
        const proxyUrl = proxies[i];
        
        try {
          const response = await fetch(proxyUrl, {
            signal: AbortSignal.timeout(30000),
            headers: {
              'Accept': 'application/octet-stream, */*',
            }
          });

          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            const blob = new Blob([arrayBuffer]);
            
            // Clean up previous blob URL if it exists
            if (blobUrlRef.current) {
              URL.revokeObjectURL(blobUrlRef.current);
            }
            
            // Create new blob URL and store reference
            const blobUrl = URL.createObjectURL(blob);
            blobUrlRef.current = blobUrl;
            
            return blobUrl;
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
        }
      }
      
      // If all proxies failed, throw the last error
      const errorMessage = lastError 
        ? `All CORS proxies failed. Last error: ${lastError.message}`
        : 'All CORS proxies failed';
      
      throw new Error(errorMessage);
    },
    enabled: !!meshyUrl,
    // Important: Don't refetch automatically to prevent reloading
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    // Cache for a long time since models don't change
    staleTime: Infinity,
  });

  // Cleanup blob URL when component unmounts or URL changes
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [meshyUrl]);

  return query;
};