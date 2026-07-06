import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";
import { db } from "@/lib/db";
import { cache } from "react";
import { Camera, Image as ImageIcon, Images, Eye, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Explore moments captured from our vibrant school life and events.",
};

// ==========================================
// Data Fetching
// ==========================================
const getAlbums = cache(async () => {
  try {
    const [albums, totalImages] = await Promise.all([
      db.gallery.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        include: {
          images: { take: 2, orderBy: { order: "asc" } },
          _count: { select: { images: true } },
        },
      }),
      db.galleryImage.count(),
    ]);
    return { albums, totalImages };
  } catch {
    return { albums: [], totalImages: 0 };
  }
});

// ==========================================
// Gallery Page Component
// ==========================================
export default async function GalleryPage() {
  const { albums, totalImages } = await getAlbums();

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container-custom">
          <Breadcrumb items={[{ label: "Photo Gallery" }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              📸 Photo Gallery
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Our Gallery
            </h1>
            <p className="text-muted-foreground text-lg">
              A visual journey through our school life and activities
            </p>
            {totalImages > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {albums.length} album{albums.length !== 1 ? "s" : ""} ·{" "}
                {totalImages} photo{totalImages !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-custom">
          {albums.length === 0 ? (
            <EmptyState
              iconName="camera"
              title="No Photos Yet"
              description="We'll add photos from our school events and activities soon!"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {albums.map((album, index) => {
                const coverImage =
                  album.coverImage || album.images[0]?.url;
                const secondImage = album.images[1]?.url;

                return (
                  <Link
                    key={album.id}
                    href={`/gallery/${album.slug}`}
                    className="group block animate-fade-in"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <Card padding="none" className="overflow-hidden h-full">
                      {/* Image Section */}
                      <div className="relative">
                        {/* Main Image */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          {coverImage ? (
                            <img
                              src={coverImage}
                              alt={album.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                              <Images className="h-12 w-12 text-muted-foreground/40" />
                            </div>
                          )}

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                            <h3 className="text-white text-lg font-bold">
                              {album.title}
                            </h3>
                            {album.description && (
                              <p className="text-white/80 text-sm mt-1 line-clamp-2">
                                {album.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-3 text-white/90 text-sm font-medium">
                              <Eye className="h-4 w-4" />
                              <span>View Album</span>
                              <ChevronRight className="h-4 w-4" />
                            </div>
                          </div>
                        </div>

                        {/* Second Image Peek */}
                        {secondImage && (
                          <div className="absolute -bottom-2 -right-2 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-4 border-background shadow-xl rotate-6 group-hover:rotate-3 transition-transform duration-300">
                            <img
                              src={secondImage}
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}

                        {/* Photo Count */}
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white rounded-lg px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 shadow-lg">
                          <Images className="h-3 w-3" />
                          {album._count.images}
                        </div>
                      </div>

                      {/* Title Below */}
                      <div className="p-4">
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
                          {album.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {album._count.images} photo
                          {album._count.images !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}