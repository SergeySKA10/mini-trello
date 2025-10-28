import type { LoginData, RegisterData } from '@/types/login';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Функция для получения токена
const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token');
    }
    return null;
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
    console.log('Response Status:', response.status, response.statusText);

    if (response.status === 401) {
        // Токен истек или невалидный
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Authentication required');
    }

    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
            console.error('API Error:', errorData);
        } catch {
            console.error('API Error - No JSON response');
        }

        throw new Error(errorMessage);
    }

    return response;
};

// // Логирование для отладки
// const logRequest = (method: string, url: string, data?: any) => {
//     if (process.env.NODE_ENV === 'development') {
//         console.log(`API ${method}: ${url}`, data || '');
//     }
// };

export const apiClient = {
    // Auth endpoints
    auth: {
        signin: async (credentials: LoginData) => {
            const url = `${API_BASE_URL}/api/auth/login`;
            // logRequest('POST', url, credentials);

            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(credentials),
            });

            console.log('Signin Response Status:', response.status);
            const handledResponse = await handleResponse(response);
            return handledResponse.json();
        },

        signup: async (userData: RegisterData) => {
            const url = `${API_BASE_URL}/api/auth/register`;
            // logRequest('POST', url, userData);

            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(userData),
            });

            console.log('Signup Response Status:', response.status);
            const handledResponse = await handleResponse(response);
            return handledResponse.json();
        },

        // logout: async () => {
        //     const url = `${API_BASE_URL}/auth/logout`;
        //     // logRequest('POST', url);

        //     const response = await fetch(url, {
        //         method: 'POST',
        //         headers: getHeaders(),
        //     });
        //     await handleResponse(response);
        // },

        // getMe: async () => {
        //     const url = `${API_BASE_URL}/auth/me`;
        //     // logRequest('GET', url);

        //     const response = await fetch(url, {
        //         headers: getHeaders(),
        //     });

        //     const handledResponse = await handleResponse(response);
        //     return handledResponse.json();
        // },

        // OAuth URLs
        getOAuthUrl: (provider: 'google' | 'github') => {
            return `${API_BASE_URL}/api/oauth/${provider}/url`;
        },
    },

    // Boards endpoints
    boards: {
        getAll: async () => {
            const url = `${API_BASE_URL}/api/boards`;
            // logRequest('GET', url);

            const response = await fetch(url, {
                headers: getHeaders(),
            });

            const handledResponse = await handleResponse(response);
            return handledResponse.json();
        },

        getById: async (id: string) => {
            const url = `${API_BASE_URL}/api/boards/${id}`;
            // logRequest('GET', url);

            const response = await fetch(url, {
                headers: getHeaders(),
            });

            const handledResponse = await handleResponse(response);
            return handledResponse.json();
        },

        create: async <T>(data: Omit<T, 'id'>) => {
            const url = `${API_BASE_URL}/api/boards`;
            // logRequest('POST', url, data);

            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });

            const handledResponse = await handleResponse(response);
            return handledResponse.json();
        },

        update: async <T>(id: string, data: Partial<T>) => {
            const url = `${API_BASE_URL}/api/boards/${id}`;
            // logRequest('PUT', url, data);

            const response = await fetch(url, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });

            const handledResponse = await handleResponse(response);
            return handledResponse.json();
        },

        delete: async (id: string) => {
            const url = `${API_BASE_URL}/api/boards/${id}`;
            // logRequest('DELETE', url);

            const response = await fetch(url, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            await handleResponse(response);
        },
    },

    // Columns endpoints
    columns: {
        getByBoard: async (boardId: string) => {
            const url = `${API_BASE_URL}/api/boards/${boardId}/columns`;
            // logRequest('GET', url);

            const response = await fetch(url, {
                headers: getHeaders(),
            });

            const handledResponse = await handleResponse(response);
            return handledResponse.json();
        },

        create: async <T>(boardId: string, data: Omit<T, 'id'>) => {
            const url = `${API_BASE_URL}/api/boards/${boardId}/columns`;
            // logRequest('POST', url, data);

            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });

            const handledResponse = await handleResponse(response);
            return handledResponse.json();
        },

        update: async <T>(id: string, data: Partial<T>) => {
            const url = `${API_BASE_URL}/api/columns/${id}`;
            // logRequest('PUT', url, data);

            const response = await fetch(url, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });

            const handledResponse = await handleResponse(response);
            return handledResponse.json();
        },

        delete: async (id: string) => {
            const url = `${API_BASE_URL}/api/columns/${id}`;
            // logRequest('DELETE', url);

            const response = await fetch(url, {
                method: 'DELETE',
                headers: getHeaders(),
            });

            await handleResponse(response);
        },
    },

    // Cards endpoints
    cards: {
        getByColumn: async (columnId: string) => {
            const url = `${API_BASE_URL}/api/columns/${columnId}/cards`;
            // logRequest('GET', url);

            const response = await fetch(url, {
                headers: getHeaders(),
            });

            const handledResponse = await handleResponse(response);
            return handledResponse.json();
        },

        create: async <T>(columnId: string, data: Omit<T, 'id'>) => {
            const url = `${API_BASE_URL}/api/columns/${columnId}/cards`;
            // logRequest('POST', url, data);

            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });

            const handledResponse = await handleResponse(response);
            return handledResponse.json();
        },

        update: async <T>(id: string, data: Partial<T>) => {
            const url = `${API_BASE_URL}/api/cards/${id}`;
            // logRequest('PUT', url, data);

            const response = await fetch(url, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });

            const handledResponse = await handleResponse(response);
            return handledResponse.json();
        },

        delete: async (id: string) => {
            const url = `${API_BASE_URL}/api/cards/${id}`;
            // logRequest('DELETE', url);

            const response = await fetch(url, {
                method: 'DELETE',
                headers: getHeaders(),
            });

            await handleResponse(response);
        },

        move: async <T>(cardId: string, data: T) => {
            const url = `${API_BASE_URL}/api/cards/${cardId}/move`;
            // logRequest('POST', url, data);

            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });

            const handledResponse = await handleResponse(response);
            return handledResponse.json();
        },
    },
};
