"use client";

import { toast } from "sonner";
import { useCallback } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react";

// ==========================================
// Types
// ==========================================
type ToastType = "success" | "error" | "warning" | "info" | "loading";

interface ToastOptions {
  description?: string;
  duration?: number;
  dismissible?: boolean;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  promise?: Promise<unknown>;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

// ==========================================
// Default Icons
// ==========================================
const defaultIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-4 w-4 text-green-500" />,
  error: <XCircle className="h-4 w-4 text-red-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  info: <Info className="h-4 w-4 text-blue-500" />,
  loading: <Loader2 className="h-4 w-4 animate-spin text-primary" />,
};

// ==========================================
// useToast Hook
// ==========================================
export function useToast() {
  // Basic toast
  const showToast = useCallback(
    (message: string, type: ToastType = "info", options?: ToastOptions) => {
      const { description, duration = 4000, dismissible = true, icon, action } = options || {};

      const toastFn = type === "loading" ? toast.loading : toast[type] || toast;

      return toastFn(message, {
        description,
        duration: type === "loading" ? Infinity : duration,
        dismissible,
        icon: icon || defaultIcons[type],
        action,
      });
    },
    []
  );

  // Success toast
  const success = useCallback(
    (message: string, options?: ToastOptions) => {
      return showToast(message, "success", options);
    },
    [showToast]
  );

  // Error toast
  const error = useCallback(
    (message: string, options?: ToastOptions) => {
      return showToast(message, "error", {
        duration: 6000,
        ...options,
      });
    },
    [showToast]
  );

  // Warning toast
  const warning = useCallback(
    (message: string, options?: ToastOptions) => {
      return showToast(message, "warning", {
        duration: 5000,
        ...options,
      });
    },
    [showToast]
  );

  // Info toast
  const info = useCallback(
    (message: string, options?: ToastOptions) => {
      return showToast(message, "info", options);
    },
    [showToast]
  );

  // Loading toast
  const loading = useCallback(
    (message: string, options?: ToastOptions) => {
      const id = showToast(message, "loading", {
        dismissible: false,
        ...options,
      });
      return id;
    },
    [showToast]
  );

  // Promise toast
  const promise = useCallback(
    <T>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: unknown) => string);
      },
      options?: ToastOptions
    ) => {
      return toast.promise(promise, {
        loading: messages.loading,
        success: (data) => messages.success instanceof Function ? messages.success(data) : messages.success,
        error: (err) => messages.error instanceof Function ? messages.error(err) : messages.error,
        ...options,
      });
    },
    []
  );

  // Dismiss toast
  const dismiss = useCallback((id?: string) => {
    if (id) {
      toast.dismiss(id);
    } else {
      toast.dismiss();
    }
  }, []);

  // Dismiss all toasts
  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  // Update loading toast
  const updateToast = useCallback(
    (id: string, message: string, type: ToastType, options?: ToastOptions) => {
      if (type === "loading") {
        toast.loading(message, { id, ...options });
      } else {
        toast[type](message, { id, ...options });
      }
    },
    []
  );

  // Success from loading
  const resolveToast = useCallback(
    (id: string, message: string, options?: ToastOptions) => {
      toast.success(message, { id, ...options });
    },
    []
  );

  // Error from loading
  const rejectToast = useCallback(
    (id: string, message: string, options?: ToastOptions) => {
      toast.error(message, { id, ...options });
    },
    []
  );

  return {
    showToast,
    toast: {
      success,
      error,
      warning,
      info,
      loading,
      promise,
      dismiss,
      dismissAll,
      update: updateToast,
      resolve: resolveToast,
      reject: rejectToast,
    },
  };
}