import { useCallback } from 'react';
import { useMoveCardWithOptimistic } from './useCardWithOptimistic';
import { useToast } from '@/components/ui/Toast/Toast';
import type { DragEndEvent } from '@dnd-kit/core';

export const useDnDActionsEnhanced = () => {
    const moveCard = useMoveCardWithOptimistic();
    const toast = useToast();

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

            // Определяем тип перетаскивания (карточка или колонка)
            const activeData = active.data.current;
            const overData = over.data.current;

            // Если карточка
            if (activeData?.type === 'card') {
                const sourceColumnId = activeData.card.columnId;
                let targetColumnId: string;
                let newPosition: number;

                if (overData?.type === 'card') {
                    // Перетаскиваем карточку над другой карточкой
                    targetColumnId = overData.card.columnId;
                    newPosition = overData.card.order;
                } else if (overData?.type === 'column') {
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

                    // toast.success('Карточка перемещена');
                } catch (error) {
                    // toast.error('Не удалось переместить карточку');
                    console.error('Move card error:', error);
                }
            }
        },
        [moveCard, toast]
    );

    return {
        handleCardMove,
        isMoving: moveCard.isPending,
    };
};
