'use client';

import { useState, useEffect } from 'react';
import { useSmartBoard } from '@/hooks/useSmartBoards';
import { BoardSkeleton } from './BoardSkeleton';
import { BoardError } from './BoardError';
import { DndBoard } from './DndBoard';

import { BoardView } from '@/features/boards/components/BoardView/BoardView';

interface BoardMigrationWrapperProps {
    boardId: string;
}

export function BoardMigrationWrapper({ boardId }: BoardMigrationWrapperProps) {
    const [useNewComponents, setUseNewComponents] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Добавим отладку
    console.log('BoardMigrationWrapper - boardId:', boardId);

    const {
        data: board,
        isLoading,
        isError,
        error,
        refetch,
    } = useSmartBoard(boardId);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Отладочная информация
    console.log('Board data:', { board, isLoading, isError, boardId });

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
                <div className="mt-4 text-sm text-gray-600">
                    <p>Board ID: {boardId || 'undefined'}</p>
                    <p>Загружено данных: {board ? 'да' : 'нет'}</p>
                </div>
            </div>
        );
    }

    // Ждем монтирования чтобы избежать hydration mismatch
    if (!mounted) {
        return <BoardSkeleton />;
    }

    return (
        <div className="relative min-h-screen">
            <div className="fixed top-4 right-4 z-50 bg-white p-3 rounded-lg shadow-lg border">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={useNewComponents}
                        onChange={(e) => setUseNewComponents(e.target.checked)}
                        className="cursor-pointer w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">
                        {useNewComponents
                            ? 'Новые компоненты'
                            : 'Старые компоненты'}
                    </span>
                </label>
                <div className="mt-1 text-xs text-gray-500 max-w-[150px]">
                    {useNewComponents
                        ? 'Tanstack Query + API'
                        : 'Redux + Mock данные'}
                </div>
            </div>

            {useNewComponents ? (
                // Новые компоненты с Tanstack Query
                <div className="h-full flex flex-col pt-16">
                    {' '}
                    {/* Добавим отступ сверху */}
                    <header className="bg-white border-b px-6 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {board.title}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {board.description}
                        </p>
                        <div className="mt-2 text-sm text-green-600">
                            Новые компоненты (API)
                        </div>
                    </header>
                    <div className="flex-1 overflow-hidden">
                        <DndBoard boardId={boardId} />
                    </div>
                </div>
            ) : (
                // Старые компоненты с Redux
                <div className="pt-16">
                    {' '}
                    {/* Добавим отступ сверху */}
                    <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-2">
                        <div className="text-sm text-yellow-800">
                            Старые компоненты (Mock данные)
                        </div>
                    </div>
                    <BoardView />
                </div>
            )}
        </div>
    );
}
