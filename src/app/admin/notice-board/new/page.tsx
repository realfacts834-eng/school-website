import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Clipboard, Save, Send, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "Add Notice",
};

export default function NewNoticePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/notice-board">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Notice</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create a new notice or announcement
          </p>
        </div>
      </div>

      <Card className="shadow-md max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clipboard className="h-4 w-4 text-primary" />
            Notice Details
          </CardTitle>
          <CardDescription>
            Fill in the details below to create a new notice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {/* Title */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Enter notice title"
              />
            </div>

            {/* Content */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Content <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <Textarea
                placeholder="Enter notice details..."
                rows={5}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Attachment <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <p className="text-sm text-muted-foreground">
                  Click to upload PDF or document
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Max 10MB
                </p>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <Switch
                label="Urgent"
                description="Mark this notice as urgent to highlight it"
              />
              <div className="border-t border-border pt-4">
                <Switch
                  checked={true}
                  label="Published"
                  description="Make this notice visible on the website"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button type="submit" size="lg" className="gap-2 min-w-[140px]">
                <Send className="h-4 w-4" />
                Publish Notice
              </Button>
              <Button type="button" variant="outline" className="gap-2">
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <Link href="/admin/notice-board">
                <Button type="button" variant="ghost">
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