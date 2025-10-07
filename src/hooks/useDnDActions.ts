import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { endMovingCard } from '@/stores/slices/board-slice';
import { useMoveCardWithOptimistic } from './useCardWithOptimistic';
import { useToast } from '@/components/ui/Toast';

export const useDnDActions = () => {
    const dispatch = useDispatch();
    const moveCard = useMoveCardWithOptimistic();
    const toast = useToast();

    const handleCardMove = useCallback(
        async (result: any) => {
            const { source, destination, draggableId } = result;

            // Если нет destination (выбросили за пределы)
            if (!destination) {
                dispatch(endMovingCard(result));
                return;
            }

            // Если позиция не изменилась
            if (
                source.droppableId === destination.droppableId &&
                source.index === destination.index
            ) {
                dispatch(endMovingCard(result));
                return;
            }

            try {
                // Оптимистичное обновление в Redux
                dispatch(endMovingCard(result));

                // Синхронизация с сервером
                await moveCard.mutateAsync({
                    cardId: draggableId,
                    fromColumnId: source.droppableId,
                    toColumnId: destination.droppableId,
                    newPosition: destination.index,
                });

                toast.success('Карточка перемещена');
            } catch (error) {
                toast.error('Не удалось переместить карточку');
                console.error('Move card error:', error);
            }
        },
        [dispatch, moveCard, toast]
    );

    return {
        handleCardMove,
        isMoving: moveCard.isPending,
    };
};
