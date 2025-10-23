'use client';

import { useAppMode } from '@/context/AppModeContext';
import {
    useBoards as useRealBoards,
    useBoard as useRealBoard,
} from './useBoard';
import { useColumns as useRealColumns } from './useColumns';
import { useAppSelector } from '@/stores/hooks/hooks';

// Умное получение всех досок
export const useSmartBoards = () => {
    const { isDemo } = useAppMode();
    const { currentBoard } = useAppSelector((state) => state.board);
    const boards = useRealBoards();

    if (isDemo) {
        // В демо-режиме возвращаем mock данные
        return {
            data: currentBoard ? [currentBoard] : [],
            isLoading: false,
            isError: false,
            error: null,
            refetch: () => {},
        };
    }

    return boards;
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
