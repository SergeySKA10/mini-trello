'use client';

import { useAppMode } from '@/context/AppModeContext';
import {
    useCreateCardWithOptimistic,
    useDeleteCardWithOptimistic,
    useMoveCardWithOptimistic,
} from './useCardWithOptimistic';
import { useUpdateCard } from './useCards';
import { useAppDispatch } from '@/stores/hooks/hooks';
import {
    addCard,
    updateCard,
    deleteCard,
    moveCard,
} from '@/stores/slices/board-slice';
import type { ICard } from '@/types/board';

// Умное создание карточки
export const useSmartCreateCard = () => {
    const { isDemo } = useAppMode();
    const dispatch = useAppDispatch();
    const realCreateCard = useCreateCardWithOptimistic();

    if (isDemo) {
        return {
            mutateAsync: async (
                newCard: Omit<ICard, 'id'> & { columnId: string }
            ) => {
                // В демо-режиме используем Redux
                dispatch(
                    addCard({
                        columnId: newCard.columnId,
                        title: newCard.title,
                        content: newCard.content,
                    })
                );

                // Возвращаем промис с временным ID для совместимости
                return Promise.resolve({
                    ...newCard,
                    id: `demo-card-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
            },
            isPending: false,
            isError: false,
            error: null,
        };
    }

    // В реальном режиме используем API
    return realCreateCard;
};

// Умное обновление карточки
export const useSmartUpdateCard = (columnId: string) => {
    const { isDemo } = useAppMode();
    const dispatch = useAppDispatch();
    const realUpdateCard = useUpdateCard(columnId);

    if (isDemo) {
        return {
            mutateAsync: async ({
                id,
                ...updates
            }: Partial<ICard> & { id: string }) => {
                dispatch(
                    updateCard({
                        cardId: id,
                        updates,
                    })
                );

                return Promise.resolve({
                    id,
                    ...updates,
                    updatedAt: new Date().toISOString(),
                } as ICard);
            },
            isPending: false,
            isError: false,
            error: null,
        };
    }

    return realUpdateCard;
};

// Умное удаление карточки
export const useSmartDeleteCard = (columnId: string) => {
    const { isDemo } = useAppMode();
    const dispatch = useAppDispatch();
    const realDeleteCard = useDeleteCardWithOptimistic(columnId);

    if (isDemo) {
        return {
            mutateAsync: async (cardId: string) => {
                dispatch(deleteCard({ cardId }));
                return Promise.resolve();
            },
            isPending: false,
            isError: false,
            error: null,
        };
    }

    return realDeleteCard;
};

// Умное перемещение карточки
export const useSmartMoveCard = () => {
    const { isDemo } = useAppMode();
    const dispatch = useAppDispatch();
    const realMoveCard = useMoveCardWithOptimistic();

    if (isDemo) {
        return {
            mutateAsync: async (moveData: {
                cardId: string;
                fromColumnId: string;
                toColumnId: string;
                newPosition: number;
            }) => {
                // В демо-режиме используем Redux action для перемещения
                dispatch(
                    moveCard({
                        activeId: moveData.cardId,
                        overId: moveData.toColumnId, // В Redux логике overId может быть колонкой
                    })
                );

                return Promise.resolve();
            },
            isPending: false,
            isError: false,
            error: null,
        };
    }

    return realMoveCard;
};
