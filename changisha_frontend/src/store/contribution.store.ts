import { create } from 'zustand';
import { Contribution, ContributionSummary } from '../types/api';

interface ContributionState {
  contributions: Contribution[];
  contributionSummaries: Record<number, ContributionSummary>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchContributions: () => Promise<void>;
  createContribution: (contributionData: any) => Promise<void>;
  fetchContributionsByBill: (billId: number) => Promise<void>;
  fetchContributionSummary: (billId: number) => Promise<void>;
  clearError: () => void;
}

export const useContributionStore = create<ContributionState>((set) => ({
  contributions: [],
  contributionSummaries: {},
  isLoading: false,
  error: null,

  fetchContributions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { contributionService } = await import('../services');
      const response = await contributionService.getContributions();
      
      if (response.data) {
        set({
          contributions: response.data,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.detail || 'Failed to fetch contributions',
      });
    }
  },

  createContribution: async (contributionData: any) => {
    set({ isLoading: true, error: null });
    try {
      const { contributionService } = await import('../services');
      const response = await contributionService.createContribution(contributionData);
      
      if (response.data) {
        set(state => ({
          contributions: [response.data!, ...state.contributions],
          isLoading: false,
          error: null,
        }));
        
        // Refresh bill progress after contribution
        const { useBillStore } = await import('./bill.store');
        useBillStore.getState().fetchBillProgress(contributionData.bill_id);
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.detail || 'Failed to create contribution',
      });
    }
  },

  fetchContributionsByBill: async (billId: number) => {
    set({ isLoading: true, error: null });
    try {
      const { contributionService } = await import('../services');
      const response = await contributionService.getContributionsByBill(billId);
      
      if (response.data) {
        set({
          contributions: response.data,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.detail || 'Failed to fetch contributions',
      });
    }
  },

  fetchContributionSummary: async (billId: number) => {
    try {
      const { contributionService } = await import('../services');
      const response = await contributionService.getContributionSummary(billId);
      
      if (response.data) {
        set((state) => {
          const newContributionSummaries = { ...state.contributionSummaries };
          newContributionSummaries[billId] = response.data as ContributionSummary;
          return { contributionSummaries: newContributionSummaries };
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch contribution summary:', error);
    }
  },

  clearError: () => set({ error: null }),
}));
