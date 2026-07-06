import Link from "next/link";
import { Megaphone, ArrowRight, AlertTriangle, X } from "lucide-react";
import { db } from "@/lib/db";
import { cache } from "react";
import { cn } from "@/lib/utils";

// ==========================================
// Data Fetching
// ==========================================
const getTickerData = cache(async () => {
  try {
    const [breakingNews, urgentNotices] = await Promise.all([
      db.news.findMany({
        where: { isPublished: true, isBreaking: true },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, slug: true },
      }),
      db.notice.findMany({
        where: { isPublished: true, isUrgent: true },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { id: true, title: true },
      }),
    ]);

    // Combine: urgent notices first, then breaking news
    const allItems = [
      ...urgentNotices.map((n) => ({
        id: n.id,
        title: `📋 ${n.title}`,
        href: "/notice-board",
        type: "notice" as const,
      })),
      ...breakingNews.map((n) => ({
        id: n.id,
        title: n.title,
        href: `/news/${n.slug}`,
        type: "news" as const,
      })),
    ];

    return allItems;
  } catch {
    return [];
  }
});

// ==========================================
// NewsTicker Component
// ==========================================
export async function NewsTicker() {
  const items = await getTickerData();

  if (items.length === 0) return null;

  // Duplicate items for seamless infinite scroll
  const tickerItems = [...items, ...items];

  return (
    <div className="relative bg-primary text-primary-foreground overflow-hidden">
      <div className="container-custom flex items-center gap-3 py-2">
        {/* Label */}
        <div className="flex items-center gap-2 shrink-0 z-10 bg-primary pr-3">
          <div className="relative">
            <Megaphone className="h-4 w-4 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
            Breaking News
          </span>
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-primary-foreground/20 shrink-0 hidden sm:block" />

        {/* Scrolling Content */}
        <div className="overflow-hidden flex-1 relative">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none" />

          <div className="flex gap-12 animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
            {tickerItems.map((item, index) => (
              <Link
                key={`${item.id}-${index}`}
                href={item.href}
                className={cn(
                  "text-sm inline-flex items-center gap-1.5 group",
                  "hover:underline underline-offset-2",
                  "transition-opacity"
                )}
              >
                {item.type === "notice" && (
                  <AlertTriangle className="h-3 w-3 text-yellow-400 shrink-0" />
                )}
                <span className="truncate max-w-[400px]">{item.title}</span>
                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}