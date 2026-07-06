import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardImage, CardBadge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { formatDate, timeAgo, readingTime } from "@/lib/utils";
import { cache } from "react";
import {
  Calendar,
  User,
  ArrowRight,
  PenSquare,
  Clock,
  Eye,
  Tag,
} from "lucide-react";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Blog",
  description: "Read insightful articles, educational tips, and school updates.",
};

// ==========================================
// Data Fetching
// ==========================================
const getBlogPosts = cache(async () => {
  try {
    const [posts, totalCount] = await Promise.all([
      db.blog.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          featuredImage: true,
          tags: true,
          viewCount: true,
          createdAt: true,
          author: { select: { name: true, image: true } },
        },
      }),
      db.blog.count({ where: { isPublished: true } }),
    ]);
    return { posts, totalCount };
  } catch {
    return { posts: [], totalCount: 0 };
  }
});

// ==========================================
// Blog Page Component
// ==========================================
export default async function BlogPage() {
  const { posts, totalCount } = await getBlogPosts();

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container-custom">
          <Breadcrumb items={[{ label: "Blog" }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              ✍️ Blog
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Our Blog
            </h1>
            <p className="text-muted-foreground text-lg">
              Read insightful articles, educational tips, and updates
            </p>
            {totalCount > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {totalCount} article{totalCount !== 1 ? "s" : ""} published
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-custom">
          {posts.length === 0 ? (
            <EmptyState
              iconName="news"
              title="No Blog Posts Yet"
              description="Check back soon for insightful articles and updates."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {posts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block animate-fade-in"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <Card variant="interactive" padding="none" className="h-full overflow-hidden">
                    {/* Image */}
                    {post.featuredImage ? (
                      <CardImage
                        src={post.featuredImage}
                        alt={post.title}
                        aspectRatio="16/9"
                        overlay
                      />
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
                        <PenSquare className="h-12 w-12 text-primary/30" />
                      </div>
                    )}

                    <CardContent className="p-5">
                      {/* Tags */}
                      {post.tags && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {post.tags.split(",").slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                            {post.author.name?.charAt(0) || "A"}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {post.author.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.viewCount}
                          </span>
                          <span>
                            {readingTime(post.content || "")} min read
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Load More (if needed) */}
          {totalCount > posts.length && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="gap-2">
                Load More Articles
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}