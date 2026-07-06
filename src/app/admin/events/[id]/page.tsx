import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventForm } from "../event-form";
import { db } from "@/lib/db";
import { ArrowLeft, Edit, ExternalLink } from "lucide-react";

// ==========================================
// Types
// ==========================================
interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

// ==========================================
// Generate Metadata
// ==========================================
export async function generateMetadata({
  params,
}: EditEventPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await db.event.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: event ? `Edit: ${event.title}` : "Edit Event",
  };
}

// ==========================================
// Edit Event Page Component
// ==========================================
export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const event = await db.event.findUnique({ where: { id } });

  if (!event) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update the event details
          </p>
        </div>
        {event.isPublished && (
          <Link href={`/events/${event.slug}`} target="_blank">
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View Live
            </Button>
          </Link>
        )}
      </div>

      <Card className="shadow-md max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Edit className="h-4 w-4 text-primary" />
            {event.title}
          </CardTitle>
          <CardDescription>
            Last updated: {new Date(event.updatedAt).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm initialData={event} />
        </CardContent>
      </Card>
    </div>
  );
}