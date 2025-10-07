import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { IColumn } from '@/types/board';

export const useColumns = (boardId: string) => {
    return useQuery({
        queryKey: ['boards', boardId, 'columns'],
        queryFn: () => apiClient.get<IColumn[]>(`/boards/${boardId}/columns`),
        enabled: !!boardId,
    });
};

export const useCreateColumn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            boardId,
            ...newColumn
        }: Omit<IColumn, 'id'> & { boardId: string }) =>
            apiClient.post<IColumn>(`/boards/${boardId}/columns`, {
                ...newColumn,
                boardId,
            }),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['boards', variables.boardId, 'columns'],
            });
        },
    });
};

export const useUpdateColumns = (boardId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...updates }: IColumn & { id: string }) => {
            return apiClient.put<IColumn>(
                `/boards/${boardId}/columns`,
                id,
                updates
            );
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(
                ['boards', variables.boardId, 'columns'],
                data
            );
            queryClient.invalidateQueries({
                queryKey: ['boards', variables.boardId, 'columns'],
            });
        },
    });
};

export const useDeleteColumns = (boardId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            apiClient.delete(`/boards/${boardId}/columns`, id),
        onSuccess: (_, deleteId) => {
            queryClient.removeQueries({
                queryKey: ['boards', boardId, 'columns', deleteId],
            });
            queryClient.invalidateQueries({
                queryKey: ['boards', boardId, 'columns'],
            });
        },
    });
};

export const useMoveColumn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            columnId,
            fromBoardId,
            toBoardId,
            newPosition,
        }: {
            columnId: string;
            fromBoardId: string;
            toBoardId: string;
            newPosition: number;
        }) =>
            apiClient.post(`/columns/${columnId}/move`, {
                fromBoardId,
                toBoardId,
                newPosition,
            }),
        onSuccess: (_, variables) => {
            // Инвалидируем кеш обеих досок (откуда и куда переместили)
            queryClient.invalidateQueries({
                queryKey: ['boards', variables.fromBoardId, 'columns'],
            });
            queryClient.invalidateQueries({
                queryKey: ['boards', variables.toBoardId, 'columns'],
            });

            // Также инвалидируем общий список досок для sidebar'а
            queryClient.invalidateQueries({
                queryKey: ['boards'],
            });
        },
    });
};
