import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Notification } from "../services/notification-schemas";
import {
    markAllAsRead as apiMarkAllAsRead,
    markAsRead as apiMarkAsRead,
    getNotifications
} from "../services/notifications-api";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;

  loadNotifications: () => Promise<void>;
  addNotification: (n: Notification) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      loading: false,

      loadNotifications: async () => {
        if (get().loading) return;
        set({ loading: true });
        try {
          const res = await getNotifications(1, 50);
          const existing = get().notifications;
          const ids = new Set(res.items.map((n: Notification) => n.id));
          const merged = [
            ...res.items,
            ...existing.filter((n: Notification) => !ids.has(n.id)),
          ].slice(0, 50);
          set({ notifications: merged, unreadCount: res.unreadCount });
        } finally {
          set({ loading: false });
        }
      },

      addNotification: (n) => {
        const { notifications } = get();
        if (notifications.some((x) => x.id === n.id)) return;
        set({
          notifications: [n, ...notifications].slice(0, 50),
          unreadCount: get().unreadCount + 1,
        });
      },

      markAsRead: async (id) => {
        await apiMarkAsRead(id);
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, s.unreadCount - 1),
        }));
      },

      markAllAsRead: async () => {
        await apiMarkAllAsRead();
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        }));
      },
    }),
    {
      name: "notification-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        notifications: s.notifications.slice(0, 50),
        unreadCount: s.unreadCount,
      }),
    }
  )
);
