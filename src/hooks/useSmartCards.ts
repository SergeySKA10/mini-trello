'use client';

import { useAppMode } from '@/context/AppModeContext';
import { useCards as useRealCards } from './useCards';
import { useAppSelector } from '@/stores/hooks/hooks';

export const useSmartCards = (columnId: string) => {
    const { isDemo } = useAppMode();
    const { currentBoard } = useAppSelector((state) => state.board);
    const realcards = useRealCards(columnId);

    // Демо-режим: данные из Redux
    if (isDemo) {
        const column = currentBoard?.columns.find((col) => col.id === columnId);

        return {
            data: column?.cards || [],
            isLoading: false,
            isError: false,
            error: null,
            refetch: () => {},
        };
    }

    // Реальный режим: данные из API
    return realcards;
};
