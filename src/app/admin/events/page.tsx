import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmpty } from "@/components/ui/table";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { cache } from "react";
import { Plus, Edit, Trash2, Calendar, Clock, ExternalLink } from "lucide-react";
import { DeleteEventButton } from "./delete-button";
import { cn } from "@/lib/utils";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Events Management",
};

// ==========================================
// Data Fetching
// ==========================================
const getEvents = cache(async () => {
  try {
    const [events, totalCount, upcomingCount, pastCount] = await Promise.all([
      db.event.findMany({ orderBy: { date: "asc" } }),
      db.event.count(),
      db.event.count({ where: { date: { gte: new Date() } } }),
      db.event.count({ where: { date: { lt: new Date() } } }),
    ]);
    return { events, totalCount, upcomingCount, pastCount };
  } catch {
    return { events: [], totalCount: 0, upcomingCount: 0, pastCount: 0 };
  }
});

// ==========================================
// Admin Events Page Component
// ==========================================
export default async function AdminEventsPage() {
  const { events, totalCount, upcomingCount, pastCount } = await getEvents();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage school events and activities
          </p>
        </div>
        <Link href="/admin/events/new">
          <Button className="gap-2 shadow-md">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{totalCount}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{upcomingCount}</p>
            <p className="text-xs text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-muted-foreground">{pastCount}</p>
            <p className="text-xs text-muted-foreground">Past</p>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            All Events ({totalCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <TableEmpty
              colSpan={5}
              message="No events yet"
              action={
                <Link href="/admin/events/new">
                  <Button size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Create First Event
                  </Button>
                </Link>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((item) => {
                  const isPast = new Date(item.date) < new Date();
                  return (
                    <TableRow key={item.id} className={cn(isPast && "opacity-60")}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {formatDate(item.date)}
                        </div>
                        {item.time && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                            <Clock className="h-3 w-3" />
                            {item.time}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.location || "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium",
                            item.isPublished
                              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                          )}
                        >
                          {item.isPublished ? "Published" : "Draft"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {item.isPublished && (
                            <Link href={`/events/${item.slug}`} target="_blank" title="View on site">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                          <Link href={`/admin/events/${item.id}`} title="Edit">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DeleteEventButton id={item.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}