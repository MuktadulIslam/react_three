'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface MeshyContextType {
}

const MeshyContext = createContext<MeshyContextType | undefined>(undefined);

interface MeshyProviderProps {
    children: ReactNode;
}

export function MeshyProvider({ children }: MeshyProviderProps) {

    const contextValue: MeshyContextType = {

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