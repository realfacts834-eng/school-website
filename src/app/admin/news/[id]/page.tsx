import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NewsForm } from "../news-form";
import { db } from "@/lib/db";
import { ArrowLeft, Edit, ExternalLink } from "lucide-react";

// ==========================================
// Types
// ==========================================
interface EditNewsPageProps {
  params: Promise<{ id: string }>;
}

// ==========================================
// Generate Metadata
// ==========================================
export async function generateMetadata({
  params,
}: EditNewsPageProps): Promise<Metadata> {
  const { id } = await params;
  const news = await db.news.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: news ? `Edit: ${news.title}` : "Edit News",
  };
}

// ==========================================
// Edit News Page Component
// ==========================================
export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = await params;
  
  const news = await db.news.findUnique({
    where: { id },
  });

  if (!news) notFound();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/news">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Edit News</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update the news article details
          </p>
        </div>
        <Link href={`/news/${news.slug}`} target="_blank">
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            View Live
          </Button>
        </Link>
      </div>

      <Card className="shadow-md max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Edit className="h-4 w-4 text-primary" />
            {news.title}
          </CardTitle>
          <CardDescription>
            Last updated: {new Date(news.updatedAt).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewsForm initialData={news} />
        </CardContent>
      </Card>
    </div>
  );
}