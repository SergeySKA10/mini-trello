import { useQueryClient } from '@tanstack/react-query';
import { useCreateCard, useMoveCard } from './useCards';
import type { ICard } from '@/types/board';

export const useCreateCardWithOptimistic = () => {
    const createCardMutation = useCreateCard();
    const queryClient = useQueryClient();

    const optimisticCreate = async (
        newCard: Omit<ICard, 'id'> & { columnId: string }
    ) => {
        const tempId = `temp-${Date.now()}`;

        // Отменяем текущие запросы
        await queryClient.cancelQueries({
            queryKey: ['columns', newCard.columnId, 'cards'],
        });

        // Сохраняем предыдущее состояние для отката
        const previousCards = queryClient.getQueryData<ICard[]>([
            'columns',
            newCard.columnId,
            'cards',
        ]);

        // Оптимистичное обновление
        queryClient.setQueryData<ICard[]>(
            ['columns', newCard.columnId, 'cards'],
            (old = []) => [...old, { ...newCard, id: tempId }]
        );

        try {
            // Выполняем мутацию
            const result = await createCardMutation.mutateAsync(newCard);

            // Заменяем временный ID на настоящий
            queryClient.setQueryData<ICard[]>(
                ['columns', newCard.columnId, 'cards'],
                (old = []) =>
                    old.map((card) => (card.id === tempId ? result : card))
            );

            return result;
        } catch (error) {
            // Откатываем при ошибке
            queryClient.setQueryData(
                ['columns', newCard.columnId, 'cards'],
                previousCards
            );
            throw error;
        }
    };

    return {
        ...createCardMutation,
        mutateAsync: optimisticCreate,
    };
};

export const useMoveCardWithOptimistic = () => {
    const moveCardMutation = useMoveCard();
    const queryClient = useQueryClient();

    const optimisticMove = async (moveData: {
        cardId: string;
        fromColumnId: string;
        toColumnId: string;
        newPosition: number;
    }) => {
        const { cardId, fromColumnId, toColumnId, newPosition } = moveData;

        // Отменяем текущие запросы
        await Promise.all([
            queryClient.cancelQueries({
                queryKey: ['columns', fromColumnId, 'cards'],
            }),
            queryClient.cancelQueries({
                queryKey: ['columns', toColumnId, 'cards'],
            }),
        ]);

        // Сохраняем предыдущие состояния
        const previousSourceCards = queryClient.getQueryData<ICard[]>([
            'columns',
            fromColumnId,
            'cards',
        ]);
        const previousTargetCards = queryClient.getQueryData<ICard[]>([
            'columns',
            toColumnId,
            'cards',
        ]);

        // Находим перемещаемую карточку
        const movingCard = previousSourceCards?.find(
            (card) => card.id === cardId
        );
        if (!movingCard) return;

        // Оптимистичное обновление исходной колонки
        queryClient.setQueryData<ICard[]>(
            ['columns', fromColumnId, 'cards'],
            (old = []) => old.filter((card) => card.id !== cardId)
        );

        // Оптимистичное обновление целевой колонки
        queryClient.setQueryData<ICard[]>(
            ['columns', toColumnId, 'cards'],
            (old = []) => {
                const newCards = [...old];
                newCards.splice(newPosition, 0, movingCard);
                return newCards;
            }
        );

        try {
            await moveCardMutation.mutateAsync(moveData);
        } catch (error) {
            // Откатываем при ошибке
            queryClient.setQueryData(
                ['columns', fromColumnId, 'cards'],
                previousSourceCards
            );
            queryClient.setQueryData(
                ['columns', toColumnId, 'cards'],
                previousTargetCards
            );
            throw error;
        }
    };

    return {
        ...moveCardMutation,
        mutateAsync: optimisticMove,
    };
};
