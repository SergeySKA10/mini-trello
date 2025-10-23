'use client';

import { BoardView } from '@/features/boards/components/BoardView/BoardView';
import { AppLayout } from '@/components/layout/AppLayout';
import Link from 'next/link';
import { useAppMode } from '@/context/AppModeContext';

export default function Home() {
    const { isRealApi } = useAppMode();

    return (
        <AppLayout>
            <div className="p-6 max-w-7xl mx-auto">
                {/* Информационная панель */}
                <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🎯 Mini Trello
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Гибридное приложение для управления задачами
                    </p>

                    <div className="flex gap-4 flex-wrap">
                        <Link
                            href="/test-board"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            🧪 Тестовая страница
                        </Link>
                        <Link
                            href="/boards/1"
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            📋 Реальная доска
                        </Link>
                        {isRealApi && (
                            <Link
                                href="/login"
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                🔐 Войти в систему
                            </Link>
                        )}
                    </div>
                </div>

                {/* Демо-доска */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {isRealApi ? 'Режим реального API' : 'Демо-режим'}
                        </h2>
                        <span
                            className={`px-2 py-1 text-xs rounded-full ${
                                isRealApi
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                            }`}
                        >
                            {isRealApi ? '🌐 Реальный API' : '🎮 Демо'}
                        </span>
                    </div>

                    <BoardView />
                </div>
            </div>
        </AppLayout>
    );
}
