import axios from 'axios';

// Default to live Render API URL if VITE_API_BASE_URL is not explicitly set
const DEFAULT_API_URL = import.meta.env.DEV
  ? 'http://localhost:5000/api'
  : 'https://ajaia-project.onrender.com/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For HttpOnly cookies
});

// Request interceptor to attach Bearer token fallback if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ajaia_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let sessionExpiredHandler = null;

export const setSessionExpiredHandler = (handler) => {
  sessionExpiredHandler = handler;
};

// Response interceptor for handling 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('ajaia_token');
        if (sessionExpiredHandler) {
          sessionExpiredHandler();
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
