"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Trash2,
  Loader2,
  ShieldAlert,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Types
// ==========================================
interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  itemName?: string;
  loading?: boolean;
  variant?: "default" | "danger" | "warning";
  requireConfirmation?: boolean;
  confirmationText?: string;
}

// ==========================================
// DeleteDialog Component
// ==========================================
export function DeleteDialog({
  open,
  onClose,
  onConfirm,
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
  loading = false,
  variant = "danger",
  requireConfirmation = false,
  confirmationText,
}: DeleteDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setConfirmText("");
      setIsProcessing(false);
    }
  }, [open]);

  const handleConfirm = useCallback(async () => {
    if (isProcessing || loading) return;

    setIsProcessing(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setIsProcessing(false);
    }
  }, [onConfirm, onClose, isProcessing, loading]);

  const isDisabled =
    isProcessing ||
    loading ||
    (requireConfirmation && confirmText !== (confirmationText || "DELETE"));

  // Handle keyboard shortcut
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isDisabled) {
        e.preventDefault();
        handleConfirm();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, isDisabled, handleConfirm]);

  const variantConfig = {
    danger: {
      iconBg: "bg-red-100 dark:bg-red-950/50",
      iconColor: "text-red-600 dark:text-red-400",
      buttonClass: "bg-red-600 hover:bg-red-700 text-white",
      ringClass: "ring-red-500/20",
    },
    warning: {
      iconBg: "bg-yellow-100 dark:bg-yellow-950/50",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      buttonClass: "bg-yellow-600 hover:bg-yellow-700 text-white",
      ringClass: "ring-yellow-500/20",
    },
    default: {
      iconBg: "bg-muted",
      iconColor: "text-foreground",
      buttonClass: "bg-primary hover:bg-primary/90 text-primary-foreground",
      ringClass: "ring-primary/20",
    },
  };

  const config = variantConfig[variant];
  const confirmRequiredText = confirmationText || "DELETE";

  return (
    <Dialog open={open} onClose={isProcessing ? undefined : onClose}>
      {/* Header */}
      <DialogHeader>
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-full shrink-0", config.iconBg)}>
            {variant === "danger" ? (
              <ShieldAlert className={cn("h-5 w-5", config.iconColor)} />
            ) : (
              <AlertTriangle className={cn("h-5 w-5", config.iconColor)} />
            )}
          </div>
          <div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="mt-1">
              {description}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      {/* Content */}
      <DialogContent>
        {/* Item Name Display */}
        {itemName && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
            <Info className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Item to delete:</p>
              <p className="text-sm font-semibold truncate">{itemName}</p>
            </div>
          </div>
        )}

        {/* Confirmation Input */}
        {requireConfirmation && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Please type <span className="font-bold text-foreground">{confirmRequiredText}</span> to confirm:
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Type "${confirmRequiredText}"`}
              className={cn(
                "font-mono",
                confirmText && confirmText !== confirmRequiredText && "border-yellow-500"
              )}
              autoFocus
              disabled={isProcessing}
            />
            {confirmText && confirmText !== confirmRequiredText && (
              <p className="text-xs text-yellow-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Text does not match
              </p>
            )}
          </div>
        )}

        {/* Warning Message */}
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 dark:text-red-400">
            This action is permanent and cannot be undone. All associated data will be permanently removed.
          </p>
        </div>
      </DialogContent>

      {/* Footer */}
      <DialogFooter>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isDisabled}
          className={cn(
            "gap-2 min-w-[100px]",
            isDisabled
              ? "opacity-50 cursor-not-allowed"
              : config.buttonClass
          )}
        >
          {isProcessing || loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete
            </>
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}