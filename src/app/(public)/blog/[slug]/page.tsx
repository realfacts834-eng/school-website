import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card, CardContent, CardBadge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { db } from "@/lib/db";
import { formatDate, timeAgo, readingTime } from "@/lib/utils";
import { generateArticleSchema } from "@/lib/seo";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Eye,
  Tag,
} from "lucide-react";
import { cache } from "react";

// ==========================================
// Types
// ==========================================
interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

// ==========================================
// Data Fetching
// ==========================================
const getBlogPost = cache(async (slug: string) => {
  try {
    return await db.blog.findUnique({
      where: { slug },
      include: { author: { select: { name: true, image: true } } },
    });
  } catch {
    return null;
  }
});

// ==========================================
// Generate Metadata
// ==========================================
export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) return { title: "Blog Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author.name || "School Admin"],
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
    },
  };
}

// ==========================================
// Blog Detail Page Component
// ==========================================
export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post || !post.isPublished) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${siteUrl}/blog/${post.slug}`;
  const readTime = readingTime(post.content || "");

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container-custom">
          <Breadcrumb
            items={[
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />
        </div>
      </div>

      <article className="py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="relative aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden mb-8 shadow-lg">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Header */}
            <header className="mb-8">
              {/* Tags */}
              {post.tags && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.split(",").map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-muted px-2.5 py-1 rounded-full"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold">
                    {post.author.name?.charAt(0) || "A"}
                  </div>
                  <span className="font-medium text-foreground">
                    {post.author.name}
                  </span>
                </div>
                <div className="w-px h-8 bg-border" />
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(post.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  {post.viewCount} views
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {readTime} min read
                </span>
              </div>
            </header>

            {/* Content */}
            <Card>
              <CardContent className="p-6 md:p-8 lg:p-10">
                <div
                  className="prose prose-lg dark:prose-invert max-w-none
                    prose-headings:font-heading prose-headings:scroll-mt-20
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-xl prose-img:shadow-md"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </CardContent>
            </Card>

            {/* Share */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Link href="/blog">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
              <ShareButtons title={post.title} url={url} variant="dropdown" />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

export const revalidate = 3600;