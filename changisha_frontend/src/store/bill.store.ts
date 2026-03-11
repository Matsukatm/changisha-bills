import { create } from 'zustand';
import { Bill, BillProgress } from '../types/api';

interface BillState {
  bills: Bill[];
  currentBill: Bill | null;
  billProgress: Record<number, BillProgress>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchBills: () => Promise<void>;
  fetchBill: (billId: number) => Promise<void>;
  createBill: (billData: any) => Promise<void>;
  updateBill: (billId: number, billData: any) => Promise<void>;
  deleteBill: (billId: number) => Promise<void>;
  fetchBillProgress: (billId: number) => Promise<void>;
  clearError: () => void;
  setCurrentBill: (bill: Bill | null) => void;
}

export const useBillStore = create<BillState>((set) => ({
  bills: [],
  currentBill: null,
  billProgress: {},
  isLoading: false,
  error: null,

  fetchBills: async () => {
    set({ isLoading: true, error: null });
    try {
      const { billService } = await import('../services');
      const response = await billService.getBills();
      
      if (response.data) {
        set({
          bills: response.data,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.detail || 'Failed to fetch bills',
      });
    }
  },

  fetchBill: async (billId: number) => {
    set({ isLoading: true, error: null });
    try {
      const { billService } = await import('../services');
      const response = await billService.getBill(billId);
      
      if (response.data) {
        set({
          currentBill: response.data,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.detail || 'Failed to fetch bill',
      });
    }
  },

  createBill: async (billData: any) => {
    set({ isLoading: true, error: null });
    try {
      const { billService } = await import('../services');
      const response = await billService.createBill(billData);
      
      if (response.data) {
        set(state => ({
          bills: [...state.bills, response.data!],
          isLoading: false,
          error: null,
        }));
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.detail || 'Failed to create bill',
      });
    }
  },

  updateBill: async (billId: number, billData: any) => {
    set({ isLoading: true, error: null });
    try {
      const { billService } = await import('../services');
      const response = await billService.updateBill(billId, billData);
      
      if (response.data) {
        set(state => ({
          bills: state.bills.map(bill => 
            bill.id === billId ? response.data! : bill
          ),
          currentBill: state.currentBill?.id === billId ? response.data! : state.currentBill,
          isLoading: false,
          error: null,
        }));
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.detail || 'Failed to update bill',
      });
    }
  },

  deleteBill: async (billId: number) => {
    set({ isLoading: true, error: null });
    try {
      const { billService } = await import('../services');
      await billService.deleteBill(billId);
      
      set(state => ({
        bills: state.bills.filter(bill => bill.id !== billId),
        currentBill: state.currentBill?.id === billId ? null : state.currentBill,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.detail || 'Failed to delete bill',
      });
    }
  },

  fetchBillProgress: async (billId: number) => {
    try {
      const { billService } = await import('../services');
      const response = await billService.getBillProgress(billId);
      
      if (response.data) {
        set((state) => {
          const newBillProgress = { ...state.billProgress };
          newBillProgress[billId] = response.data as BillProgress;
          return { billProgress: newBillProgress };
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch bill progress:', error);
    }
  },

  clearError: () => set({ error: null }),
  setCurrentBill: (bill: Bill | null) => set({ currentBill: bill }),
}));
