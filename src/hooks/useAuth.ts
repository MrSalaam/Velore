import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LoginData, RegisterData, UpdateProfileData, ChangePasswordData } from '../types';
import { toast } from 'react-hot-toast';
import { SUCCESS_MESSAGES } from '../utils/constants';
import * as authAPI from '../services/api/auth';

export const useAuth = () => {
  const navigate = useNavigate();
  
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login: loginStore,
    register: registerStore,
    logout: logoutStore,
    updateUser,
    clearError,
    setLoading,
    checkAuth,
  } = useAuthStore();

  // Login
  const login = useCallback(
    async (credentials: LoginData) => {
      try {
        await loginStore(credentials);
        toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
        navigate('/');
      } catch (error: any) {
        toast.error(error.message || 'Login failed');
        throw error;
      }
    },
    [loginStore, navigate]
  );

  // Register
  const register = useCallback(
    async (userData: RegisterData) => {
      try {
        await registerStore(userData);
        toast.success(SUCCESS_MESSAGES.REGISTER_SUCCESS);
        navigate('/');
      } catch (error: any) {
        toast.error(error.message || 'Registration failed');
        throw error;
      }
    },
    [registerStore, navigate]
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      await logoutStore();
      toast.success(SUCCESS_MESSAGES.LOGOUT_SUCCESS);
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    }
  }, [logoutStore, navigate]);

  // Update profile
  const updateProfile = useCallback(
    async (userData: UpdateProfileData) => {
      try {
        setLoading(true);
        const updatedUser = await authAPI.updateProfile(userData);
        updateUser(updatedUser);
        toast.success(SUCCESS_MESSAGES.PROFILE_UPDATED);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        toast.error(error.message || 'Failed to update profile');
        throw error;
      }
    },
    [updateUser, setLoading]
  );

  // Change password
  const changePassword = useCallback(
    async (passwords: ChangePasswordData) => {
      try {
        setLoading(true);
        await authAPI.changePassword(passwords);
        toast.success(SUCCESS_MESSAGES.PASSWORD_CHANGED);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        toast.error(error.message || 'Failed to change password');
        throw error;
      }
    },
    [setLoading]
  );

  // Request password reset
  const requestPasswordReset = useCallback(
    async (email: string) => {
      try {
        setLoading(true);
        await authAPI.requestPasswordReset(email);
        toast.success('Password reset link sent to your email');
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        toast.error(error.message || 'Failed to send reset link');
        throw error;
      }
    },
    [setLoading]
  );

  // Reset password
  const resetPassword = useCallback(
    async (resetToken: string, newPassword: string) => {
      try {
        setLoading(true);
        await authAPI.resetPassword(resetToken, newPassword);
        toast.success('Password reset successful');
        setLoading(false);
        navigate('/login');
      } catch (error: any) {
        setLoading(false);
        toast.error(error.message || 'Failed to reset password');
        throw error;
      }
    },
    [setLoading, navigate]
  );

  // Get user profile
  const refreshProfile = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await authAPI.getProfile();
      updateUser(userData);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message || 'Failed to fetch profile');
    }
  }, [updateUser, setLoading]);

  // Check authentication on mount
  useEffect(() => {
    if (token) {
      checkAuth();
    }
  }, [token, checkAuth]);

  // Require authentication (redirect to login if not authenticated)
  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to continue');
      navigate('/login');
      return false;
    }
    return true;
  }, [isAuthenticated, navigate]);

  // Get user initials
  const getUserInitials = useCallback(() => {
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }, [user]);

  // Get full name
  const getFullName = useCallback(() => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`;
  }, [user]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    refreshProfile,
    requireAuth,
    clearError,

    // Helpers
    getUserInitials,
    getFullName,
  };
};