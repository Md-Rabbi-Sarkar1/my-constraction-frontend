// import { apiClient } from "@/lib/ofetch-api-client";

import apiClient from "@/lib/ofetch-api-client";

// 💡 Matches your exact query payload requirement structure
export interface NotificationFiltersPayload {
  page: number;
  pageSize: number;
  unreadOnly?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type?: string;
}

export interface NotificationPaginationResult {
  notifications: NotificationItem[];
  totalCount: number;
  totalPages: number;
}

export interface NotificationApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    result: NotificationItem[] | NotificationPaginationResult;
  };
}

// 💡 Maps strictly to GET /api/notifications with multi-filter query attachments
export function getCompanyNotifications(filters: NotificationFiltersPayload) {
  const queryParams = new URLSearchParams();
  
  queryParams.append("page", String(filters.page));
  queryParams.append("pageSize", String(filters.pageSize));
  
  if (filters.unreadOnly !== undefined) {
    queryParams.append("unreadOnly", String(filters.unreadOnly));
  }

  return apiClient<NotificationApiResponse>(`/notifications?${queryParams.toString()}`, {
    method: "GET",
  });
}

// 💡 Optional Utility: Maps strictly to PATCH /api/notifications/:id/read to toggle view states
export function markNotificationAsRead(notificationId: string) {
  return apiClient<any>(`/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
}


export function getNotificationById(notificationId: string) {
  return apiClient<NotificationApiResponse>(`/notifications/${notificationId}`, {
    method: "GET",
  });
}