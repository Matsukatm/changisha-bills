import { apiClient } from './api-client';
import {
  User,
  UserCreate,
  UserLogin,
  Token,
  ApiResponse,
} from '../types/api';

export class AuthService {
  async login(credentials: UserLogin): Promise<ApiResponse<Token>> {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    return apiClient.post<Token>('/auth/login', formData);
  }

  async register(userData: UserCreate): Promise<ApiResponse<User>> {
    return apiClient.post<User>('/auth/register', userData);
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/logout');
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/auth/me');
  }

  // Store token in localStorage
  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Remove token from localStorage
  removeToken(): void {
    localStorage.removeItem('access_token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Simple token validation (you might want to add more sophisticated validation)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();
