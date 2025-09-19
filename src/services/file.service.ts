import { api } from "./api";

export type FileUploadResponse = {
  path: string;
  url: string;
};

export async function uploadFile(file: File): Promise<FileUploadResponse> {
  // Intento 1: nombre de campo 'file' (según contrato)
  try {
    const formData = new FormData();
    formData.append("file", file, file.name);
    const { data } = await api.post<FileUploadResponse>("/api/File/upload", formData);
    return data ?? { path: "", url: "" };
  } catch (e) {
    // Intento 2: algunos backends esperan 'File' en mayúscula
    const formData = new FormData();
    formData.append("File", file, file.name);
    const { data } = await api.post<FileUploadResponse>("/api/File/upload", formData);
    return data ?? { path: "", url: "" };
  }
}



