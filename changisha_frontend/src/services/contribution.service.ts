import { apiClient } from './api-client';
import {
  Contribution,
  ContributionCreate,
  ContributionSummary,
  ApiResponse,
} from '../types/api';

export class ContributionService {
  async getContributions(skip = 0, limit = 100): Promise<ApiResponse<Contribution[]>> {
    return apiClient.get<Contribution[]>('/contributions', { skip, limit });
  }

  async createContribution(contributionData: ContributionCreate): Promise<ApiResponse<Contribution>> {
    return apiClient.post<Contribution>('/contributions', contributionData);
  }

  async getContributionsByBill(billId: number): Promise<ApiResponse<Contribution[]>> {
    return apiClient.get<Contribution[]>(`/contributions`, { bill_id: billId });
  }

  async getContributionSummary(billId: number): Promise<ApiResponse<ContributionSummary>> {
    return apiClient.get<ContributionSummary>(`/contributions/summary/${billId}`);
  }

  async getRecentContributions(limit = 10): Promise<ApiResponse<Contribution[]>> {
    return apiClient.get<Contribution[]>('/contributions', { limit, order_by: 'created_at', order: 'desc' });
  }

  async getTotalContributions(): Promise<ApiResponse<{ total: number; count: number }>> {
    return apiClient.get<{ total: number; count: number }>('/contributions/total');
  }
}

export const contributionService = new ContributionService();
