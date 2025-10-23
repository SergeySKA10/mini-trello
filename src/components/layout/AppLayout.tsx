'use client';

import { AppModeSwitcher } from '@/components/app-mode-switcher/AppModeSwitcher';
import { useAppMode } from '@/context/AppModeContext';

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const { isRealApi } = useAppMode();

    return (
        <div className="min-h-screen bg-gray-50">
            <AppModeSwitcher />

            {/* Баннер режима */}
            {isRealApi && (
                <div className="bg-green-50 border-b border-green-200 py-2 px-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-green-800">
                                Режим реального API
                            </span>
                        </div>
                        <div className="text-xs text-green-600">
                            Работа с бекендом
                        </div>
                    </div>
                </div>
            )}

            <main>{children}</main>
        </div>
    );
}
