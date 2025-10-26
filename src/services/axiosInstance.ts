import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, STORAGE_KEYS, ERROR_MESSAGES } from '../utils/constants';

// Define interfaces for better type safety
interface CustomError {
  message: string;
  status: number;
  errors?: any;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: any;
}

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (!error.response) {
      // Network error
      console.error(ERROR_MESSAGES.NETWORK_ERROR);
      return Promise.reject({
        message: ERROR_MESSAGES.NETWORK_ERROR,
        status: 0,
      } as CustomError);
    }

    const { status } = error.response;

    switch (status) {
      case 401:
        // Unauthorized - Clear auth data and redirect to login
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = '/login';
        return Promise.reject({
          message: ERROR_MESSAGES.UNAUTHORIZED,
          status,
        } as CustomError);

      case 403:
        return Promise.reject({
          message: ERROR_MESSAGES.FORBIDDEN,
          status,
        } as CustomError);

      case 404:
        return Promise.reject({
          message: ERROR_MESSAGES.NOT_FOUND,
          status,
        } as CustomError);

      case 422:
        return Promise.reject({
          message: ERROR_MESSAGES.VALIDATION_ERROR,
          status,
          errors: (error.response.data as ApiErrorResponse)?.errors || error.response.data,
        } as CustomError);

      case 500:
      case 502:
      case 503:
        return Promise.reject({
          message: ERROR_MESSAGES.SERVER_ERROR,
          status,
        } as CustomError);

      default:
        return Promise.reject({
          message: (error.response.data as ApiErrorResponse)?.message ||
                   (error.response.data as ApiErrorResponse)?.error ||
                   ERROR_MESSAGES.SERVER_ERROR,
          status,
        } as CustomError);
    }
  }
);

export default axiosInstance;