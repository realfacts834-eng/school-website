import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NewsForm } from "../news-form";
import { ArrowLeft, Newspaper } from "lucide-react";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Add News",
};

// ==========================================
// New News Page Component
// ==========================================
export default function NewNewsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/news">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add News Article</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and publish a new news article
          </p>
        </div>
      </div>

      <Card className="shadow-md max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-primary" />
            News Details
          </CardTitle>
          <CardDescription>
            Fill in the details below to create a news article.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewsForm />
        </CardContent>
      </Card>
    </div>
  );
}