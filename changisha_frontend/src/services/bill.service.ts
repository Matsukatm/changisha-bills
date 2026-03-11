import { apiClient } from './api-client';
import {
  Bill,
  BillCreate,
  BillUpdate,
  BillProgress,
  ApiResponse,
} from '../types/api';

export class BillService {
  async getBills(skip = 0, limit = 100): Promise<ApiResponse<Bill[]>> {
    return apiClient.get<Bill[]>('/bills', { skip, limit });
  }

  async getBill(billId: number): Promise<ApiResponse<Bill>> {
    return apiClient.get<Bill>(`/bills/${billId}`);
  }

  async createBill(billData: BillCreate): Promise<ApiResponse<Bill>> {
    return apiClient.post<Bill>('/bills', billData);
  }

  async updateBill(billId: number, billData: BillUpdate): Promise<ApiResponse<Bill>> {
    return apiClient.put<Bill>(`/bills/${billId}`, billData);
  }

  async deleteBill(billId: number): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/bills/${billId}`);
  }

  async getBillProgress(billId: number): Promise<ApiResponse<BillProgress>> {
    return apiClient.get<BillProgress>(`/bills/${billId}/progress`);
  }

  async getActiveBills(): Promise<ApiResponse<Bill[]>> {
    return apiClient.get<Bill[]>('/bills', { is_paid: false });
  }

  async getPaidBills(): Promise<ApiResponse<Bill[]>> {
    return apiClient.get<Bill[]>('/bills', { is_paid: true });
  }

  async getBillsDueSoon(days = 7): Promise<ApiResponse<Bill[]>> {
    return apiClient.get<Bill[]>('/bills/due-soon', { days });
  }
}

export const billService = new BillService();
