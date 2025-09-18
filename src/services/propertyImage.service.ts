import { api } from "./api";
import type { PropertyImage } from "@/models/Property";

export async function listImagesByProperty(propertyId: string): Promise<PropertyImage[]> {
  const { data } = await api.get<PropertyImage[]>(`/api/PropertyImage/by-property/${propertyId}`);
  return Array.isArray(data) ? data : [];
}

export async function uploadPropertyImage(
  propertyId: string,
  file: File,
  options?: { description?: string; enabled?: boolean; onProgress?: (percent: number) => void }
): Promise<PropertyImage> {
  const form = new FormData();
  form.append("File", file);
  if (options?.description !== undefined) form.append("Description", options.description);
  if (options?.enabled !== undefined) form.append("Enabled", String(options.enabled));

  const { data } = await api.post<PropertyImage>(`/api/properties/${propertyId}/images`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (evt) => {
      if (!options?.onProgress) return;
      const total = evt.total ?? 0;
      const loaded = evt.loaded ?? 0;
      const percent = total ? Math.round((loaded / total) * 100) : 0;
      options.onProgress(percent);
    },
  });
  return data;
}

export async function setImageEnabled(id: string, enabled: boolean): Promise<void> {
  await api.patch<void>(`/api/PropertyImage/${id}/enabled`, undefined, { params: { enabled } });
}

export async function deleteImage(id: string): Promise<void> {
  await api.delete<void>(`/api/PropertyImage/${id}`);
}

export async function uploadFileRaw(file: File): Promise<void> {
  const form = new FormData();
  form.append("file", file);
  await api.post<void>(`/api/File/upload`, form, { headers: { "Content-Type": "multipart/form-data" } });
}


