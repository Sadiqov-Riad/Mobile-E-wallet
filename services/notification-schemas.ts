import { z } from "zod";

export const NotificationTypeSchema = z.enum([
  "deposit",
  "withdrawal",
  "transfer",
  "security",
  "promo",
  "system",
]);

export const NotificationSchema = z.object({
  id: z.string(),
  type: NotificationTypeSchema,
  title: z.string(),
  message: z.string(),
  isRead: z.boolean(),
  data: z.string().nullable().optional(),
  createdAt: z.string(),
});

export const NotificationListResponseSchema = z.object({
  items: z.array(NotificationSchema),
  total: z.number(),
  unreadCount: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export const UnreadCountResponseSchema = z.object({
  unreadCount: z.number(),
});

export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type NotificationListResponse = z.infer<typeof NotificationListResponseSchema>;
