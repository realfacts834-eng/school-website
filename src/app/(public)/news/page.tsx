import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardFooter, CardImage, CardBadge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { formatDate, timeAgo, readingTime, truncate } from "@/lib/utils";
import { cache } from "react";
import {
  Calendar,
  User,
  ArrowRight,
  Newspaper,
  Search,
  Eye,
  Clock,
  Tag,
  TrendingUp,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "News & Updates",
  description: "Stay updated with the latest news, announcements, and events from our school.",
};

// ==========================================
// Data Fetching
// ==========================================
const getNews = cache(async () => {
  try {
    const [news, totalCount] = await Promise.all([
      db.news.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          featuredImage: true,
          isBreaking: true,
          viewCount: true,
          createdAt: true,
          author: { select: { name: true, image: true } },
        },
      }),
      db.news.count({ where: { isPublished: true } }),
    ]);
    return { news, totalCount };
  } catch {
    return { news: [], totalCount: 0 };
  }
});

// ==========================================
// News Page Component
// ==========================================
export default async function NewsPage() {
  const { news, totalCount } = await getNews();

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container-custom">
          <Breadcrumb items={[{ label: "News & Updates" }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              📰 News & Updates
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Latest News
            </h1>
            <p className="text-muted-foreground text-lg">
              Stay informed about everything happening at our school
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
          {news.length === 0 ? (
            <EmptyState
              icon={<Newspaper className="h-16 w-16" />}
              iconName="news"
              title="No News Yet"
              description="We'll post updates and announcements here. Check back soon!"
            />
          ) : (
            <>
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search news..."
                    className="pl-9"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span>Sort by: Latest</span>
                </div>
              </div>

              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {news.map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.slug}`}
                    className="group block animate-fade-in"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <Card variant="interactive" padding="none" className="h-full overflow-hidden">
                      {/* Image */}
                      {item.featuredImage ? (
                        <CardImage
                          src={item.featuredImage}
                          alt={item.title}
                          aspectRatio="16/9"
                          overlay
                        />
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
                          <Newspaper className="h-12 w-12 text-primary/30" />
                        </div>
                      )}

                      <CardContent className="p-5">
                        {/* Badges */}
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          {item.isBreaking && (
                            <CardBadge variant="danger">Breaking</CardBadge>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {timeAgo(item.createdAt)}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h3>

                        {/* Excerpt */}
                        {item.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {item.excerpt}
                          </p>
                        )}

                        {/* Meta */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                              {item.author.name?.charAt(0) || "A"}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {item.author.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {item.viewCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {readingTime(item.content || "")} min
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Load More */}
              {totalCount > news.length && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg" className="gap-2">
                    Load More News
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}