"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsSchema, type NewsFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  Loader2,
  Eye,
  Send,
  ArrowLeft,
  FileText,
  AlertCircle,
} from "lucide-react";

// ==========================================
// Types
// ==========================================
interface NewsFormProps {
  initialData?: {
    id: string;
    title: string;
    content: string;
    excerpt: string | null;
    featuredImage: string | null;
    isPublished: boolean;
    isBreaking: boolean;
  };
}

// ==========================================
// NewsForm Component
// ==========================================
export function NewsForm({ initialData }: NewsFormProps = {}) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(initialData?.content || "");
  const [image, setImage] = useState(initialData?.featuredImage || "");
  const [contentError, setContentError] = useState("");
  
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: initialData?.title || "",
      excerpt: initialData?.excerpt || "",
      isPublished: initialData?.isPublished || false,
      isBreaking: initialData?.isBreaking || false,
    },
  });

  const isPublished = watch("isPublished");
  const isBreaking = watch("isBreaking");

  const onSubmit = async (data: NewsFormData) => {
    // Validate content
    if (!content || content.length < 10) {
      setContentError("Content must be at least 10 characters");
      return;
    }
    setContentError("");

    setLoading(true);
    const payload = { ...data, content, featuredImage: image };

    try {
      const url = isEditing ? `/api/news/${initialData.id}` : "/api/news";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(isEditing ? "News updated successfully!" : "News created successfully!");
        router.push("/admin/news");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to save news");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label className="text-sm font-medium mb-1.5 block">
          Title <span className="text-destructive">*</span>
        </label>
        <Input
          placeholder="Enter news title"
          {...register("title")}
          error={errors.title?.message}
          disabled={loading}
        />
      </div>

      {/* Slug (Auto-generated info) */}
      <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
        <FileText className="h-3.5 w-3.5" />
        Slug will be auto-generated from the title
      </div>

      {/* Excerpt */}
      <div>
        <label className="text-sm font-medium mb-1.5 block">
          Excerpt <span className="text-muted-foreground font-normal">(Optional)</span>
        </label>
        <Input
          placeholder="Brief description for preview"
          {...register("excerpt")}
          disabled={loading}
        />
      </div>

      {/* Content */}
      <div>
        <label className="text-sm font-medium mb-1.5 block">
          Content <span className="text-destructive">*</span>
        </label>
        <RichTextEditor
          content={content}
          onChange={(value) => {
            setContent(value);
            setContentError("");
          }}
          placeholder="Write your news content here..."
        />
        {contentError && (
          <p className="text-xs text-destructive mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {contentError}
          </p>
        )}
      </div>

      {/* Featured Image */}
      <div>
        <label className="text-sm font-medium mb-1.5 block">
          Featured Image <span className="text-muted-foreground font-normal">(Optional)</span>
        </label>
        <ImageUploader
          onUpload={setImage}
          currentImage={image}
          aspectRatio="16/9"
          maxSize={5}
        />
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap items-center gap-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-3">
          <Switch
            checked={isPublished || false}
            onCheckedChange={(checked) => setValue("isPublished", checked)}
            disabled={loading}
            label="Published"
            description="Make this news visible on the website"
          />
        </div>
        <div className="w-px h-8 bg-border hidden sm:block" />
        <div className="flex items-center gap-3">
          <Switch
            checked={isBreaking || false}
            onCheckedChange={(checked) => setValue("isBreaking", checked)}
            disabled={loading}
            label="Breaking News"
            description="Highlight as urgent/breaking news"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <Button type="submit" disabled={loading} size="lg" className="gap-2 min-w-[140px]">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              {isPublished ? <Send className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {isEditing ? "Update" : isPublished ? "Publish" : "Save Draft"}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </Button>
      </div>
    </form>
  );
}