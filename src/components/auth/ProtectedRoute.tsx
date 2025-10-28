'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppMode } from '@/context/AppModeContext';
import { AppLayout } from '@/components/layout/AppLayout';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isRealApi } = useAppMode();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );
    const router = useRouter();

    useEffect(() => {
        if (isRealApi) {
            const token = localStorage.getItem('auth_token');
            console.log('ProtectedRoute check:', {
                isRealApi,
                hasToken: !!token,
            });

            if (!token) {
                // Сохраняем текущий URL для редиректа после логина
                const currentPath =
                    window.location.pathname + window.location.search;
                console.log('Redirecting to login, current path:', currentPath);
                router.push(
                    `/login?redirect=${encodeURIComponent(currentPath)}`
                );
            } else {
                setIsAuthenticated(true);
            }
        } else {
            // В демо-режиме всегда разрешаем доступ
            setIsAuthenticated(true);
        }
    }, [isRealApi, router]);

    // Пока проверяем аутентификацию, показываем загрузку
    if (isAuthenticated === null) {
        return (
            <AppLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">
                            Проверка доступа...
                        </p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!isAuthenticated) {
        return null; // Редирект уже произойдет
    }

    return <>{children}</>;
}
