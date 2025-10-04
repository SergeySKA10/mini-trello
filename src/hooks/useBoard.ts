import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { IBoard } from '@/features/boards/types/board';

export const useBoards = () =>
    useQuery({
        queryKey: ['boards'],
        queryFn: () => apiClient.get<IBoard[]>('/boards'),
    });

export const useBoard = (id: string) =>
    useQuery({
        queryKey: ['boards', id],
        queryFn: () => apiClient.get<IBoard>('/boards', id),
        enabled: !!id,
    });

export const useCreateBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newBoard: Omit<IBoard, 'id'>) =>
            apiClient.post<IBoard>('/boards', newBoard),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards'] });
        },
    });
};

export const useUpdateBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...updates }: Partial<IBoard> & { id: string }) => {
            return apiClient.put<IBoard>('/boards', id, updates);
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
        mutationFn: (id: string) => apiClient.delete('/boards', id),
        onSuccess: (_, deleteId) => {
            queryClient.removeQueries({ queryKey: ['boards', deleteId] });
            queryClient.invalidateQueries({ queryKey: ['boards'] });
        },
    });
};
