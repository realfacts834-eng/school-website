"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Check,
  X,
  Clock,
  UserCheck,
  UserX,
  Undo2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Types
// ==========================================
interface AdmissionActionsProps {
  id: string;
  status: string;
  studentName?: string;
}

// ==========================================
// AdmissionActions Component
// ==========================================
export function AdmissionActions({
  id,
  status,
  studentName,
}: AdmissionActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const updateStatus = async (newStatus: string) => {
    setLoading(newStatus);
    try {
      const res = await fetch(`/api/admissions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        const messages: Record<string, string> = {
          approved: "Application approved successfully!",
          rejected: "Application rejected",
          pending: "Application moved back to pending",
          waitlist: "Added to waitlist",
        };
        toast.showToast(messages[newStatus] || `Status updated to ${newStatus}`);
        router.refresh();
      } else {
        const error = await res.json();
        toast.showToast(error.message || "Failed to update status");
      }
    } catch {
      toast.showToast("Network error. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Show full action buttons for pending/waitlist
  if (status === "pending" || status === "waitlist") {
    return (
      <div className="flex items-center gap-1 justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
          onClick={() => updateStatus("approved")}
          disabled={loading !== null}
          title="Approve"
        >
          {loading === "approved" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          onClick={() => updateStatus("rejected")}
          disabled={loading !== null}
          title="Reject"
        >
          {loading === "rejected" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
          onClick={() => updateStatus("waitlist")}
          disabled={loading !== null}
          title="Waitlist"
        >
          <Clock className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Show undo button for approved/rejected
  return (
    <div className="flex items-center gap-1 justify-end">
      <span
        className={cn(
          "text-xs px-2 py-1 rounded-full font-medium inline-flex items-center gap-1",
          status === "approved"
            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
            : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
        )}
      >
        {status === "approved" ? (
          <>
            <UserCheck className="h-3 w-3" />
            Approved
          </>
        ) : (
          <>
            <UserX className="h-3 w-3" />
            Rejected
          </>
        )}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={() => updateStatus("pending")}
        disabled={loading !== null}
        title="Undo - Move back to pending"
      >
        {loading === "pending" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Undo2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}