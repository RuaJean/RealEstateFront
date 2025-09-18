import { api } from "./api";
import type { Owner } from "@/models/Owner";

export async function getOwnerById(id: string): Promise<Owner> {
  const { data } = await api.get<Owner>(`/api/Owner/${id}`);
  return data;
}

export async function listOwners(params?: { name?: string; skip?: number; take?: number }): Promise<Owner[]> {
  const { data } = await api.get<Owner[]>(`/api/Owner`, { params });
  return Array.isArray(data) ? data : [];
}

export async function createOwner(payload: Partial<Owner>): Promise<Owner> {
  const { data } = await api.post<Owner>(`/api/Owner`, payload);
  return data;
}

export async function updateOwner(id: string, payload: Partial<Owner>): Promise<void> {
  await api.put<void>(`/api/Owner/${id}`, payload);
}

export async function deleteOwner(id: string): Promise<void> {
  await api.delete<void>(`/api/Owner/${id}`);
}


