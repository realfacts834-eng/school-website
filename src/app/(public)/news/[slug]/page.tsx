import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card, CardContent, CardBadge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { db } from "@/lib/db";
import { formatDate, timeAgo, readingTime } from "@/lib/utils";
import { generateArticleSchema } from "@/lib/seo";
import {
  Calendar,
  User,
  Clock,
  Eye,
  ArrowLeft,
  Tag,
  Share2,
  MessageCircle,
} from "lucide-react";
import { cache } from "react";

// ==========================================
// Types
// ==========================================
interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

// ==========================================
// Data Fetching
// ==========================================
const getNewsArticle = cache(async (slug: string) => {
  try {
    const news = await db.news.findUnique({
      where: { slug },
      include: { author: { select: { name: true, image: true } } },
    });
    return news;
  } catch {
    return null;
  }
});

// ==========================================
// Generate Metadata
// ==========================================
export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsArticle(slug);

  if (!news) {
    return { title: "News Not Found" };
  }

  return {
    title: news.title,
    description: news.excerpt || news.title,
    openGraph: {
      title: news.title,
      description: news.excerpt || undefined,
      type: "article",
      publishedTime: news.createdAt.toISOString(),
      authors: [news.author.name || "School Admin"],
      images: news.featuredImage ? [{ url: news.featuredImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: news.title,
      description: news.excerpt || undefined,
      images: news.featuredImage ? [news.featuredImage] : [],
    },
  };
}

// ==========================================
// News Detail Page Component
// ==========================================
export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const news = await getNewsArticle(slug);

  if (!news || !news.isPublished) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${siteUrl}/news/${news.slug}`;
  const readTime = readingTime(news.content || "");

  // JSON-LD Schema
  const articleSchema = generateArticleSchema({
    title: news.title,
    description: news.excerpt || undefined,
    image: news.featuredImage || undefined,
    url: `/news/${news.slug}`,
    publishedAt: news.createdAt.toISOString(),
    updatedAt: news.updatedAt.toISOString(),
    authorName: news.author.name || "School Admin",
  });

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container-custom">
          <Breadcrumb
            items={[
              { label: "News", href: "/news" },
              { label: news.title },
            ]}
          />
        </div>
      </div>

      <article className="py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to News
            </Link>

            {/* Featured Image */}
            {news.featuredImage && (
              <div className="relative aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden mb-8 shadow-lg">
                <img
                  src={news.featuredImage}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Header */}
            <header className="mb-8">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {news.isBreaking && (
                  <CardBadge variant="danger">Breaking News</CardBadge>
                )}
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  Article
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
                {news.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {/* Author */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold">
                    {news.author.name?.charAt(0) || "A"}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {news.author.name}
                    </p>
                    <p className="text-xs">Author</p>
                  </div>
                </div>

                <div className="w-px h-8 bg-border" />

                {/* Date & Time */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(news.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{timeAgo(news.createdAt)}</span>
                  </div>
                </div>

                <div className="w-px h-8 bg-border" />

                {/* Stats */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    <span>{news.viewCount.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{readTime} min read</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Excerpt */}
            {news.excerpt && (
              <div className="bg-muted/30 border-l-4 border-primary rounded-r-lg p-4 md:p-6 mb-8">
                <p className="text-lg md:text-xl text-muted-foreground italic leading-relaxed">
                  {news.excerpt}
                </p>
              </div>
            )}

            {/* Content */}
            <Card>
              <CardContent className="p-6 md:p-8 lg:p-10">
                <div
                  className="prose prose-lg dark:prose-invert max-w-none
                    prose-headings:font-heading prose-headings:scroll-mt-20
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-xl prose-img:shadow-md
                    prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                    prose-pre:bg-muted prose-pre:rounded-xl
                    prose-code:bg-muted prose-code:rounded prose-code:px-1"
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />
              </CardContent>
            </Card>

            {/* Tags */}
            <div className="flex items-center gap-3 mt-8">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs bg-muted px-2.5 py-1 rounded-full">
                  School News
                </span>
                <span className="text-xs bg-muted px-2.5 py-1 rounded-full">
                  Education
                </span>
              </div>
            </div>

            {/* Share & Actions */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Link href="/news">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to News
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <ShareButtons
                  title={news.title}
                  url={url}
                  variant="dropdown"
                />
              </div>
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
export const revalidate = 3600; // 1 hour