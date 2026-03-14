"use client";

import { toast } from "sonner";

export function useNotification() {
  const success = (message: string, description?: string) => {
    toast.success(message, { description });
  };

  const error = (message: string, description?: string) => {
    toast.error(message, { description });
  };

  const info = (message: string, description?: string) => {
    toast.info(message, { description });
  };

  const warning = (message: string, description?: string) => {
    toast.warning(message, { description });
  };

  return { success, error, info, warning };
}
