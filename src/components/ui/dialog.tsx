"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Dialog Props
// ==========================================
interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "default" | "lg" | "xl" | "full";
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  preventScroll?: boolean;
}

// ==========================================
// Size Classes
// ==========================================
const sizeClasses = {
  sm: "max-w-sm",
  default: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
};

// ==========================================
// Dialog Component
// ==========================================
export function Dialog({
  open,
  onClose,
  children,
  className,
  size = "default",
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  preventScroll = true,
}: DialogProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const previousActiveElement = React.useRef<Element | null>(null);

  // Lock body scroll
  React.useEffect(() => {
    if (open && preventScroll) {
      previousActiveElement.current = document.activeElement;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Focus dialog
      setTimeout(() => {
        dialogRef.current?.focus();
      }, 100);
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      
      // Restore focus
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [open, preventScroll]);

  // Escape key handler
  React.useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      // Trap focus
      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEscape, onClose]);

  // Animation states
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open && !isAnimating) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        open ? "animate-in fade-in-0" : "animate-out fade-out-0"
      )}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm",
          open ? "animate-in fade-in-0" : "animate-out fade-out-0"
        )}
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Dialog Content */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          "relative z-10 w-full bg-background rounded-xl shadow-2xl",
          "border border-border",
          "focus:outline-none",
          "animate-in zoom-in-95 slide-in-from-bottom-2",
          sizeClasses[size],
          "max-h-[calc(100vh-2rem)] overflow-y-auto",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className={cn(
              "absolute right-4 top-4 z-10",
              "p-1.5 rounded-lg",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-muted",
              "transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-school-blue"
            )}
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {children}
      </div>
    </div>
  );
}

// ==========================================
// Dialog Header
// ==========================================
export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-6 pt-6 pb-4 border-b border-border",
        className
      )}
      {...props}
    />
  );
}

// ==========================================
// Dialog Title
// ==========================================
export function DialogTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold leading-tight tracking-tight",
        "pr-8", // Space for close button
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

// ==========================================
// Dialog Description
// ==========================================
export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground mt-1", className)}
      {...props}
    />
  );
}

// ==========================================
// Dialog Content
// ==========================================
export function DialogContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-6 py-4", className)}
      {...props}
    />
  );
}

// ==========================================
// Dialog Footer
// ==========================================
export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-6 pb-6 pt-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-2",
        "border-t border-border mt-2",
        className
      )}
      {...props}
    />
  );
}