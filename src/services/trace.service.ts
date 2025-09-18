import { api } from "./api";
import type { PropertyTrace } from "@/models/Property";
import type { PropertyTraceCreate } from "@/models/Property";

export async function listTracesByProperty(propertyId: string): Promise<PropertyTrace[]> {
  const { data } = await api.get<PropertyTrace[]>(`/api/PropertyTrace/by-property/${propertyId}`);
  return Array.isArray(data) ? data : [];
}

export async function createTrace(payload: PropertyTraceCreate): Promise<PropertyTrace> {
  const { data } = await api.post<PropertyTrace>(`/api/PropertyTrace`, payload);
  return data;
}


