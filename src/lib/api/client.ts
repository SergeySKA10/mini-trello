const API_BASE_URL = 'http://localhost:3001/api';

export const apiClient = {
    get: async <T>(endpoint: string, id?: string): Promise<T> => {
        const url = id
            ? `${API_BASE_URL}${endpoint}/${id}`
            : `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    },

    post: async <T>(endpoint: string, data: Omit<T, 'id'>): Promise<T> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    },

    put: async <T>(
        endpoint: string,
        id: string,
        data?: Partial<T>
    ): Promise<T> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: data ? JSON.stringify(data) : undefined,
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    },

    delete: async (endpoint: string, id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Network response was not ok');
    },
};
