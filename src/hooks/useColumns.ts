import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { IColumn } from '@/types/board';

export const useColumns = (boardId: string) => {
    return useQuery({
        queryKey: ['boards', boardId, 'columns'],
        queryFn: () => apiClient.columns.getByBoard(boardId),
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
            apiClient.columns.create<IColumn>(boardId, {
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

export const useUpdateColumns = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...updates }: Partial<IColumn> & { id: string }) => {
            return apiClient.columns.update<IColumn>(id, updates);
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

export const useDeleteColumns = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiClient.columns.delete(id),
        onSuccess: (_, deleteId) => {
            queryClient.removeQueries({
                queryKey: ['boards', 'columns', deleteId],
            });
            queryClient.invalidateQueries({
                queryKey: ['boards', 'columns', deleteId],
            });
        },
    });
};

// export const useMoveColumn = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: ({
//             columnId,
//             fromBoardId,
//             toBoardId,
//             newPosition,
//         }: {
//             columnId: string;
//             fromBoardId: string;
//             toBoardId: string;
//             newPosition: number;
//         }) =>
//             apiClient.post(`/columns/${columnId}/move`, {
//                 fromBoardId,
//                 toBoardId,
//                 newPosition,
//             }),
//         onSuccess: (_, variables) => {
//             // Инвалидируем кеш обеих досок (откуда и куда переместили)
//             queryClient.invalidateQueries({
//                 queryKey: ['boards', variables.fromBoardId, 'columns'],
//             });
//             queryClient.invalidateQueries({
//                 queryKey: ['boards', variables.toBoardId, 'columns'],
//             });

//             // Также инвалидируем общий список досок для sidebar'а
//             queryClient.invalidateQueries({
//                 queryKey: ['boards'],
//             });
//         },
//     });
// };
