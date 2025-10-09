'use client';

import { useState } from 'react';
import { DndBoard } from '@/components/board/DndBoard';
import Link from 'next/link';

export default function TestBoardPage() {
    const [boardId, setBoardId] = useState('1'); // Используем ID который может существовать

    return (
        <div className="p-6">
            <div className="mb-4">
                <Link
                    href="/"
                    className="text-blue-500 hover:text-blue-700 mb-4 inline-block"
                >
                    ← На главную
                </Link>
            </div>

            <h1 className="text-2xl font-bold mb-4">
                Тестовая страница новых компонентов
            </h1>

            <div className="mb-6 p-4 bg-gray-100 rounded">
                <label className="block text-sm font-medium mb-2">
                    Board ID для тестирования:
                </label>
                <input
                    type="text"
                    value={boardId}
                    onChange={(e) => setBoardId(e.target.value)}
                    className="border p-2 rounded w-full max-w-xs"
                    placeholder="Введите boardId (например: 1)"
                />
                <p className="text-sm text-gray-600 mt-1">
                    Попробуйте ID: 1, 2, 3 или любой другой
                </p>
            </div>

            <div className="border rounded-lg p-4 bg-white">
                <DndBoard boardId={boardId} />
            </div>
        </div>
    );
}
