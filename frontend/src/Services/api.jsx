// src/services/api.js
import axios from 'axios';
import { getApiBaseUrl } from '../utils/apiUrl';

const api = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
