import { useQueryClient } from '@tanstack/react-query';
import {
    useCreateCard,
    // useUpdateCard,
    useDeleteCard,
    useMoveCard,
} from './useCards';
import type { ICard } from '@/types/board';

export const useCreateCardWithOptimistic = () => {
    const createCardMutation = useCreateCard();
    const queryClient = useQueryClient();

    const optimisticCreate = async (
        newCard: Omit<ICard, 'id'> & { columnId: string }
    ) => {
        const tempId = `temp-${Date.now()}`;
        const { columnId, ...cardData } = newCard;

        await queryClient.cancelQueries({
            queryKey: ['columns', columnId, 'cards'],
        });

        const previousCards = queryClient.getQueryData<ICard[]>([
            'columns',
            columnId,
            'cards',
        ]);

        // Оптимистичное обновление
        queryClient.setQueryData<ICard[]>(
            ['columns', columnId, 'cards'],
            (old = []) => [...old, { ...cardData, id: tempId, columnId }]
        );

        try {
            const result = await createCardMutation.mutateAsync(newCard);

            // Заменяем временный ID на настоящий
            queryClient.setQueryData<ICard[]>(
                ['columns', columnId, 'cards'],
                (old = []) =>
                    old.map((card) => (card.id === tempId ? result : card))
            );

            return result;
        } catch (error) {
            // Откатываем при ошибке
            queryClient.setQueryData(
                ['columns', columnId, 'cards'],
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

export const useDeleteCardWithOptimistic = (columnId: string) => {
    const deleteCardMutation = useDeleteCard(columnId);
    const queryClient = useQueryClient();

    const optimisticDelete = async (cardId: string) => {
        await queryClient.cancelQueries({
            queryKey: ['columns', columnId, 'cards'],
        });

        const previousCards = queryClient.getQueryData<ICard[]>([
            'columns',
            columnId,
            'cards',
        ]);

        // Оптимистичное удаление
        queryClient.setQueryData<ICard[]>(
            ['columns', columnId, 'cards'],
            (old = []) => old.filter((card) => card.id !== cardId)
        );

        try {
            await deleteCardMutation.mutateAsync(cardId);
        } catch (error) {
            // Откатываем при ошибке
            queryClient.setQueryData(
                ['columns', columnId, 'cards'],
                previousCards
            );
            throw error;
        }
    };

    return {
        ...deleteCardMutation,
        mutateAsync: optimisticDelete,
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
