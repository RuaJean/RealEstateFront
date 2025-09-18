import { api } from "./api";
import type { Property, PropertyCreate, PropertyUpdate, PropertyPriceUpdate } from "@/models/Property";

export async function getPropertyById(id: string): Promise<Property> {
  const { data } = await api.get<Property>(`/api/properties/${id}`);
  return data;
}

export async function createProperty(payload: PropertyCreate): Promise<Property> {
  const { data } = await api.post<Property>(`/api/properties`, payload);
  return data;
}

export async function updateProperty(id: string, payload: PropertyUpdate): Promise<void> {
  await api.put<void>(`/api/properties/${id}`, payload);
}

export async function updatePropertyPrice(id: string, payload: PropertyPriceUpdate): Promise<void> {
  await api.patch<void>(`/api/properties/${id}/price`, payload);
}


