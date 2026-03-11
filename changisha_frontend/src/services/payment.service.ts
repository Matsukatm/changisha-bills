import { apiClient } from './api-client';
import {
  Payment,
  PaymentCreate,
  ApiResponse,
} from '../types/api';

export class PaymentService {
  async getPayments(skip = 0, limit = 100): Promise<ApiResponse<Payment[]>> {
    return apiClient.get<Payment[]>('/payments', { skip, limit });
  }

  async createPayment(paymentData: PaymentCreate): Promise<ApiResponse<Payment>> {
    return apiClient.post<Payment>('/payments', paymentData);
  }

  async getPayment(paymentId: number): Promise<ApiResponse<Payment>> {
    return apiClient.get<Payment>(`/payments/${paymentId}`);
  }

  async getPaymentsByBill(billId: number): Promise<ApiResponse<Payment[]>> {
    return apiClient.get<Payment[]>(`/payments`, { bill_id: billId });
  }

  async triggerPayment(billId: number, paymentMethodId?: number): Promise<ApiResponse<Payment>> {
    return apiClient.post<Payment>(`/payments/trigger/${billId}`, { payment_method_id: paymentMethodId });
  }

  async getPendingPayments(): Promise<ApiResponse<Payment[]>> {
    return apiClient.get<Payment[]>('/payments', { status: 'pending' });
  }

  async getCompletedPayments(): Promise<ApiResponse<Payment[]>> {
    return apiClient.get<Payment[]>('/payments', { status: 'completed' });
  }

  async getFailedPayments(): Promise<ApiResponse<Payment[]>> {
    return apiClient.get<Payment[]>('/payments', { status: 'failed' });
  }
}

export const paymentService = new PaymentService();
