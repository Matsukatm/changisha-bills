import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { email: string; password: string; full_name: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { authService } = await import('../services');
          const response = await authService.login({ email, password });
          
          if (response.data) {
            const token = response.data.access_token;
            authService.setToken(token);
            
            // Get user data
            const userResponse = await authService.getCurrentUser();
            if (userResponse.data) {
              set({
                user: userResponse.data,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            }
          }
        } catch (error: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.detail || 'Login failed',
          });
        }
      },

      register: async (userData: { email: string; password: string; full_name: string }) => {
        set({ isLoading: true, error: null });
        try {
          const { authService } = await import('../services');
          const response = await authService.register(userData);
          
          if (response.data) {
            // Auto-login after registration
            await get().login(userData.email, userData.password);
          }
        } catch (error: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.detail || 'Registration failed',
          });
        }
      },

      logout: () => {
        const { authService } = require('../services');
        authService.removeToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
