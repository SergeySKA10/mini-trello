'use client';

import { useBoards } from '@/hooks/useBoard';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { BoardSkeleton } from './BoardSkeleton';

export function Board({ boardId }: { boardId: string }) {
    const { data: boards, isLoading, isError, error, refetch } = useBoards();

    if (isLoading) {
        return <BoardSkeleton />;
    }

    if (isError) {
        return (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800">
                    Ошибка загрузки
                </h3>
                <p className="text-yellow-600 mt-2">{error.message}</p>
                <button
                    onClick={() => refetch()}
                    className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                    Повторить попытку
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Мои доски</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {boards?.map((board) => (
                    <BoardCard key={board.id} board={board} />
                ))}
            </div>
        </div>
    );
}

// Обертка с Error Boundary
export function BoardWithErrorBoundary({ boardId }: { boardId: string }) {
    return (
        <ErrorBoundary
            fallback={
                <div className="p-6 text-center">
                    <h2 className="text-xl font-semibold text-red-600">
                        Не удалось загрузить доску
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Пожалуйста, обновите страницу или попробуйте позже
                    </p>
                </div>
            }
        >
            <Board boardId={boardId} />
        </ErrorBoundary>
    );
}
