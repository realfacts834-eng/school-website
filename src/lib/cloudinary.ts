import { v2 as cloudinary } from "cloudinary";

// ==========================================
// Cloudinary Configuration
// ==========================================
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ==========================================
// Upload Options
// ==========================================
interface UploadOptions {
  folder?: string;
  publicId?: string;
  transformation?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  };
}

// ==========================================
// Image Upload with Optimization
// ==========================================
export async function uploadImage(
  file: File | Buffer,
  options: UploadOptions = {}
): Promise<{ url: string; publicId: string; format: string; width: number; height: number }> {
  try {
    // Convert to base64
    let base64: string;

    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
    } else {
      base64 = `data:image/webp;base64,${file.toString("base64")}`;
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: options.folder || "school-website",
      public_id: options.publicId,
      resource_type: "auto",
      transformation: [
        {
          quality: options.transformation?.quality || "auto",
          fetch_format: options.transformation?.format || "auto",
          width: options.transformation?.width,
          height: options.transformation?.height,
          crop: "limit",
        },
      ],
      allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);
    throw new Error(
      error instanceof Error 
        ? `Upload failed: ${error.message}` 
        : "Upload failed. Please try again."
    );
  }
}

// ==========================================
// Multiple Images Upload
// ==========================================
export async function uploadMultipleImages(
  files: File[],
  options: UploadOptions = {}
): Promise<Array<{ url: string; publicId: string }>> {
  try {
    const uploads = files.map((file) => uploadImage(file, options));
    const results = await Promise.all(uploads);
    return results.map(({ url, publicId }) => ({ url, publicId }));
  } catch (error) {
    console.error("❌ Multiple upload failed:", error);
    throw new Error("Failed to upload multiple images");
  }
}

// ==========================================
// Delete Image
// ==========================================
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === "ok") {
      console.log(`✅ Deleted: ${publicId}`);
      return true;
    }
    
    console.warn(`⚠️ Delete returned: ${result.result}`);
    return false;
  } catch (error) {
    console.error("❌ Cloudinary delete failed:", error);
    return false;
  }
}

// ==========================================
// Delete Multiple Images
// ==========================================
export async function deleteMultipleImages(publicIds: string[]): Promise<boolean> {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    const deleted = Object.values(result.deleted).filter(
      (status) => status === "deleted"
    ).length;
    
    console.log(`✅ Deleted ${deleted}/${publicIds.length} images`);
    return deleted === publicIds.length;
  } catch (error) {
    console.error("❌ Multiple delete failed:", error);
    return false;
  }
}

// ==========================================
// Delete Image by URL
// ==========================================
export async function deleteImageByUrl(url: string): Promise<boolean> {
  try {
    // Extract public ID from URL
    const urlParts = url.split("/");
    const uploadIndex = urlParts.indexOf("upload");
    
    if (uploadIndex === -1) {
      console.error("❌ Invalid Cloudinary URL");
      return false;
    }

    // Get everything after 'upload/' excluding version and extension
    const pathParts = urlParts.slice(uploadIndex + 1);
    // Remove version if present (v1234567890)
    if (pathParts[0]?.startsWith("v")) {
      pathParts.shift();
    }
    // Join and remove extension
    const publicId = pathParts.join("/").replace(/\.[^/.]+$/, "");

    return await deleteImage(publicId);
  } catch (error) {
    console.error("❌ Delete by URL failed:", error);
    return false;
  }
}

// ==========================================
// Get Image Info
// ==========================================
export async function getImageInfo(publicId: string) {
  try {
    const result = await cloudinary.api.resource(publicId);
    return {
      url: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes,
      createdAt: result.created_at,
    };
  } catch (error) {
    console.error("❌ Get image info failed:", error);
    return null;
  }
}

// ==========================================
// Generate Optimized URL
// ==========================================
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "avif" | "auto";
  } = {}
): string {
  const transformations = [];
  
  if (options.width || options.height) {
    transformations.push(`c_limit,w_${options.width || "auto"},h_${options.height || "auto"}`);
  }
  
  transformations.push(`q_${options.quality || "auto"}`);
  transformations.push(`f_${options.format || "auto"}`);

  const transformationStr = transformations.join(",");
  
  return cloudinary.url(publicId, {
    transformation: transformationStr,
    secure: true,
  });
}

// ==========================================
// Placeholder URL
// ==========================================
export function getPlaceholderUrl(text: string = "School"): string {
  return `https://placehold.co/600x400/0F172A/D4AF37?text=${encodeURIComponent(text)}`;
}

export { cloudinary };