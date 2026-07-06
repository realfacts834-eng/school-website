"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface DeleteBlogButtonProps {
  id: string;
  title?: string;
}

export function DeleteBlogButton({ id, title }: DeleteBlogButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.showToast("Blog post deleted!");
        router.refresh();
      } else {
        toast.showToast("Failed to delete blog post");
      }
    } catch {
      toast.showToast("Network error");
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
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <DeleteDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        title="Delete Blog Post?"
        description="This will permanently delete this blog post."
        itemName={title}
        loading={loading}
        variant="danger"
        requireConfirmation={true}
        confirmationText="DELETE"
      />
    </>
  );
}