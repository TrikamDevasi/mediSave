/**
 * Axios instance with interceptors for the MediSave backend API.
 */
import axios from 'axios';
import { getAuthToken, clearAuthStorage } from '@/utils/storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ML service instance (separate port)
export const mlApi = axios.create({
  baseURL: import.meta.env.VITE_ML_URL || 'http://localhost:3000/ml',
  timeout: 60000, // OCR can be slow
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor — attach auth token ────────────────────────────
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response interceptor — unwrap data + global error handling ─────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error || error.message || 'Something went wrong';

    if (error.response?.status === 401) {
      clearAuthStorage();
      window.location.href = '/login';
    }

    return Promise.reject(new Error(message));
  }
);

mlApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error || error.message || 'ML service unavailable';
    return Promise.reject(new Error(message));
  }
);

export default api;
