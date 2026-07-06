"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema, type BlogFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, ArrowLeft, Send, AlertCircle, Tag } from "lucide-react";

interface BlogFormProps {
  initialData?: {
    id: string;
    title: string;
    content: string;
    excerpt: string | null;
    featuredImage: string | null;
    tags: string | null;
    isPublished: boolean;
  };
}

export function BlogForm({ initialData }: BlogFormProps = {}) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(initialData?.content || "");
  const [image, setImage] = useState(initialData?.featuredImage || "");
  const [contentError, setContentError] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!initialData;

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initialData?.title || "",
      excerpt: initialData?.excerpt || "",
      tags: initialData?.tags || "",
      isPublished: initialData?.isPublished || false,
    },
  });

  const onSubmit = async (data: BlogFormData) => {
    if (!content || content.length < 10) {
      setContentError("Content must be at least 10 characters");
      return;
    }
    setContentError("");

    setLoading(true);
    const payload = { ...data, content, featuredImage: image };

    try {
      const url = isEditing ? `/api/blog/${initialData.id}` : "/api/blog";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.showToast(isEditing ? "Blog post updated!" : "Blog post created!");
        router.push("/admin/blog");
        router.refresh();
      } else {
        toast.showToast("Failed to save blog post");
      }
    } catch {
      toast.showToast("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-1.5 block">Title <span className="text-destructive">*</span></label>
        <Input placeholder="Blog title" {...register("title")} error={errors.title?.message} disabled={loading} />
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 block">Excerpt <span className="text-muted-foreground font-normal">(Optional)</span></label>
        <Input placeholder="Brief description" {...register("excerpt")} disabled={loading} />
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 block">Tags <span className="text-muted-foreground font-normal">(Optional)</span></label>
        <Input placeholder="e.g. education, events, tips" leftIcon={<Tag className="h-4 w-4" />} {...register("tags")} disabled={loading} />
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 block">Content <span className="text-destructive">*</span></label>
        <RichTextEditor content={content} onChange={(v) => { setContent(v); setContentError(""); }} />
        {contentError && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{contentError}</p>}
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 block">Featured Image <span className="text-muted-foreground font-normal">(Optional)</span></label>
        <ImageUploader onUpload={setImage} currentImage={image} aspectRatio="16/9" />
      </div>

      <div className="p-4 bg-muted/30 rounded-lg">
        <Switch checked={watch("isPublished") || false} onCheckedChange={(c) => setValue("isPublished", c)} disabled={loading} label="Published" />
      </div>

      <div className="flex items-center gap-3 pt-4 border-t">
        <Button type="submit" disabled={loading} size="lg" className="gap-2 min-w-[140px]">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : <>{watch("isPublished") ? <Send className="h-4 w-4" /> : <Save className="h-4 w-4" />}{isEditing ? "Update" : watch("isPublished") ? "Publish" : "Save Draft"}</>}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading} className="gap-2"><ArrowLeft className="h-4 w-4" />Cancel</Button>
      </div>
    </form>
  );
}