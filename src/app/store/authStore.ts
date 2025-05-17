import { create } from 'zustand';
import * as AuthModels from '../../core/models/auth';
import authService from '../../infrastructure/auth/EnhancedAuthServiceImpl';

// Type aliases for better readability
type AuthState = AuthModels.AuthState;
type LoginCredentials = AuthModels.LoginCredentials;
type User = AuthModels.User;

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: localStorage.getItem('auth_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.login(credentials);

      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('refresh_token', response.refreshToken);

      set({
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to login'
      });
      throw error;
    }
  },

  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      await authService.register(userData);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to register'
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await authService.logout();
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false
      });
    } catch (error) {
      // Even if logout fails on server, clear local state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    try {
      set({ isLoading: true });
      const user = await authService.getCurrentUser();
      set({
        user,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      // If token is invalid, clear auth state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },

  clearError: () => set({ error: null })
}));
