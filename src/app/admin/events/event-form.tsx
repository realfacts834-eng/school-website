"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, type EventFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  Loader2,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Send,
} from "lucide-react";

// ==========================================
// Types
// ==========================================
interface EventFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string;
    date: Date;
    endDate: Date | null;
    time: string | null;
    location: string | null;
    image: string | null;
    isPublished: boolean;
  };
}

// ==========================================
// EventForm Component
// ==========================================
export function EventForm({ initialData }: EventFormProps = {}) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(initialData?.image || "");
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      date: initialData?.date
        ? new Date(initialData.date).toISOString().split("T")[0]
        : "",
      endDate: initialData?.endDate
        ? new Date(initialData.endDate).toISOString().split("T")[0]
        : "",
      time: initialData?.time || "",
      location: initialData?.location || "",
      isPublished: initialData?.isPublished || false,
    },
  });

  const isPublished = watch("isPublished");

  const onSubmit = async (data: EventFormData) => {
    setLoading(true);
    const payload = {
      ...data,
      image,
      date: new Date(data.date).toISOString(),
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
    };

    try {
      const url = isEditing ? `/api/events/${initialData.id}` : "/api/events";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(isEditing ? "Event updated!" : "Event created!");
        router.push("/admin/events");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to save event");
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
          Event Title <span className="text-destructive">*</span>
        </label>
        <Input
          placeholder="Enter event title"
          {...register("title")}
          error={errors.title?.message}
          disabled={loading}
        />
      </div>

      {/* Date & Time Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Start Date <span className="text-destructive">*</span>
          </label>
          <Input
            type="date"
            leftIcon={<Calendar className="h-4 w-4" />}
            {...register("date")}
            error={errors.date?.message}
            disabled={loading}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            End Date <span className="text-muted-foreground font-normal">(Optional)</span>
          </label>
          <Input
            type="date"
            leftIcon={<Calendar className="h-4 w-4" />}
            {...register("endDate")}
            disabled={loading}
          />
        </div>
      </div>

      {/* Time & Location Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Time <span className="text-muted-foreground font-normal">(Optional)</span>
          </label>
          <Input
            placeholder="e.g. 10:00 AM - 2:00 PM"
            leftIcon={<Clock className="h-4 w-4" />}
            {...register("time")}
            disabled={loading}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Location <span className="text-muted-foreground font-normal">(Optional)</span>
          </label>
          <Input
            placeholder="e.g. School Auditorium"
            leftIcon={<MapPin className="h-4 w-4" />}
            {...register("location")}
            disabled={loading}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium mb-1.5 block">
          Description <span className="text-destructive">*</span>
        </label>
        <Textarea
          placeholder="Describe the event details..."
          rows={4}
          {...register("description")}
          error={errors.description?.message}
          disabled={loading}
        />
      </div>

      {/* Image */}
      <div>
        <label className="text-sm font-medium mb-1.5 block">
          Event Image <span className="text-muted-foreground font-normal">(Optional)</span>
        </label>
        <ImageUploader
          onUpload={setImage}
          currentImage={image}
          aspectRatio="16/9"
          maxSize={5}
        />
      </div>

      {/* Published Toggle */}
      <div className="p-4 bg-muted/30 rounded-lg">
        <Switch
          checked={isPublished || false}
          onCheckedChange={(checked) => setValue("isPublished", checked)}
          disabled={loading}
          label="Published"
          description="Make this event visible on the website"
        />
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