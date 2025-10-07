'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h2 className="text-lg font-semibold text-red-800">
                            Что-то пошло не так
                        </h2>
                        <p className="text-red-600 mt-2">
                            {this.state.error?.message}
                        </p>
                        <button
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            onClick={() => this.setState({ hasError: false })}
                        >
                            Попробовать снова
                        </button>
                    </div>
                )
            );
        }

        return this.props.children;
    }
}
