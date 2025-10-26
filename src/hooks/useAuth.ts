'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast/Toast';
import { apiClient } from '@/lib/api/client';
import type { LoginData, RegisterData, AuthResponse } from '@/types/login';

export const useAuth = () => {
    const router = useRouter();
    const { success, error: showError } = useToast();
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: async (credentials: LoginData): Promise<AuthResponse> => {
            return apiClient.login<AuthResponse>('/auth/login', credentials);
        },
        onSuccess: (data) => {
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            success('Вход выполнен успешно!');
            router.push('/');
        },
        onError: (error: Error) => {
            showError('Ошибка входа', error.message);
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (userData: RegisterData): Promise<AuthResponse> => {
            return apiClient.login<AuthResponse>('/auth/register', userData);
        },
        onSuccess: (data) => {
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            success('Регистрация выполнена успешно!');
            router.push('/');
        },
        onError: (error: Error) => {
            showError('Ошибка регистрации', error.message);
        },
    });

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        queryClient.clear(); // Очищаем кеш запросов
        router.push('/login');
        success('Выход выполнен');
    };

    const getCurrentUser = () => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        }
        return null;
    };

    const isAuthenticated = () => {
        return !!localStorage.getItem('auth_token');
    };

    return {
        login: loginMutation.mutateAsync,
        loginLoading: loginMutation.isPending,
        register: registerMutation.mutateAsync,
        registerLoading: registerMutation.isPending,
        logout,
        getCurrentUser,
        isAuthenticated,
    };
};
