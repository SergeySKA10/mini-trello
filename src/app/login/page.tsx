'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppMode } from '@/context/AppModeContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setMode } = useAppMode();
    const { login, loginLoading, register, registerLoading } = useAuth();

    const redirectTo = searchParams.get('redirect') || '/';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await login({ email, password });
            setMode('real-api');
        } catch (error) {
            console.error(error);
        }
    };

    const handleDemoMode = () => {
        setMode('demo');
        router.push('/');
    };

    return (
        <AppLayout>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Вход в Mini Trello
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Используйте реальный API или{' '}
                            <button
                                onClick={handleDemoMode}
                                className="cursor-pointer font-medium text-blue-600 hover:text-blue-500"
                            >
                                перейдите в демо-режим
                            </button>
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email" className="sr-only">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loginLoading}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Пароль
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Пароль"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    disabled={loginLoading}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={loginLoading}
                                className="cursor-pointer flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loginLoading ? 'Вход...' : 'Войти'}
                            </button>
                        </div>

                        <div className="text-center">
                            <Link
                                href="/register"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Нет аккаунта? Зарегистрироваться
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
