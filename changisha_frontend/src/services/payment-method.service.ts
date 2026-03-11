import { apiClient } from './api-client';
import {
  UserPaymentMethod,
  UserPaymentMethodCreate,
  UserPaymentMethodUpdate,
  ApiResponse,
} from '../types/api';

export class PaymentMethodService {
  async getPaymentMethods(skip = 0, limit = 100): Promise<ApiResponse<UserPaymentMethod[]>> {
    return apiClient.get<UserPaymentMethod[]>('/payment-methods', { skip, limit });
  }

  async createPaymentMethod(paymentMethodData: UserPaymentMethodCreate): Promise<ApiResponse<UserPaymentMethod>> {
    return apiClient.post<UserPaymentMethod>('/payment-methods', paymentMethodData);
  }

  async getPaymentMethod(paymentMethodId: number): Promise<ApiResponse<UserPaymentMethod>> {
    return apiClient.get<UserPaymentMethod>(`/payment-methods/${paymentMethodId}`);
  }

  async updatePaymentMethod(paymentMethodId: number, paymentMethodData: UserPaymentMethodUpdate): Promise<ApiResponse<UserPaymentMethod>> {
    return apiClient.put<UserPaymentMethod>(`/payment-methods/${paymentMethodId}`, paymentMethodData);
  }

  async deletePaymentMethod(paymentMethodId: number): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/payment-methods/${paymentMethodId}`);
  }

  async setDefaultPaymentMethod(paymentMethodId: number): Promise<ApiResponse<UserPaymentMethod>> {
    return apiClient.post<UserPaymentMethod>(`/payment-methods/${paymentMethodId}/set-default`);
  }

  async getDefaultPaymentMethod(): Promise<ApiResponse<UserPaymentMethod>> {
    return apiClient.get<UserPaymentMethod>('/payment-methods/default');
  }

  async getActivePaymentMethods(): Promise<ApiResponse<UserPaymentMethod[]>> {
    return apiClient.get<UserPaymentMethod[]>('/payment-methods', { is_active: true });
  }
}

export const paymentMethodService = new PaymentMethodService();
