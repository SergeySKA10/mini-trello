const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Функция для получения токена
const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token');
    }
    return null;
};

// Функция для обновления токена
const refreshAuthToken = async (): Promise<string | null> => {
    try {
        // Здесь будет логика обновления токена
        return getAuthToken();
    } catch (error) {
        console.error('Token refresh failed:', error);
        return null;
    }
};

// Базовые заголовки
const getHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

// Обработчик ошибок
const handleResponse = async (response: Response) => {
    if (response.status === 401) {
        // Попробуем обновить токен
        const newToken = await refreshAuthToken();
        if (!newToken) {
            // Если не удалось обновить - редирект на логин
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            throw new Error('Authentication required');
        }
        // Здесь можно повторить запрос с новым токеном
        throw new Error('Token expired');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
        );
    }

    return response;
};

export const apiClient = {
    get: async <T>(endpoint: string, id?: string): Promise<T> => {
        const url = id
            ? `${API_BASE_URL}${endpoint}/${id}`
            : `${API_BASE_URL}${endpoint}`;

        const response = await fetch(url, {
            headers: getHeaders(),
        });

        const handledResponse = await handleResponse(response);
        return handledResponse.json();
    },

    post: async <T>(endpoint: string, data: Omit<T, 'id'>): Promise<T> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });

        const handledResponse = await handleResponse(response);
        return handledResponse.json();
    },

    put: async <T>(
        endpoint: string,
        id: string,
        data?: Partial<T>
    ): Promise<T> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });

        const handledResponse = await handleResponse(response);
        return handledResponse.json();
    },

    delete: async (endpoint: string, id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        await handleResponse(response);
    },
};
