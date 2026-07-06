import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventForm } from "../event-form";
import { ArrowLeft, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Add Event",
};

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Event</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create a new school event or activity
          </p>
        </div>
      </div>
      <Card className="shadow-md max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Event Details
          </CardTitle>
          <CardDescription>Fill in the details for the new event.</CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm />
        </CardContent>
      </Card>
    </div>
  );
}