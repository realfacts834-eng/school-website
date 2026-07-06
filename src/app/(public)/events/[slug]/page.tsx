import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card, CardContent, CardBadge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { generateEventSchema } from "@/lib/seo";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Navigation,
  Users,
  Share2,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import { cache } from "react";

// ==========================================
// Types
// ==========================================
interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

// ==========================================
// Data Fetching
// ==========================================
const getEvent = cache(async (slug: string) => {
  try {
    return await db.event.findUnique({
      where: { slug },
      include: { author: { select: { name: true } } },
    });
  } catch {
    return null;
  }
});

// ==========================================
// Generate Metadata
// ==========================================
export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return { title: "Event Not Found" };
  }

  return {
    title: event.title,
    description: event.description?.substring(0, 160),
    openGraph: {
      title: event.title,
      description: event.description?.substring(0, 160),
      type: "article",
      images: event.image ? [{ url: event.image }] : [],
    },
  };
}

// ==========================================
// Helper
// ==========================================
function getEventStatus(date: Date): {
  label: string;
  variant: "warning" | "gold" | "success" | "danger";
  isPast: boolean;
} {
  const now = new Date();
  const eventDate = new Date(date);
  const diffDays = Math.ceil(
    (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0)
    return { label: "Past Event", variant: "danger", isPast: true };
  if (diffDays === 0)
    return { label: "Today", variant: "warning", isPast: false };
  if (diffDays === 1)
    return { label: "Tomorrow", variant: "warning", isPast: false };
  return { label: `In ${diffDays} days`, variant: "gold", isPast: false };
}

// ==========================================
// Event Detail Page Component
// ==========================================
export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event || !event.isPublished) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${siteUrl}/events/${event.slug}`;
  const status = getEventStatus(event.date);

  // JSON-LD Schema
  const eventSchema = generateEventSchema({
    title: event.title,
    description: event.description,
    image: event.image || undefined,
    url: `/events/${event.slug}`,
    startDate: event.date.toISOString(),
    endDate: event.endDate?.toISOString(),
    location: event.location || undefined,
  });

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container-custom">
          <Breadcrumb
            items={[
              { label: "Events", href: "/events" },
              { label: event.title },
            ]}
          />
        </div>
      </div>

      <article className="py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              All Events
            </Link>

            {/* Event Image */}
            {event.image && (
              <div className="relative aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden mb-8 shadow-lg">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <CardBadge
                  variant={
                    status.variant === "warning"
                      ? "danger"
                      : status.variant === "gold"
                        ? "warning"
                        : "success"
                  }
                >
                  {status.label}
                </CardBadge>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
                {event.title}
              </h1>

              {/* Event Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Date */}
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm font-semibold">
                      {formatDate(event.date)}
                      {event.endDate && ` - ${formatDate(event.endDate)}`}
                    </p>
                  </div>
                </div>

                {/* Time */}
                {event.time && (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-semibold">{event.time}</p>
                    </div>
                  </div>
                )}

                {/* Location */}
                {event.location && (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-semibold">{event.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </header>

            {/* Description */}
            <Card className="shadow-lg">
              <CardContent className="p-6 md:p-8 lg:p-10">
                <h2 className="text-xl font-bold mb-4">About This Event</h2>
                <div
                  className="prose prose-lg dark:prose-invert max-w-none
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-xl prose-img:shadow-md"
                >
                  {event.description}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {!status.isPast && (
              <div className="flex flex-wrap items-center gap-3 mt-8">
                {event.location && (
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(event.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="gap-2">
                      <Navigation className="h-4 w-4" />
                      Get Directions
                    </Button>
                  </a>
                )}
              </div>
            )}

            {/* Share & Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Link href="/events">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  All Events
                </Button>
              </Link>
              <ShareButtons
                title={event.title}
                url={url}
                variant="dropdown"
              />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

// ==========================================
// ISR Revalidation
// ==========================================
export const revalidate = 3600;