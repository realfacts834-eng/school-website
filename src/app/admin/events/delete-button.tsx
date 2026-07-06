"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface DeleteEventButtonProps {
  id: string;
  title?: string;
}

export function DeleteEventButton({ id, title }: DeleteEventButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Event deleted successfully!");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to delete event");
      }
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        onClick={() => setOpen(true)}
        title="Delete event"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <DeleteDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        title="Delete Event?"
        description="This will permanently delete this event and all associated data."
        itemName={title}
        loading={loading}
        variant="danger"
        requireConfirmation={true}
        confirmationText="DELETE"
      />
    </>
  );
}