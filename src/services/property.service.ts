import { api } from "./api";
import type { Property, PropertyCreate, PropertyUpdate, PropertyPriceUpdate } from "@/models/Property";

export type PropertyListParams = {
  text?: string;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  pageSize?: number;
  ownerId?: string;
  year?: number;
};

export type PropertyListResult = {
  items: Property[];
  total: number;
  page: number;
  pageSize: number;
};

export async function listProperties(params: PropertyListParams = {}): Promise<PropertyListResult> {
  const { data } = await api.get<any>(`/api/properties`, { params });

  // Normalizar múltiples posibles formas de respuesta del backend
  if (Array.isArray(data)) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? data.length;
    return { items: data as Property[], total: data.length, page, pageSize };
  }

  if (data && Array.isArray(data.items)) {
    return {
      items: data.items as Property[],
      total: Number(data.total ?? data.count ?? data.totalCount ?? data.items.length) || data.items.length,
      page: Number(data.page ?? data.currentPage ?? params.page ?? 1) || 1,
      pageSize: Number(data.pageSize ?? data.limit ?? params.pageSize ?? data.items.length) || data.items.length,
    };
  }

  if (data && Array.isArray(data.result)) {
    return {
      items: data.result as Property[],
      total: Number(data.total ?? data.result.length) || data.result.length,
      page: Number(data.page ?? params.page ?? 1) || 1,
      pageSize: Number(data.pageSize ?? params.pageSize ?? data.result.length) || data.result.length,
    };
  }

  return { items: [], total: 0, page: params.page ?? 1, pageSize: params.pageSize ?? 10 };
}

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


