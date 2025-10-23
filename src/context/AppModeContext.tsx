'use client';

import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
    useEffect,
} from 'react';

export type AppMode = 'demo' | 'real-api';

interface AppModeContextType {
    mode: AppMode;
    setMode: (mode: AppMode) => void;
    isDemo: boolean;
    isRealApi: boolean;
    isLoading: boolean;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

export function AppModeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<AppMode>('demo');
    const [isLoading, setIsLoading] = useState(true);

    // Загружаем сохраненный режим из localStorage при загрузке
    useEffect(() => {
        const savedMode = localStorage.getItem('app-mode') as AppMode;
        if (savedMode && (savedMode === 'demo' || savedMode === 'real-api')) {
            setMode(savedMode);
        }
        setIsLoading(false);
    }, []);

    // Сохраняем режим в localStorage при изменении
    const handleSetMode = (newMode: AppMode) => {
        setMode(newMode);
        localStorage.setItem('app-mode', newMode);
    };

    const value = {
        mode,
        setMode: handleSetMode,
        isDemo: mode === 'demo',
        isRealApi: mode === 'real-api',
        isLoading,
    };

    return (
        <AppModeContext.Provider value={value}>
            {children}
        </AppModeContext.Provider>
    );
}

export function useAppMode() {
    const context = useContext(AppModeContext);
    if (context === undefined) {
        throw new Error('useAppMode must be used within an AppModeProvider');
    }
    return context;
}
