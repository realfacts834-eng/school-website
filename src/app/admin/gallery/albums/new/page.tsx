import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Image, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Album",
};

export default function NewAlbumPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/gallery">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Album</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create a new photo album and upload images
          </p>
        </div>
      </div>

      <Card className="shadow-md max-w-xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Image className="h-4 w-4 text-primary" />
            Album Details
          </CardTitle>
          <CardDescription>
            Fill in the album information below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Album Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Annual Sports Day 2026"
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-school-blue transition-all"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Description <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <textarea
                placeholder="Brief description of the album..."
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-school-blue resize-none transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Cover Image <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop or click to upload
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, WebP (Max 5MB)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Album
              </Button>
              <Link href="/admin/gallery">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}