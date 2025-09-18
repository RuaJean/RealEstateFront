import axios, { AxiosError } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5106";

export interface ApiError {
  status: number | null;
  message: string;
  code?: string;
  details?: unknown;
}

function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<any>;
    const status = err.response?.status ?? null;
    const message = err.response?.data?.message || err.message || "Request error";
    const code = err.code;
    const details = err.response?.data ?? err.toJSON?.() ?? undefined;
    return { status, message, code, details };
  }
  if (error instanceof Error) {
    return { status: null, message: error.message };
  }
  return { status: null, message: "Unknown error" };
}

export const api = axios.create({ baseURL, withCredentials: true });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error);
    if (apiError.status === 401 && typeof window !== "undefined") {
      // aquí podríamos intentar refresh; por ahora redirigimos a login
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(apiError);
  }
);

export { toApiError };


