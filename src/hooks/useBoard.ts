import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { IBoard } from '@/types/board';

export const useBoards = () =>
    useQuery({
        queryKey: ['boards'],
        queryFn: () => apiClient.boards.getAll(),
    });

export const useBoard = (id: string) => {
    return useQuery({
        queryKey: ['boards', id],
        queryFn: () => {
            return apiClient.boards.getById(id);
        },
        enabled: !!id,
    });
};

export const useCreateBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newBoard: Omit<IBoard, 'id'>) =>
            apiClient.boards.create<IBoard>(newBoard),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards'] });
        },
    });
};

export const useUpdateBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...updates }: Partial<IBoard> & { id: string }) => {
            return apiClient.boards.update<IBoard>(id, updates);
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['boards', variables.id], data);
            queryClient.invalidateQueries({ queryKey: ['boards'] });
        },
    });
};

export const useDeleteBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiClient.boards.delete(id),
        onSuccess: (_, deleteId) => {
            queryClient.removeQueries({ queryKey: ['boards', deleteId] });
            queryClient.invalidateQueries({ queryKey: ['boards'] });
        },
    });
};
