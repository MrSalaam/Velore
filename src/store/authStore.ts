import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginData, RegisterData } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import * as authAPI from '../services/api/auth';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginData) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authAPI.login(credentials);

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Login failed',
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authAPI.register(userData);

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Registration failed',
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });

          await authAPI.logout();

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          // Clear all localStorage
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
        } catch (error: any) {
          // Even if API call fails, clear local state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Logout failed',
          });

          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      },

      updateUser: (user) => {
        set({ user });
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      checkAuth: async () => {
        const { token } = get();

        if (!token) {
          set({ isAuthenticated: false });
          return false;
        }

        try {
          const isValid = await authAPI.verifyToken();

          if (isValid) {
            // Refresh user data
            const user = await authAPI.getProfile();
            set({
              user,
              isAuthenticated: true,
            });
            return true;
          } else {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
            return false;
          }
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          return false;
        }
      },
    }),
    {
      name: STORAGE_KEYS.USER,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);