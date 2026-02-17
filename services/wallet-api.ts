import { apiClient } from "./api-client";

export interface Transaction {
  id: string;
  type: string;
  category: string;
  amount: number;
  currency: string;
  balanceAfter: number;
  description: string;
  counterpartyId: string | null;
  counterpartyName: string | null;
  createdAt: string;
}

export interface TransactionListResponse {
  items: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getTransactions(
  page = 1,
  pageSize = 20,
  type?: string
): Promise<TransactionListResponse> {
  const params: Record<string, string | number> = { page, pageSize };
  if (type) params.type = type;
  const { data } = await apiClient.get<TransactionListResponse>("/wallet/transactions", { params });
  return data;
}

export async function getTransaction(id: string): Promise<Transaction> {
  const { data } = await apiClient.get<Transaction>(`/wallet/transactions/${id}`);
  return data;
}

export async function transfer(
  recipientIdentifier: string,
  amount: number,
  description?: string
): Promise<Transaction> {
  const { data } = await apiClient.post<Transaction>("/wallet/transfer", {
    recipientIdentifier,
    amount,
    description,
  });
  return data;
}

export interface UserSearchResult {
  id: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
}

export async function searchUsers(query: string): Promise<UserSearchResult[]> {
  const { data } = await apiClient.get<UserSearchResult[]>("/wallet/search-users", {
    params: { q: query },
  });
  return data;
}
