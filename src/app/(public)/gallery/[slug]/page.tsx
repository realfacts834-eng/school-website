import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { EmptyState } from "@/components/shared/EmptyState";
import { db } from "@/lib/db";
import { cache } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  X,
  Image as ImageIcon,
  Calendar,
  Camera,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Types
// ==========================================
interface GalleryDetailPageProps {
  params: Promise<{ slug: string }>;
}

// ==========================================
// Data Fetching
// ==========================================
const getAlbum = cache(async (slug: string) => {
  try {
    const album = await db.gallery.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });
    return album;
  } catch {
    return null;
  }
});

// ==========================================
// Generate Metadata
// ==========================================
export async function generateMetadata({
  params,
}: GalleryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const album = await getAlbum(slug);

  if (!album) {
    return { title: "Album Not Found" };
  }

  return {
    title: album.title,
    description: album.description || `Photo album: ${album.title}`,
    openGraph: {
      title: album.title,
      description: album.description || undefined,
      images: album.coverImage ? [{ url: album.coverImage }] : [],
    },
  };
}

// ==========================================
// Gallery Detail Page Component
// ==========================================
export default async function GalleryDetailPage({
  params,
}: GalleryDetailPageProps) {
  const { slug } = await params;
  const album = await getAlbum(slug);

  if (!album || !album.isPublished) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${siteUrl}/gallery/${album.slug}`;
  const images = album.images;

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container-custom">
          <Breadcrumb
            items={[
              { label: "Gallery", href: "/gallery" },
              { label: album.title },
            ]}
          />
        </div>
      </div>

      <div className="py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              All Albums
            </Link>

            {/* Header */}
            <div className="mb-10">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                    {album.title}
                  </h1>
                  {album.description && (
                    <p className="text-muted-foreground text-lg max-w-2xl">
                      {album.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4" />
                      {images.length} photo{images.length !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {new Date(album.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <ShareButtons
                  title={album.title}
                  url={url}
                  variant="dropdown"
                />
              </div>
            </div>

            {/* Images Grid */}
            {images.length === 0 ? (
              <EmptyState
                iconName="camera"
                title="No Photos"
                description="No photos have been added to this album yet."
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {images.map((image, index) => (
                  <a
                    key={image.id}
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-muted shadow-sm group-hover:shadow-lg transition-all duration-300">
                      <img
                        src={image.url}
                        alt={image.caption || `Photo ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <Maximize2 className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      {/* Caption */}
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-white text-xs truncate">
                            {image.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t">
              <Link href="/gallery">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  All Albums
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ==========================================
// ISR Revalidation
// ==========================================
export const revalidate = 3600;