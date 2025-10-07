'use client';

import { useBoard } from '@/hooks/useBoard';
import { BoardSkeleton } from './BoardSkeleton';
import { BoardError } from './BoardError';
import { DnDBoard } from './DndBoard';

interface BoardContainerProps {
    boardId: string;
}

export function BoardContainer({ boardId }: BoardContainerProps) {
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
        <div className="h-full flex flex-col">
            <header className="bg-white border-b px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-900">
                    {board.title}
                </h1>
                <p className="text-gray-600 mt-1">{board.description}</p>
            </header>

            <div className="flex-1 overflow-hidden">
                <DnDBoard boardId={boardId} />
            </div>
        </div>
    );
}
