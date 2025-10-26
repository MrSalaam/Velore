import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS, STORAGE_KEYS } from '../../utils/constants';
import { User, RegisterData, LoginData, UpdateProfileData, ChangePasswordData } from '../../types';

/**
 * Login user
 */
export const login = async (credentials: LoginData): Promise<{
  user: User;
  token: string;
}> => {
  const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, credentials);
  
  // Store token in localStorage
  if (response.data.token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
  }
  
  return response.data;
};

/**
 * Register new user
 */
export const register = async (userData: RegisterData): Promise<{
  user: User;
  token: string;
}> => {
  const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, userData);
  
  // Store token in localStorage
  if (response.data.token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
  }
  
  return response.data;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post(API_ENDPOINTS.LOGOUT);
  } finally {
    // Clear local storage regardless of API response
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.CART);
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<User> => {
  const response = await axiosInstance.get(API_ENDPOINTS.PROFILE);
  
  // Update stored user data
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
  
  return response.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (userData: UpdateProfileData): Promise<User> => {
  const response = await axiosInstance.put(API_ENDPOINTS.UPDATE_PROFILE, userData);
  
  // Update stored user data
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
  
  return response.data;
};

/**
 * Change password
 */
export const changePassword = async (passwords: ChangePasswordData): Promise<{
  message: string;
}> => {
  const response = await axiosInstance.post(API_ENDPOINTS.CHANGE_PASSWORD, passwords);
  return response.data;
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email: string): Promise<{
  message: string;
}> => {
  const response = await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD, { email });
  return response.data;
};

/**
 * Reset password with token
 */
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<{
  message: string;
}> => {
  const response = await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD, {
    token,
    newPassword,
  });
  return response.data;
};

/**
 * Verify authentication token
 */
export const verifyToken = async (): Promise<boolean> => {
  try {
    await axiosInstance.get(API_ENDPOINTS.PROFILE);
    return true;
  } catch {
    return false;
  }
};

/**
 * Refresh authentication token
 */
export const refreshToken = async (): Promise<string> => {
  const response = await axiosInstance.post('/auth/refresh');
  
  if (response.data.token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
  }

  return response.data.token;
};