import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for HttpOnly cookies
});

// Event bus or global handler for 401 session expiration
let sessionExpiredHandler = null;

export const setSessionExpiredHandler = (handler) => {
  sessionExpiredHandler = handler;
};

// Response interceptor for handling 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Trigger session expired handler if not already on login page
      if (!window.location.pathname.includes('/login')) {
        if (sessionExpiredHandler) {
          sessionExpiredHandler();
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
