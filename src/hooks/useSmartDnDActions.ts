import { useCallback } from 'react';
import { useAppMode } from '@/context/AppModeContext';
import { useSmartMoveCard } from './useSmartCardMutations';
import { useToast } from '@/components/ui/Toast/Toast';
import type { DragEndEvent } from '@dnd-kit/core';

export const useSmartDnDActions = () => {
    const { isDemo } = useAppMode();
    const moveCard = useSmartMoveCard();
    const { success, error: showError } = useToast();

    const handleCardMove = useCallback(
        async (event: DragEndEvent) => {
            const { active, over } = event;

            if (!over) {
                return;
            }

            const activeId = active.id as string;
            const overId = over.id as string;

            // Если позиция не изменилась
            if (activeId === overId) {
                return;
            }

            // Определяем тип перетаскивания
            const activeData = active.data.current;
            const overData = over.data.current;

            // Обрабатываем только перемещение карточек
            if (activeData?.type === 'card' && activeData.card) {
                const sourceColumnId = activeData.card.columnId;
                let targetColumnId: string;
                let newPosition: number;

                if (overData?.type === 'card' && overData.card) {
                    // Перетаскиваем карточку над другой карточкой
                    targetColumnId = overData.card.columnId;
                    newPosition = overData.card.order;
                } else if (overData?.type === 'column' && overData.column) {
                    // Перетаскиваем карточку в пустую колонку
                    targetColumnId = overData.column.id;
                    newPosition = 0;
                } else {
                    return;
                }

                try {
                    await moveCard.mutateAsync({
                        cardId: activeId,
                        fromColumnId: sourceColumnId,
                        toColumnId: targetColumnId,
                        newPosition,
                    });

                    if (!isDemo) {
                        success('Карточка перемещена');
                    }
                } catch (error) {
                    if (!isDemo) {
                        showError('Не удалось переместить карточку');
                    }
                    console.error('Move card error:', error);
                }
            }
        },
        [moveCard, isDemo, success, showError] // ДОБАВИТЬ зависимости
    );

    return {
        handleCardMove,
        isMoving: moveCard.isPending,
    };
};
