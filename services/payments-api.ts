import { apiClient } from "./api-client";

export interface TopUpIntentResponse {
  topUpId: string;
  clientSecret: string;
  publishableKey: string;
  amountMinor: number;
  currency: string;
}

export interface TopUpStatusResponse {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
}

export async function getPaymentConfig(): Promise<{ publishableKey: string }> {
  const { data } = await apiClient.get("/payments/config");
  return data;
}

export async function createTopUpIntent(
  amount: number,
  currency = "usd"
): Promise<TopUpIntentResponse> {
  const { data } = await apiClient.post<TopUpIntentResponse>("/payments/topup/intent", {
    amount,
    currency,
  });
  return data;
}

export async function getTopUpStatus(id: string): Promise<TopUpStatusResponse> {
  const { data } = await apiClient.get<TopUpStatusResponse>(`/payments/topup/${id}/status`);
  return data;
}

export async function pollTopUpStatus(
  id: string,
  intervalMs = 1500,
  maxAttempts = 20
): Promise<TopUpStatusResponse> {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await getTopUpStatus(id);
    if (status.status === "completed" || status.status === "failed") {
      return status;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error("Top-up status polling timed out");
}
