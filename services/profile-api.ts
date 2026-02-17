import { apiClient } from "./api-client";

export interface Profile {
  id: string;
  username: string;
  email: string;
  fullName: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
  balance: number;
  currency: string;
  createdAt: string;
}

export async function getProfile(): Promise<Profile> {
  const { data } = await apiClient.get<Profile>("/profile");
  return data;
}

export async function updateProfile(
  fields: Partial<{ fullName: string; phoneNumber: string }>
): Promise<Profile> {
  const { data } = await apiClient.put<Profile>("/profile", fields);
  return data;
}

export async function uploadAvatar(uri: string): Promise<Profile> {
  const form = new FormData();
  form.append("file", {
    uri,
    name: "avatar.jpg",
    type: "image/jpeg",
  } as unknown as Blob);

  const { data } = await apiClient.post<Profile>("/profile/avatar", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteAvatar(): Promise<void> {
  await apiClient.delete("/profile/avatar");
}

export async function getBalance(): Promise<{ balance: number; currency: string }> {
  const { data } = await apiClient.get("/profile/balance");
  return data;
}
