import { db } from "@/lib/db";
import { cache } from "react";
import { MapPin, ExternalLink, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ==========================================
// Data Fetching
// ==========================================
const getMapData = cache(async () => {
  try {
    const settings = await db.siteSetting.findFirst();
    return {
      mapEmbedUrl: settings?.mapEmbedUrl,
      address: settings?.address,
      schoolName: settings?.schoolName,
    };
  } catch {
    return null;
  }
});

// ==========================================
// GoogleMap Component
// ==========================================
export async function GoogleMap() {
  const data = await getMapData();

  if (!data?.mapEmbedUrl) return null;

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            Our Location
          </h2>
          {data.address && (
            <p className="text-muted-foreground flex items-center justify-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm md:text-base">{data.address}</span>
            </p>
          )}
        </div>

        {/* Map Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-border group">
          {/* Map iframe */}
          <div className="aspect-[16/9] md:aspect-[21/9] lg:h-[450px]">
            <iframe
              src={data.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${data.schoolName || "School"} Location`}
              className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
            />
          </div>

          {/* Overlay with CTA */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(data.address || "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="secondary" className="shadow-lg gap-1.5">
                <Navigation className="h-3.5 w-3.5" />
                Get Directions
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-3">
            Visit us at our campus or contact us for more information
          </p>
          <Link href="/contact">
            <Button variant="outline" size="sm">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}