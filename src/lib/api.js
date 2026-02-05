import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Posts API
export const postsApi = {
    // Get all posts
    getAll: async () => {
        const response = await api.get('/api/posts');
        return response.data;
    },

    // Get single post by ID
    getById: async (id) => {
        const response = await api.get(`/api/posts/${id}`);
        return response.data;
    },

    // Create new post
    create: async (postData) => {
        const response = await api.post('/api/posts', postData);
        return response.data;
    },

    // Update post
    update: async (id, postData) => {
        const response = await api.put(`/api/posts/${id}`, postData);
        return response.data;
    },

    // Delete post
    delete: async (id) => {
        const response = await api.delete(`/api/posts/${id}`);
        return response.data;
    },
};

// Research API
export const researchApi = {
    // Search Reddit for keyword
    search: async (keyword) => {
        const response = await api.post('/api/research', { keyword });
        return response.data;
    },
};

// Stats API
export const statsApi = {
    // Get dashboard statistics
    getStats: async () => {
        const response = await api.get('/api/stats');
        return response.data;
    },
};

export default api;
