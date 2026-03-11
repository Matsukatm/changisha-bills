// User related types
export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name: string;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

// Auth related types
export interface Token {
  access_token: string;
  token_type: string;
}

// Bill related types
export interface Bill {
  id: number;
  user_id: number;
  name: string;
  target_amount: number;
  current_balance: number;
  due_date: string;
  payment_method: string;
  recipient_account: string;
  is_paid: boolean;
  created_at: string;
  updated_at?: string;
}

export interface BillCreate {
  name: string;
  target_amount: number;
  due_date: string;
  payment_method: string;
  recipient_account: string;
}

export interface BillUpdate {
  name?: string;
  target_amount?: number;
  current_balance?: number;
  due_date?: string;
  payment_method?: string;
  recipient_account?: string;
  is_paid?: boolean;
}

export interface BillProgress {
  bill_id: number;
  current_balance: number;
  target_amount: number;
  progress_percentage: number;
  is_paid: boolean;
  remaining_amount: number;
}

// Contribution related types
export interface Contribution {
  id: number;
  user_id: number;
  bill_id: number;
  amount: number;
  created_at: string;
}

export interface ContributionCreate {
  bill_id: number;
  amount: number;
}

export interface ContributionSummary {
  bill_id: number;
  total_contributions: number;
  total_amount: number;
  contributions: Array<{
    id: number;
    amount: number;
    created_at: string;
    user_id: number;
  }>;
}

// Payment related types
export interface Payment {
  id: number;
  user_id: number;
  bill_id: number;
  amount: number;
  transaction_id: string;
  status: 'pending' | 'completed' | 'failed';
  payment_method: string;
  created_at: string;
  completed_at?: string;
}

export interface PaymentCreate {
  bill_id: number;
  amount: number;
  payment_method: string;
}

// Payment Method related types
export interface UserPaymentMethod {
  id: number;
  user_id: number;
  payment_type: string;
  provider_name: string;
  account_number: string;
  account_holder_name: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface UserPaymentMethodCreate {
  payment_type: string;
  provider_name: string;
  account_number: string;
  account_holder_name: string;
  is_default?: boolean;
}

export interface UserPaymentMethodUpdate {
  payment_type?: string;
  provider_name?: string;
  account_number?: string;
  account_holder_name?: string;
  is_default?: boolean;
  is_active?: boolean;
}

// Notification related types
export interface Notification {
  id: number;
  user_id: number;
  bill_id?: number;
  message: string;
  type: string;
  is_sent: boolean;
  sent_at?: string;
  created_at: string;
}

// Analytics related types
export interface AnalyticsEvent {
  id: number;
  user_id: number;
  event_type: string;
  event_data: string;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  detail?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  next?: string;
  previous?: string;
}

// Error types
export interface ApiError {
  detail: string;
  status?: number;
  code?: string;
}

// Dashboard types
export interface DashboardStats {
  total_bills: number;
  active_bills: number;
  paid_bills: number;
  total_contributions: number;
  upcoming_reminders: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_bills: Bill[];
  recent_contributions: Contribution[];
  upcoming_reminders: Notification[];
}
