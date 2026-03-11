import { apiClient } from './api-client';
import {
  Notification,
  ApiResponse,
} from '../types/api';

export class NotificationService {
  async getNotifications(skip = 0, limit = 100): Promise<ApiResponse<Notification[]>> {
    return apiClient.get<Notification[]>('/notifications', { skip, limit });
  }

  async markAsRead(notificationId: number): Promise<ApiResponse<Notification>> {
    return apiClient.patch<Notification>(`/notifications/${notificationId}`, { is_read: true });
  }

  async markAllAsRead(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch<{ message: string }>('/notifications/mark-all-read');
  }

  async getUnreadNotifications(): Promise<ApiResponse<Notification[]>> {
    return apiClient.get<Notification[]>('/notifications', { is_read: false });
  }

  async getRecentNotifications(limit = 10): Promise<ApiResponse<Notification[]>> {
    return apiClient.get<Notification[]>('/notifications', { limit, order_by: 'created_at', order: 'desc' });
  }

  async getUpcomingReminders(): Promise<ApiResponse<Notification[]>> {
    return apiClient.get<Notification[]>('/notifications/reminders');
  }

  async deleteNotification(notificationId: number): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/notifications/${notificationId}`);
  }
}

export const notificationService = new NotificationService();
