import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardBadge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { formatDate, timeAgo } from "@/lib/utils";
import { cache } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CalendarDays,
  ArrowRight,
  Navigation,
  Users,
  Star,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Events & Activities",
  description: "Discover upcoming and past events at our school.",
};

// ==========================================
// Data Fetching
// ==========================================
const getEvents = cache(async () => {
  try {
    const now = new Date();
    const [upcoming, past, totalCount] = await Promise.all([
      db.event.findMany({
        where: { isPublished: true, date: { gte: now } },
        orderBy: { date: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          date: true,
          endDate: true,
          time: true,
          location: true,
          image: true,
        },
      }),
      db.event.findMany({
        where: { isPublished: true, date: { lt: now } },
        orderBy: { date: "desc" },
        take: 3,
        select: {
          id: true,
          title: true,
          slug: true,
          date: true,
          image: true,
        },
      }),
      db.event.count({ where: { isPublished: true } }),
    ]);
    return { upcoming, past, totalCount };
  } catch {
    return { upcoming: [], past: [], totalCount: 0 };
  }
});

// ==========================================
// Helper
// ==========================================
function getEventStatus(date: Date): {
  label: string;
  variant: "warning" | "gold" | "success";
} {
  const now = new Date();
  const eventDate = new Date(date);
  const diffDays = Math.ceil(
    (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return { label: "Today", variant: "warning" };
  if (diffDays === 1) return { label: "Tomorrow", variant: "warning" };
  if (diffDays <= 7) return { label: `In ${diffDays} days`, variant: "gold" };
  return { label: "Upcoming", variant: "success" };
}

// ==========================================
// Events Page Component
// ==========================================
export default async function EventsPage() {
  const { upcoming, past, totalCount } = await getEvents();

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container-custom">
          <Breadcrumb items={[{ label: "Events & Activities" }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              📅 Events & Activities
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              School Events
            </h1>
            <p className="text-muted-foreground text-lg">
              Mark your calendar for these exciting events
            </p>
            {totalCount > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {totalCount} event{totalCount !== 1 ? "s" : ""} total
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-custom">
          {upcoming.length === 0 && past.length === 0 ? (
            <EmptyState
              iconName="calendar"
              title="No Events Scheduled"
              description="Check back later for upcoming events and activities."
            />
          ) : (
            <div className="space-y-12">
              {/* Upcoming Events */}
              {upcoming.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-950/50">
                      <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-xl font-bold">Upcoming Events</h2>
                    <span className="text-sm text-muted-foreground">
                      ({upcoming.length})
                    </span>
                  </div>

                  <div className="space-y-3">
                    {upcoming.map((event, index) => {
                      const status = getEventStatus(event.date);
                      const eventDate = new Date(event.date);

                      return (
                        <Link
                          key={event.id}
                          href={`/events/${event.slug}`}
                          className="block animate-fade-in"
                          style={{ animationDelay: `${index * 60}ms` }}
                        >
                          <Card
                            variant="interactive"
                            className="overflow-hidden"
                          >
                            <CardContent className="p-0">
                              <div className="flex flex-col sm:flex-row">
                                {/* Date Box */}
                                <div className="sm:w-24 flex sm:flex-col items-center justify-center gap-2 sm:gap-0 p-4 sm:p-0 bg-primary/5 border-b sm:border-b-0 sm:border-r border-border group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                  <span className="text-2xl sm:text-3xl font-bold leading-none">
                                    {eventDate.getDate()}
                                  </span>
                                  <span className="text-xs sm:text-sm uppercase font-medium">
                                    {eventDate.toLocaleString("en-US", {
                                      month: "short",
                                    })}
                                  </span>
                                </div>

                                {/* Details */}
                                <div className="flex-1 p-4 sm:p-5">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                                          {event.title}
                                        </h3>
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
                                      {event.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                          {event.description}
                                        </p>
                                      )}
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                                  </div>

                                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                      <Calendar className="h-3.5 w-3.5 text-primary" />
                                      {formatDate(event.date)}
                                      {event.endDate &&
                                        ` - ${formatDate(event.endDate)}`}
                                    </span>
                                    {event.time && (
                                      <span className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-primary" />
                                        {event.time}
                                      </span>
                                    )}
                                    {event.location && (
                                      <span className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-primary" />
                                        {event.location}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Past Events */}
              {past.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-1.5 rounded-md bg-muted">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-bold">Past Events</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {past.map((event, index) => (
                      <Link
                        key={event.id}
                        href={`/events/${event.slug}`}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 80}ms` }}
                      >
                        <Card variant="interactive" padding="none">
                          {event.image ? (
                            <div className="aspect-video overflow-hidden rounded-t-xl">
                              <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          ) : (
                            <div className="aspect-video bg-muted flex items-center justify-center rounded-t-xl">
                              <CalendarDays className="h-8 w-8 text-muted-foreground/40" />
                            </div>
                          )}
                          <div className="p-4">
                            <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                              {event.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(event.date)}
                            </p>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}