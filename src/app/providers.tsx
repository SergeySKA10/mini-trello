'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/react-query/queryClient';
import { ToastProvider } from '@/components/ui/Toast/Toast';
import { StoreProvider } from '@/components/providers/StoreProvider';
import { AppModeProvider } from '@/context/AppModeContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <StoreProvider>
                <AppModeProvider>
                    <ToastProvider>{children}</ToastProvider>
                </AppModeProvider>
            </StoreProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
