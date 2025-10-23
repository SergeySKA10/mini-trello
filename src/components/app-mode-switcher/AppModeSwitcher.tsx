'use client';

import { useAppMode } from '@/context/AppModeContext';
import { useRouter } from 'next/navigation';

export function AppModeSwitcher() {
    const { mode, setMode, isDemo, isLoading } = useAppMode();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg border">
                <div className="animate-pulse">Загрузка...</div>
            </div>
        );
    }

    const handleModeChange = (newMode: 'demo' | 'real-api') => {
        setMode(newMode);

        // При переключении в реальный режим, проверяем аутентификацию
        if (newMode === 'real-api') {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                router.push('/login');
            }
        }
    };

    return (
        <div className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur p-4 rounded-lg shadow-lg border space-y-3">
            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                    Режим:
                </span>
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => handleModeChange('demo')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                            isDemo
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Демо
                    </button>
                    <button
                        onClick={() => handleModeChange('real-api')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                            !isDemo
                                ? 'bg-white text-green-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Реальный API
                    </button>
                </div>
            </div>

            <div className="text-xs text-gray-500 max-w-[200px] border-t pt-2">
                {isDemo ? (
                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Данные хранятся локально</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Работает без бекенда</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Требуется авторизация</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Работа с реальным API</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
