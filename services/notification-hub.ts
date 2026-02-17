import {
    HubConnection,
    HubConnectionBuilder,
    LogLevel,
} from "@microsoft/signalr";
import * as SecureStore from "expo-secure-store";
import { NotificationSchema, type Notification } from "./notification-schemas";

const HUB_URL = "http://192.168.0.103:5262/hubs/notifications";

let connection: HubConnection | null = null;
let connecting = false;
const listeners: Array<(n: Notification) => void> = [];

export async function startNotificationHub(): Promise<void> {
  if (connection || connecting) return;
  connecting = true;

  try {
    connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: async () => {
          return (await SecureStore.getItemAsync("accessToken")) ?? "";
        },
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connection.on("ReceiveNotification", (raw: unknown) => {
      const result = NotificationSchema.safeParse(raw);
      if (!result.success) return;
      listeners.forEach((cb) => cb(result.data));
    });

    await connection.start();
  } catch (err) {
    connection = null;
    console.warn("SignalR connection failed:", err);
  } finally {
    connecting = false;
  }
}

export async function stopNotificationHub(): Promise<void> {
  const conn = connection;
  listeners.length = 0;
  connection = null;
  connecting = false;
  if (conn) {
    try {
      await conn.stop();
    } catch {
      // ignore
    }
  }
}

export function onNotification(cb: (n: Notification) => void): () => void {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}
