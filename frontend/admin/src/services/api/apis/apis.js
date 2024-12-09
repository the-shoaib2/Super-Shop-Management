import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Get all apis
export const getAllApis = async () => {
    try {
        const response = await api.get('/getAllapis');
        return response.data;
    } catch (error) {
        console.error('Error fetching APIs:', error);
        throw error;
    }
};

// Generate Store API
export const genetrateStoreApi = async () => {
    try {
        const response = await api.get('/generatestoreapis');
        return {
            success: true,
            data: response.data?.data || null,
            message: response.data?.message
        };
    } catch (error) {
        console.error('Error creating store:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to generate store API',
            data: null
        };
    }
};

// Fetch Store API Keys
export const fetchStoreApiKeys = async () => {
    try {
        const response = await api.get('/storeApiKeys'); // Adjust the endpoint as necessary
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error('Error fetching store API keys:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to fetch store API keys',
        };
    }
};

export default api;
