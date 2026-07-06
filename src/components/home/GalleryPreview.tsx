import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Camera, ImageIcon, ChevronRight, Images } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";
import { db } from "@/lib/db";
import { cache } from "react";

// ==========================================
// Data Fetching
// ==========================================
const getGalleryAlbums = cache(async () => {
  try {
    const [albums, totalAlbums] = await Promise.all([
      db.gallery.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          coverImage: true,
          _count: { select: { images: true } },
          images: {
            take: 2,
            orderBy: { order: "asc" },
            select: { url: true },
          },
        },
      }),
      db.gallery.count({ where: { isPublished: true } }),
    ]);
    return { albums, totalAlbums };
  } catch {
    return { albums: [], totalAlbums: 0 };
  }
});

// ==========================================
// GalleryPreview Component
// ==========================================
export async function GalleryPreview() {
  const { albums, totalAlbums } = await getGalleryAlbums();

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container-custom">
        <SectionHeading
          title="Photo Gallery"
          subtitle="Explore moments captured from our vibrant school life"
          align="center"
          action={albums.length > 0 ? { label: "View Full Gallery", href: "/gallery" } : undefined}
        />

        {albums.length === 0 ? (
          <EmptyState
            icon={<Camera className="h-16 w-16" />}
            title="No Photos Yet"
            description="We will add photos from our school events and activities soon!"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-10">
            {albums.map((album, index) => {
              const imageUrl = album.coverImage || album.images[0]?.url;
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
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={album.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                          </div>
                        )}

                        {/* Overlay on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                          <h3 className="text-white text-lg font-bold">{album.title}</h3>
                          {album.description && (
                            <p className="text-white/80 text-sm mt-1 line-clamp-2">
                              {album.description}
                            </p>
                          )}
                          <div className="flex items-center gap-1 mt-3 text-white/90 text-sm font-medium">
                            <span>View Album</span>
                            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>

                      {/* Second Image (Peek) */}
                      {secondImage && (
                        <div className="absolute -bottom-2 -right-2 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-4 border-background shadow-lg rotate-6 group-hover:rotate-3 transition-transform duration-300">
                          <img
                            src={secondImage}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* Photo Count Badge */}
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white rounded-lg px-2.5 py-1 text-xs font-medium flex items-center gap-1.5">
                        <Images className="h-3 w-3" />
                        {album._count.images} photos
                      </div>
                    </div>

                    {/* Title (Visible) */}
                    <div className="p-4">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
                        {album.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {album._count.images} photos
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        {totalAlbums > 6 && (
          <div className="text-center mt-10">
            <Link href="/gallery">
              <Button variant="outline" size="lg" className="group">
                Explore All {totalAlbums} Albums
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}