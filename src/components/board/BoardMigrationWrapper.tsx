'use client';

import { useState } from 'react';
import { useBoard } from '@/hooks/useBoard';
import { BoardSkeleton } from './BoardSkeleton';
import { BoardError } from './BoardError';
import { DndBoard } from './DndBoard';
import { BoardView } from '@/features/boards/components/BoardView/BoardView';

interface BoardMigrationWrapperProps {
    boardId: string;
}

export function BoardMigrationWrapper({ boardId }: BoardMigrationWrapperProps) {
    const [useNewComponents, setUseNewComponents] = useState(false);

    const {
        data: board,
        isLoading,
        isError,
        error,
        refetch,
    } = useBoard(boardId);

    if (isLoading) {
        return <BoardSkeleton />;
    }

    if (isError) {
        return <BoardError error={error} onRetry={refetch} />;
    }

    if (!board) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Доска не найдена</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Переключатель для тестирования */}
            <div className="absolute top-4 right-4 z-10">
                <label className="flex items-center gap-2 bg-white p-2 rounded shadow">
                    <input
                        type="checkbox"
                        checked={useNewComponents}
                        onChange={(e) => setUseNewComponents(e.target.checked)}
                    />
                    <span className="text-sm">
                        Использовать новые компоненты
                    </span>
                </label>
            </div>

            {useNewComponents ? (
                // Новые компоненты с Tanstack Query
                <div className="h-full flex flex-col">
                    <header className="bg-white border-b px-6 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {board.title}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {board.description}
                        </p>
                        <div className="mt-2 text-sm text-green-600">
                            Используются новые компоненты с реальным API
                        </div>
                    </header>
                    <div className="flex-1 overflow-hidden">
                        <DndBoard boardId={boardId} />
                    </div>
                </div>
            ) : (
                // Старые компоненты с Redux
                <>
                    <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-2">
                        <div className="text-sm text-yellow-800">
                            Используются старые компоненты с mock данными
                        </div>
                    </div>
                    <BoardView />
                </>
            )}
        </div>
    );
}
