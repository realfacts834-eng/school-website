import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { ArrowLeft, Plus, Trash2, ExternalLink, Image, Edit } from "lucide-react";

// ==========================================
// Types
// ==========================================
interface AlbumDetailPageProps {
  params: Promise<{ id: string }>;
}

// ==========================================
// Generate Metadata
// ==========================================
export async function generateMetadata({
  params,
}: AlbumDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const album = await db.gallery.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: album ? `Album: ${album.title}` : "Album Details",
  };
}

// ==========================================
// Album Detail Page Component
// ==========================================
export default async function AlbumDetailPage({ params }: AlbumDetailPageProps) {
  const { id } = await params;

  const album = await db.gallery.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!album) notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/gallery">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{album.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {album.images.length} photo{album.images.length !== 1 ? "s" : ""} 
            {album.description && ` • ${album.description}`}
          </p>
        </div>
        {album.isPublished && (
          <Link href={`/gallery/${album.slug}`} target="_blank">
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View Album
            </Button>
          </Link>
        )}
      </div>

      {/* Album Info */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Edit className="h-4 w-4 text-primary" />
                Album Details
              </CardTitle>
              <CardDescription>
                Created: {new Date(album.createdAt).toLocaleDateString()}
                {album.updatedAt !== album.createdAt &&
                  ` • Updated: ${new Date(album.updatedAt).toLocaleDateString()}`}
              </CardDescription>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Photos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {album.images.length === 0 ? (
            <div className="text-center py-12">
              <Image className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">No photos in this album yet</p>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Upload Photos
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {album.images.map((image) => (
                <div
                  key={image.id}
                  className="relative group aspect-square rounded-lg overflow-hidden bg-muted shadow-sm"
                >
                  <img
                    src={image.url}
                    alt={image.caption || "Photo"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                    <button
                      className="p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      title="Delete photo"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-white" />
                    </button>
                  </div>

                  {/* Caption */}
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="text-white text-[10px] truncate">{image.caption}</p>
                    </div>
                  )}

                  {/* Order Number */}
                  <span className="absolute top-1.5 left-1.5 bg-black/50 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {image.order || 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}