import { apiClient } from "./api-client";
import {
    NotificationListResponseSchema,
    UnreadCountResponseSchema,
    type NotificationListResponse,
} from "./notification-schemas";

export async function getNotifications(
  page = 1,
  pageSize = 30
): Promise<NotificationListResponse> {
  const { data } = await apiClient.get("/notifications", {
    params: { page, pageSize },
  });
  return NotificationListResponseSchema.parse(data);
}

export async function getUnreadCount(): Promise<number> {
  const { data } = await apiClient.get("/notifications/unread-count");
  const parsed = UnreadCountResponseSchema.parse(data);
  return parsed.unreadCount;
}

export async function markAsRead(id: string): Promise<void> {
  await apiClient.post(`/notifications/${id}/read`);
}

export async function markAllAsRead(): Promise<void> {
  await apiClient.post("/notifications/read-all");
}
