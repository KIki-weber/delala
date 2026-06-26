import axios from 'axios';
import { getApiBaseUrl } from '../utils/apiUrl';

// Set up error interceptor to handle any network issues
const handleErrorResponse = (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('token');
    }
    return Promise.reject(error);
};

const API = axios.create({
    baseURL: getApiBaseUrl()
});

// Add token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle error responses
API.interceptors.response.use(
    (response) => response,
    handleErrorResponse
);

export default API;
