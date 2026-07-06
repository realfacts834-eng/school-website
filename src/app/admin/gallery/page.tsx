import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { cache } from "react";
import { Plus, Image, Images, ExternalLink, Edit, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Gallery Management",
};

// ==========================================
// Data Fetching
// ==========================================
const getAlbums = cache(async () => {
  try {
    const [albums, totalCount, totalImages] = await Promise.all([
      db.gallery.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { images: true } } },
      }),
      db.gallery.count(),
      db.galleryImage.count(),
    ]);
    return { albums, totalCount, totalImages };
  } catch {
    return { albums: [], totalCount: 0, totalImages: 0 };
  }
});

// ==========================================
// Admin Gallery Page Component
// ==========================================
export default async function AdminGalleryPage() {
  const { albums, totalCount, totalImages } = await getAlbums();
  const publishedCount = albums.filter((a) => a.isPublished).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gallery Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage photo albums and images
          </p>
        </div>
        <Link href="/admin/gallery/albums/new">
          <Button className="gap-2 shadow-md">
            <Plus className="h-4 w-4" />
            New Album
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{totalCount}</p>
            <p className="text-xs text-muted-foreground">Albums</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{totalImages}</p>
            <p className="text-xs text-muted-foreground">Total Photos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
      </div>

      {/* Albums Grid */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Image className="h-4 w-4" />
            Albums ({totalCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {albums.length === 0 ? (
            <div className="text-center py-12">
              <Image className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">No albums created yet</p>
              <Link href="/admin/gallery/albums/new">
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Create First Album
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="group border border-border rounded-xl overflow-hidden bg-card hover:shadow-lg transition-all duration-300"
                >
                  {/* Cover Image */}
                  <div className="relative h-40 bg-muted overflow-hidden">
                    {album.coverImage ? (
                      <img
                        src={album.coverImage}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-accent/10">
                        <Image className="h-12 w-12 text-muted-foreground/40" />
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Images className="h-3 w-3" />
                        {album._count.images}
                      </span>
                      {!album.isPublished && (
                        <span className="bg-yellow-500/90 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                          <EyeOff className="h-3 w-3" />
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate mb-1">{album.title}</h3>
                    {album.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {album.description}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground mb-3">
                      Created {formatDate(album.createdAt)}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-1.5">
                      <Link href={`/admin/gallery/albums/${album.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                          <Edit className="h-3 w-3" />
                          Manage
                        </Button>
                      </Link>
                      {album.isPublished && (
                        <Link href={`/gallery/${album.slug}`} target="_blank">
                          <Button variant="ghost" size="sm" className="text-xs gap-1 px-2">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}