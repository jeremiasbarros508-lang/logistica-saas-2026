import type { ApiError } from "@/types";
import { AxiosError } from "axios";

export function isAxiosError(error: unknown): error is AxiosError {
  return error instanceof AxiosError;
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "detail" in error
  );
}

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    if (data?.detail) {
      if (typeof data.detail === "string") return data.detail;
      if (Array.isArray(data.detail)) {
        return data.detail.map((d) => d.msg).join(", ");
      }
    }
    if (error.message) return error.message;
  }

  if (error instanceof Error) return error.message;

  if (typeof error === "string") return error;

  return "Ocorreu um erro inesperado.";
}

export function parseApiError(error: unknown): ApiError {
  if (isAxiosError(error) && error.response?.data) {
    return error.response.data as ApiError;
  }
  return { detail: getErrorMessage(error) };
}
