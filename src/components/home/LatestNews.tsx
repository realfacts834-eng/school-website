import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, User, Clock, Eye, Tag, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardImage, CardBadge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";
import { db } from "@/lib/db";
import { formatDate, timeAgo, readingTime, truncate } from "@/lib/utils";
import { cache } from "react";

// ==========================================
// Data Fetching
// ==========================================
const getLatestNews = cache(async () => {
  try {
    const news = await db.news.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 3,
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
    });
    return news;
  } catch {
    return [];
  }
});

// ==========================================
// LatestNews Component
// ==========================================
export async function LatestNews() {
  const news = await getLatestNews();

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container-custom">
        <SectionHeading
          title="Latest News"
          subtitle="Stay updated with the latest happenings, achievements, and announcements"
          align="center"
          action={{ label: "View All News", href: "/news" }}
        />

        {news.length === 0 ? (
          <EmptyState
            icon="Newspaper"
            title="No News Yet"
            description="We will post updates and announcements here. Check back soon!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-10">
            {news.map((item, index) => (
              <Link key={item.id} href={`/news/${item.slug}`} className="group block">
                <Card
                  variant="interactive"
                  padding="none"
                  className="h-full overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Featured Image */}
                  {item.featuredImage ? (
                    <CardImage
                      src={item.featuredImage}
                      alt={item.title}
                      aspectRatio="16/9"
                      overlay
                    />
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary/30">📰</span>
                    </div>
                  )}

                  <CardContent className="p-5 space-y-3">
                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.isBreaking && (
                        <CardBadge variant="danger">Breaking</CardBadge>
                      )}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeAgo(item.createdAt)}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.viewCount} views
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Excerpt */}
                    {item.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {truncate(item.excerpt, 130)}
                      </p>
                    )}

                    {/* Reading Time */}
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {readingTime(item.content || item.excerpt || "")} min read
                    </p>
                  </CardContent>

                  <CardFooter className="px-5 pb-5 pt-0">
                    <div className="flex items-center justify-between w-full">
                      {/* Author */}
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                          {item.author.name?.charAt(0) || "A"}
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">
                          {item.author.name}
                        </span>
                      </div>

                      {/* Read More */}
                      <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More
                        <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}