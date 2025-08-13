import { useCallback } from 'react';
import { Object3D } from 'three';

interface CachedModel {
    scene: Object3D;
    lastAccessed: number;
}
const globalModelCache = new Map<string, CachedModel>();

export const useModelCache = () => {
    const getCachedModel = useCallback((url: string): CachedModel | null => {
        const cached = globalModelCache.get(url);
        if (cached) {
            cached.lastAccessed = Date.now();
            return cached;
        }
        return null;
    }, []);

    const setCachedModel = useCallback((url: string, scene: Object3D) => {
        // Clone the scene to avoid sharing between different components
        const clonedScene = scene.clone();

        globalModelCache.set(url, {
            scene: clonedScene,
            lastAccessed: Date.now()
        });
    }, []);

    const isCached = useCallback((url: string): boolean => {
        return globalModelCache.has(url);
    }, []);

    const clearCache = useCallback(() => {
        globalModelCache.clear();
    }, []);

    const getCacheSize = useCallback((): number => {
        return globalModelCache.size;
    }, []);

    return {
        getCachedModel,
        setCachedModel,
        isCached,
        clearCache,
        getCacheSize
    };
};