import axios from 'axios';
import { ACCESS_TOKEN } from './token';

// Set up the base URL - use environment variable if available, otherwise fall back to local Django server
const apiUrl = "https://codewithsathya.pythonanywhere.com";

const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor for adding authorization tokens
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        const googleAccessToken = localStorage.getItem("GOOGLE_ACCESS_TOKEN");
        if (googleAccessToken) {
            config.headers["X-Google-Access-Token"] = googleAccessToken;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle specific status codes
            if (error.response.status === 401) {
                // Handle unauthorized access (token expired, invalid, etc.)
                console.error('Unauthorized access - possibly invalid token');
                // You might want to redirect to login or refresh token here
            } else if (error.response.status === 403) {
                console.error('Forbidden access');
            }
        }
        return Promise.reject(error);
    }
);

export default api;