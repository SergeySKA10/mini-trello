'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

interface BoardErrorProps {
    error: Error | null;
    onRetry: () => void;
}

export function BoardError({ error, onRetry }: BoardErrorProps) {
    return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Не удалось загрузить доску
                </h2>
                <p className="text-gray-600 mb-2">
                    {error?.message || 'Произошла ошибка при загрузке данных'}
                </p>
                <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Попробовать снова
                </button>
            </div>
        </div>
    );
}
