import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Clock, ChevronRight, Users, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge"; // If not available, inline
import { db } from "@/lib/db";
import { formatDate, timeAgo } from "@/lib/utils";
import { cache } from "react";

// ==========================================
// Data Fetching
// ==========================================
const getUpcomingEvents = cache(async () => {
  try {
    const [events, totalCount] = await Promise.all([
      db.event.findMany({
        where: {
          isPublished: true,
          date: { gte: new Date() },
        },
        orderBy: { date: "asc" },
        take: 4,
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
      db.event.count({
        where: {
          isPublished: true,
          date: { gte: new Date() },
        },
      }),
    ]);
    return { events, totalCount };
  } catch {
    return { events: [], totalCount: 0 };
  }
});

// ==========================================
// Helper
// ==========================================
function getEventStatus(date: Date, endDate?: Date | null): {
  label: string;
  variant: "warning" | "success" | "gold";
} {
  const now = new Date();
  const eventDate = new Date(date);
  const diffDays = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { label: "Today", variant: "warning" };
  if (diffDays === 1) return { label: "Tomorrow", variant: "warning" };
  if (diffDays <= 7) return { label: `In ${diffDays} days`, variant: "gold" };
  return { label: "Upcoming", variant: "success" };
}

// ==========================================
// UpcomingEvents Component
// ==========================================
export async function UpcomingEvents() {
  const { events, totalCount } = await getUpcomingEvents();

  return (
    <section className="py-16 md:py-20">
      <div className="container-custom">
        <SectionHeading
          title="Upcoming Events"
          subtitle="Mark your calendar for these exciting upcoming activities"
          align="center"
          action={events.length > 0 ? { label: "View All Events", href: "/events" } : undefined}
        />

        {events.length === 0 ? (
          <EmptyState
            icon="Calendar"
            title="No Upcoming Events"
            description="New events will be scheduled soon. Check back later!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mt-10">
            {events.map((event, index) => {
              const eventDate = new Date(event.date);
              const status = getEventStatus(event.date, event.endDate);

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card variant="interactive" padding="none" className="h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Date Box */}
                        <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl bg-primary/5 border border-primary/10 flex flex-col items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                          <span className="text-xl md:text-2xl font-bold leading-none">
                            {eventDate.getDate()}
                          </span>
                          <span className="text-[10px] md:text-xs uppercase font-medium mt-1">
                            {eventDate.toLocaleString("en-US", { month: "short" })}
                          </span>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="text-base md:text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
                              {event.title}
                            </h3>
                            {/* Status Badge */}
                            <span
                              className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                status.variant === "warning"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : status.variant === "gold"
                                    ? "bg-school-gold/20 text-school-gold"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {status.label}
                            </span>
                          </div>

                          {event.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                              {event.description}
                            </p>
                          )}

                          <div className="space-y-1.5 text-xs md:text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
                              <span>
                                {formatDate(event.date)}
                                {event.endDate && (
                                  <> - {formatDate(event.endDate)}</>
                                )}
                              </span>
                            </div>
                            {event.time && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                                <span>{event.time}</span>
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            )}
                          </div>

                          {/* Read More */}
                          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                            Event Details
                            <ChevronRight className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* More Events Indicator */}
        {totalCount > 4 && (
          <div className="text-center mt-8">
            <Link href="/events">
              <Button variant="outline" size="lg" className="group">
                View All {totalCount} Events
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}