"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
  const { theme } = useTheme();

  return (
    <Sonner
      position="top-right"
      expand
      visibleToasts={5}
      gap={8}
      offset={16}
      duration={4000}
      theme={theme as "light" | "dark" | "system"}
      toastOptions={{
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
        classNames: {
          toast:
            "group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          title: "text-sm font-semibold",
          description: "text-xs text-muted-foreground",
          actionButton:
            "bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-md",
          cancelButton:
            "bg-muted text-muted-foreground text-xs font-medium px-3 py-1 rounded-md",
          closeButton:
            "opacity-50 hover:opacity-100 transition-opacity",
          success:
            "!border-l-4 !border-l-green-500",
          error:
            "!border-l-4 !border-l-red-500",
          warning:
            "!border-l-4 !border-l-yellow-500",
          info:
            "!border-l-4 !border-l-blue-500",
          loading:
            "!border-l-4 !border-l-school-gold",
        },
      }}
      richColors
      closeButton
    />
  );
}