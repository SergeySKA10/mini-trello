import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { ICard } from '@/types/board';

export const useCards = (columnId: string) => {
    return useQuery({
        queryKey: ['columns', columnId, 'cards'],
        queryFn: () => apiClient.get<ICard[]>(`/columns/${columnId}/cards`),
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
            apiClient.post<ICard>(`/columns/${columnId}/cards`, {
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

export const useUpdateCard = (columnId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...updates }: Partial<ICard> & { id: string }) =>
            apiClient.put<ICard>(`/columns/${columnId}/cards`, id, updates),
        onSuccess: (data, variables) => {
            queryClient.setQueryData(
                ['columns', columnId, 'cards'],
                (old: ICard[] = []) =>
                    old.map((card) =>
                        card.id === variables.id ? { ...card, ...data } : card
                    )
            );
        },
    });
};

export const useDeleteCard = (columnId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            apiClient.delete(`/columns/${columnId}/cards`, id),
        onSuccess: (_, deleteId) => {
            queryClient.removeQueries({
                queryKey: ['columns', columnId, 'cards', deleteId],
            });
            queryClient.invalidateQueries({
                queryKey: ['columns', columnId, 'cards'],
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
            apiClient.post(`/cards/${cardId}/move`, {
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
