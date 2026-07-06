"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  X,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ZoomIn,
  FileWarning,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ==========================================
// Types
// ==========================================
interface ImageUploaderProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  className?: string;
  aspectRatio?: "1/1" | "4/3" | "16/9";
  maxSize?: number; // in MB
  label?: string;
  error?: string;
  disabled?: boolean;
  showPreview?: boolean;
}

interface UploadState {
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
  message: string;
}

// ==========================================
// ImageUploader Component
// ==========================================
export function ImageUploader({
  onUpload,
  currentImage,
  className,
  aspectRatio = "16/9",
  maxSize = 5,
  label = "Upload Image",
  error,
  disabled = false,
  showPreview = true,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
    progress: 0,
    message: "",
  });
  const [showFullPreview, setShowFullPreview] = useState(false);

  // Update preview when currentImage changes
  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
      setUploadState({ status: "success", progress: 100, message: "" });
    }
  }, [currentImage]);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        let message = "File upload failed";

        if (error.code === "file-too-large") {
          message = `File is too large. Max size is ${maxSize}MB`;
        } else if (error.code === "file-invalid-type") {
          message = "Invalid file type. Please upload an image";
        }

        setUploadState({ status: "error", progress: 0, message });
        toast.error(message);
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
      if (!validTypes.includes(file.type)) {
        setUploadState({
          status: "error",
          progress: 0,
          message: "Unsupported format. Use JPG, PNG, WebP, or AVIF",
        });
        return;
      }

      setUploadState({ status: "uploading", progress: 0, message: "Uploading..." });

      // Create local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Simulate progress (for better UX)
      const progressInterval = setInterval(() => {
        setUploadState((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }));
      }, 200);

      // Upload to server
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);

        if (!res.ok) {
          throw new Error("Upload failed");
        }

        const data = await res.json();

        if (data.url) {
          setUploadState({
            status: "success",
            progress: 100,
            message: "Upload complete!",
          });
          onUpload(data.url);
          toast.success("Image uploaded successfully");

          // Reset success message after delay
          setTimeout(() => {
            setUploadState((prev) =>
              prev.status === "success" ? { ...prev, message: "" } : prev
            );
          }, 3000);
        } else {
          throw new Error("No URL returned");
        }
      } catch (error) {
        clearInterval(progressInterval);
        setUploadState({
          status: "error",
          progress: 0,
          message: "Upload failed. Please try again.",
        });
        toast.error("Upload failed. Please try again.");
      }
    },
    [onUpload, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".avif"],
    },
    maxFiles: 1,
    maxSize: maxSize * 1024 * 1024,
    disabled: disabled || uploadState.status === "uploading",
  });

  const handleRemove = () => {
    setPreview(null);
    setUploadState({ status: "idle", progress: 0, message: "" });
    onUpload("");
  };

  const handleRetry = () => {
    setUploadState({ status: "idle", progress: 0, message: "" });
  };

  const aspectClasses = {
    "1/1": "aspect-square",
    "4/3": "aspect-[4/3]",
    "16/9": "aspect-video",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Label */}
      {label && (
        <p className="text-sm font-medium text-foreground">{label}</p>
      )}

      {/* Preview Mode */}
      {showPreview && preview && uploadState.status !== "error" ? (
        <div className="relative group">
          <div
            className={cn(
              "relative overflow-hidden rounded-lg bg-muted",
              aspectClasses[aspectRatio]
            )}
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              {/* View Full */}
              <button
                type="button"
                onClick={() => setShowFullPreview(true)}
                className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                title="View full size"
              >
                <Maximize2 className="h-4 w-4 text-gray-700" />
              </button>

              {/* Remove */}
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              )}
            </div>

            {/* Upload status badge */}
            {uploadState.status === "uploading" && (
              <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span className="text-xs font-medium">
                  {uploadState.progress}%
                </span>
              </div>
            )}

            {uploadState.status === "success" && uploadState.message && (
              <div className="absolute top-2 left-2 bg-green-500/90 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                <span className="text-xs font-medium text-white">
                  Uploaded
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Dropzone */
        <div
          {...getRootProps()}
          className={cn(
            "relative border-2 border-dashed rounded-lg transition-all duration-200",
            "flex flex-col items-center justify-center",
            "cursor-pointer",
            aspectClasses[aspectRatio],
            isDragActive
              ? "border-primary bg-primary/5 scale-[1.02]"
              : uploadState.status === "error"
                ? "border-red-300 bg-red-50/50 dark:bg-red-950/10"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
            (disabled || uploadState.status === "uploading") &&
              "opacity-60 cursor-not-allowed",
            className
          )}
        >
          <input {...getInputProps()} />

          {/* Uploading State */}
          {uploadState.status === "uploading" ? (
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-muted" />
                <div
                  className="absolute inset-0 h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Uploading...
                </p>
                <p className="text-xs text-muted-foreground">
                  {uploadState.progress}%
                </p>
              </div>
            </div>
          ) : uploadState.status === "error" ? (
            /* Error State */
            <div className="flex flex-col items-center gap-3 px-4">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-950/50">
                <FileWarning className="h-6 w-6 text-red-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  Upload Failed
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {uploadState.message}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRetry();
                }}
                className="gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </Button>
            </div>
          ) : (
            /* Idle State */
            <div className="flex flex-col items-center gap-2 px-4 text-center">
              {isDragActive ? (
                <>
                  <div className="p-3 rounded-full bg-primary/10">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-primary">
                    Drop your image here
                  </p>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-muted">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WebP, AVIF (Max {maxSize}MB)
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error from parent */}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}

      {/* Full Preview Modal */}
      {showFullPreview && preview && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setShowFullPreview(false)}
        >
          <button
            onClick={() => setShowFullPreview(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <img
            src={preview}
            alt="Full Preview"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}