import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { ApiResponse, ApiError } from '../types/api';

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/v1`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      // Server responded with error status
      return {
        detail: error.response.data?.detail || 'An error occurred',
        status: error.response.status,
        code: error.response.data?.code,
      };
    } else if (error.request) {
      // Network error
      return {
        detail: 'Network error. Please check your connection.',
        status: 0,
      };
    } else {
      // Other error
      return {
        detail: error.message || 'An unexpected error occurred',
        status: 500,
      };
    }
  }

  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, { params });
      return { data: response.data };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data);
      return { data: response.data };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.put(url, data);
      return { data: response.data };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(url);
      return { data: response.data };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.patch(url, data);
      return { data: response.data };
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const apiClient = new ApiClient();
