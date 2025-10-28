'use client';

import { useAppMode } from '@/context/AppModeContext';
import {
    useBoards as useRealBoards,
    useBoard as useRealBoard,
    useCreateBoard as useRealCreateBoard,
    useUpdateBoard as useRealUpdateBoard,
    useDeleteBoard as useRealDeleteBoard,
} from './useBoard';
import { useColumns as useRealColumns } from './useColumns';
import { useAppSelector, useAppDispatch } from '@/stores/hooks/hooks';
import {
    addBoard,
    updateBoard,
    deleteBoard,
    setCurrentBoard,
} from '@/stores/slices/board-slice';
import type { IBoard } from '@/types/board';

// Умное получение всех досок
export const useSmartBoards = () => {
    const { isDemo } = useAppMode();
    const { boards } = useAppSelector((state) => state.board); // Теперь берем из boards
    const realBoards = useRealBoards();

    if (isDemo) {
        return {
            data: boards, // Возвращаем все доски из Redux
            isLoading: false,
            isError: false,
            error: null,
            refetch: () => {},
        };
    }

    return realBoards;
};

// Умное получение конкретной доски
export const useSmartBoard = (boardId: string) => {
    const { isDemo } = useAppMode();
    const { currentBoard } = useAppSelector((state) => state.board);
    const board = useRealBoard(boardId);

    if (isDemo) {
        // Проверяем, запрашиваем ли мы текущую демо-доску
        const isDemoBoard =
            !boardId || boardId === 'demo' || boardId === currentBoard?.id;

        return {
            data: isDemoBoard ? currentBoard : null,
            isLoading: false,
            isError: false,
            error: null,
            refetch: () => {},
        };
    }

    return board;
};

// Умное получение колонок
export const useSmartColumns = (boardId: string) => {
    const { isDemo } = useAppMode();
    const { currentBoard } = useAppSelector((state) => state.board);
    const columns = useRealColumns(boardId);

    if (isDemo) {
        // Проверяем, запрашиваем ли мы текущую демо-доску
        const isDemoBoard =
            !boardId || boardId === 'demo' || boardId === currentBoard?.id;

        return {
            data: isDemoBoard ? currentBoard?.columns || [] : [],
            isLoading: false,
            isError: false,
            error: null,
            refetch: () => {},
        };
    }

    return columns;
};

// Умное создание доски
export const useSmartCreateBoard = () => {
    const { isDemo } = useAppMode();
    const dispatch = useAppDispatch();
    const realCreateBoard = useRealCreateBoard();

    if (isDemo) {
        return {
            mutateAsync: async (newBoard: Omit<IBoard, 'id' | 'columns'>) => {
                // В демо-режиме используем Redux
                const demoBoard: IBoard = {
                    ...newBoard,
                    id: `demo-board-${Date.now()}`,
                    columns: [],
                    userId: 'demo-user',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                dispatch(addBoard(demoBoard));

                // Возвращаем промис для совместимости
                return Promise.resolve(demoBoard);
            },
            isPending: false,
            isError: false,
            error: null,
        };
    }

    // В реальном режиме используем API
    return realCreateBoard;
};

// Умное обновление доски
export const useSmartUpdateBoard = () => {
    const { isDemo } = useAppMode();
    const dispatch = useAppDispatch();
    const realUpdateBoard = useRealUpdateBoard();

    if (isDemo) {
        return {
            mutateAsync: async ({
                id,
                ...updates
            }: Partial<IBoard> & { id: string }) => {
                dispatch(
                    updateBoard({
                        boardId: id,
                        updates,
                    })
                );

                return Promise.resolve({
                    id,
                    ...updates,
                    updatedAt: new Date().toISOString(),
                } as IBoard);
            },
            isPending: false,
            isError: false,
            error: null,
        };
    }

    return realUpdateBoard;
};

// Умное удаление доски
export const useSmartDeleteBoard = () => {
    const { isDemo } = useAppMode();
    const dispatch = useAppDispatch();
    const realDeleteBoard = useRealDeleteBoard();

    if (isDemo) {
        return {
            mutateAsync: async (boardId: string) => {
                dispatch(deleteBoard({ boardId }));
                return Promise.resolve();
            },
            isPending: false,
            isError: false,
            error: null,
        };
    }

    return realDeleteBoard;
};

// Умная установка текущей доски
export const useSmartSetCurrentBoard = () => {
    const { isDemo } = useAppMode();
    const dispatch = useAppDispatch();

    if (isDemo) {
        return {
            mutateAsync: async (board: IBoard) => {
                dispatch(setCurrentBoard(board));
                return Promise.resolve();
            },
            isPending: false,
            isError: false,
            error: null,
        };
    }

    // В реальном режиме это не нужно, так как данные загружаются из API
    return {
        mutateAsync: async (board: IBoard) => Promise.resolve(),
        isPending: false,
        isError: false,
        error: null,
    };
};
