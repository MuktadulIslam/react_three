// src/components/canvas/meshy/context/MeshyContext.tsx
'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface MeshyContextType {
    // This can be used for any global meshy state that's not chat-specific
}

const MeshyContext = createContext<MeshyContextType | undefined>(undefined);

interface MeshyProviderProps {
    children: ReactNode;
}

export function MeshyProvider({ children }: MeshyProviderProps) {
    const contextValue: MeshyContextType = {
        // Add any global meshy state here
    };

    return (
        <MeshyContext.Provider value={contextValue}>
            {children}
        </MeshyContext.Provider>
    );
}

export function useMeshy() {
    const context = useContext(MeshyContext);
    if (context === undefined) {
        throw new Error('useMeshy must be used within a MeshyProvider');
    }
    return context;
}