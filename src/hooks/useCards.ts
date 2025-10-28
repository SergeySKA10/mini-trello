import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { ICard } from '@/types/board';

export const useCards = (columnId: string) => {
    return useQuery({
        queryKey: ['columns', columnId, 'cards'],
        queryFn: () => apiClient.cards.getByColumn(columnId),
        enabled: !!columnId,
    });
};

export const useCreateCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            columnId,
            ...newCard
        }: Omit<ICard, 'id'> & { columnId: string }) =>
            apiClient.cards.create<ICard>(columnId, {
                ...newCard,
                columnId,
            }),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['columns', variables.columnId, 'cards'],
            });
        },
    });
};

export const useUpdateCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...updates }: Partial<ICard> & { id: string }) =>
            apiClient.cards.update<ICard>(id, updates),
        onSuccess: (data, variables) => {
            queryClient.setQueryData(
                ['columns', 'cards', variables.id],
                (old: ICard[] = []) =>
                    old.map((card) =>
                        card.id === variables.id ? { ...card, ...data } : card
                    )
            );
        },
    });
};

export const useDeleteCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiClient.cards.delete(id),
        onSuccess: (_, deleteId) => {
            queryClient.removeQueries({
                queryKey: ['columns', 'cards', deleteId],
            });
            queryClient.invalidateQueries({
                queryKey: ['columns', 'cards', deleteId],
            });
        },
    });
};
export const useMoveCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            cardId,
            fromColumnId,
            toColumnId,
            newPosition,
        }: {
            cardId: string;
            fromColumnId: string;
            toColumnId: string;
            newPosition: number;
        }) =>
            apiClient.cards.move(cardId, {
                fromColumnId,
                toColumnId,
                newPosition,
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['columns', variables.fromColumnId, 'cards'],
            });
            queryClient.invalidateQueries({
                queryKey: ['columns', variables.toColumnId, 'cards'],
            });
        },
    });
};
