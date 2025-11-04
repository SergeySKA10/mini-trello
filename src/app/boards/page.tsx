'use client';

import { useState } from 'react';
import {
    useSmartBoards,
    useSmartCreateBoard,
    useSmartDeleteBoard,
} from '@/hooks/useSmartBoards';
import { useAppMode } from '@/context/AppModeContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { useToast } from '@/components/ui/Toast/Toast';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Plus, Trash2, LogOut } from 'lucide-react';
import type { IBoard } from '@/types/board';

export default function BoardsPage() {
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const { data: boards, isLoading, error } = useSmartBoards();
    const createBoardMutation = useSmartCreateBoard();
    const deleteBoardMutation = useSmartDeleteBoard();
    const { isRealApi } = useAppMode();
    const toast = useToast();
    const { logout, getCurrentUser } = useAuth();

    const user = getCurrentUser();

    const handleCreateBoard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBoardTitle.trim()) return;

        try {
            await createBoardMutation.mutateAsync({
                title: newBoardTitle.trim(),
                description: '',
                columns: [],
                userId: '',
            });

            setNewBoardTitle('');
            setIsCreating(false);
            toast.success('Доска создана!');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Ошибка создания доски: ${error.message}`);
            } else {
                toast.error(`Ошибка создания доски`);
            }
        }
    };

    const handleDeleteBoard = async (boardId: string, boardTitle: string) => {
        if (confirm(`Удалить доску "${boardTitle}"?`)) {
            try {
                await deleteBoardMutation.mutateAsync(boardId);
                toast.success('Доска удалена');
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(`Ошибка удаления доски: ${error.message}`);
                } else {
                    toast.error(`Ошибка удаления доски`);
                }
            }
        }
    };

    if (isLoading) {
        return (
            <AppLayout>
                <div className="p-6">
                    <div className="animate-pulse">Загрузка досок...</div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="p-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Мои доски
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {isRealApi
                                ? `Режим реального API - ${user?.email}`
                                : 'Демо-режим'}
                        </p>
                    </div>

                    {isRealApi && (
                        <button
                            onClick={logout}
                            className="cursor-pointer flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
                        >
                            <LogOut className="w-4 h-4" />
                            Выйти
                        </button>
                    )}
                </div>

                {/* Create Board Form */}
                <div className="mb-8">
                    {isCreating ? (
                        <form
                            onSubmit={handleCreateBoard}
                            className="bg-white p-4 rounded-lg border"
                        >
                            <input
                                type="text"
                                value={newBoardTitle}
                                onChange={(e) =>
                                    setNewBoardTitle(e.target.value)
                                }
                                placeholder="Название доски"
                                className="w-full p-2 border rounded mb-2"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={createBoardMutation.isPending}
                                    className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {createBoardMutation.isPending
                                        ? 'Создание...'
                                        : 'Создать'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Отмена
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="cursor-pointer flex items-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600"
                        >
                            <Plus className="w-5 h-5" />
                            Создать доску
                        </button>
                    )}
                </div>

                {/* Boards Grid */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">
                            Ошибка загрузки досок: {error.message}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {boards?.map((board: IBoard) => (
                        <div
                            key={board.id}
                            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                        >
                            <Link href={`/boards/${board.id}`}>
                                <div className="p-6 cursor-pointer">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                                        {board.title}
                                    </h3>
                                    {board.description && (
                                        <p className="text-gray-600 text-sm mb-4">
                                            {board.description}
                                        </p>
                                    )}
                                    <div className="text-xs text-gray-500">
                                        Колонок: {board.columns?.length || 0}
                                    </div>
                                </div>
                            </Link>

                            <div className="border-t px-6 py-3 bg-gray-50 flex justify-end">
                                <button
                                    onClick={() =>
                                        handleDeleteBoard(board.id, board.title)
                                    }
                                    disabled={deleteBoardMutation.isPending}
                                    className="cursor-pointer text-red-600 hover:text-red-800 p-1 rounded disabled:opacity-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {boards?.length === 0 && !error && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📋</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Нет досок
                        </h3>
                        <p className="text-gray-600">
                            Создайте свою первую доску чтобы начать работу
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
