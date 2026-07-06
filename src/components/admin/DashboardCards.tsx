import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Newspaper,
  Calendar,
  FileText,
  GraduationCap,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { db } from "@/lib/db";
import { cache } from "react";
import { cn } from "@/lib/utils";

// ==========================================
// Data Fetching
// ==========================================
const getStats = cache(async () => {
  try {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      students,
      lastMonthStudents,
      faculty,
      news,
      lastMonthNews,
      events,
      lastMonthEvents,
      pendingAdmissions,
      gallery,
      subscribers,
      unreadMessages,
    ] = await Promise.all([
      db.admission.count({ where: { status: "approved" } }),
      db.admission.count({
        where: {
          status: "approved",
          createdAt: { lt: thisMonth },
        },
      }),
      db.faculty.count({ where: { isActive: true } }),
      db.news.count({ where: { isPublished: true } }),
      db.news.count({
        where: {
          isPublished: true,
          createdAt: { lt: thisMonth },
        },
      }),
      db.event.count({ where: { isPublished: true } }),
      db.event.count({
        where: {
          isPublished: true,
          createdAt: { lt: thisMonth },
        },
      }),
      db.admission.count({ where: { status: "pending" } }),
      db.gallery.count({ where: { isPublished: true } }),
      db.subscriber.count({ where: { isActive: true } }),
      db.contact.count({ where: { isRead: false } }),
    ]);

    return {
      students,
      lastMonthStudents,
      faculty,
      news,
      lastMonthNews,
      events,
      lastMonthEvents,
      pendingAdmissions,
      gallery,
      subscribers,
      unreadMessages,
    };
  } catch {
    return null;
  }
});

// ==========================================
// Helper: Calculate trend
// ==========================================
function getTrend(current: number, previous: number): {
  percentage: number;
  direction: "up" | "down" | "neutral";
} {
  if (previous === 0) {
    return current > 0
      ? { percentage: 100, direction: "up" }
      : { percentage: 0, direction: "neutral" };
  }

  const diff = ((current - previous) / previous) * 100;
  const direction = diff > 0 ? "up" : diff < 0 ? "down" : "neutral";

  return {
    percentage: Math.abs(Math.round(diff)),
    direction,
  };
}

// ==========================================
// DashboardCards Component
// ==========================================
export async function DashboardCards() {
  const stats = await getStats();

  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-8 w-16 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Students",
      value: stats.students,
      icon: GraduationCap,
      href: "/admin/admissions",
      trend: getTrend(stats.students, stats.lastMonthStudents),
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/50",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      label: "Faculty",
      value: stats.faculty,
      icon: Users,
      href: "/admin/faculty",
      trend: { percentage: 0, direction: "neutral" as const },
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/50",
      border: "border-green-200 dark:border-green-800",
    },
    {
      label: "Published News",
      value: stats.news,
      icon: Newspaper,
      href: "/admin/news",
      trend: getTrend(stats.news, stats.lastMonthNews),
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/50",
      border: "border-purple-200 dark:border-purple-800",
    },
    {
      label: "Events",
      value: stats.events,
      icon: Calendar,
      href: "/admin/events",
      trend: getTrend(stats.events, stats.lastMonthEvents),
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-950/50",
      border: "border-orange-200 dark:border-orange-800",
    },
    {
      label: "Pending Admissions",
      value: stats.pendingAdmissions,
      icon: FileText,
      href: "/admin/admissions",
      trend: { percentage: 0, direction: "neutral" as const },
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/50",
      border: "border-red-200 dark:border-red-800",
      highlight: stats.pendingAdmissions > 0,
    },
    {
      label: "Gallery Albums",
      value: stats.gallery,
      icon: ImageIcon,
      href: "/admin/gallery",
      trend: { percentage: 0, direction: "neutral" as const },
      color: "text-pink-600 dark:text-pink-400",
      bg: "bg-pink-50 dark:bg-pink-950/50",
      border: "border-pink-200 dark:border-pink-800",
    },
    {
      label: "Subscribers",
      value: stats.subscribers,
      icon: BookOpen,
      href: "/admin/analytics",
      trend: { percentage: 0, direction: "neutral" as const },
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-50 dark:bg-teal-950/50",
      border: "border-teal-200 dark:border-teal-800",
    },
    {
      label: "Unread Messages",
      value: stats.unreadMessages,
      icon: MessageSquare,
      href: "/admin/contact",
      trend: { percentage: 0, direction: "neutral" as const },
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/50",
      border: "border-indigo-200 dark:border-indigo-800",
      highlight: stats.unreadMessages > 0,
    },
  ];

  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Link key={card.label} href={card.href}>
          <Card
            className={cn(
              "relative overflow-hidden transition-all duration-300",
              "hover:shadow-lg hover:-translate-y-0.5",
              card.border && "border",
              card.border,
              card.highlight && "ring-1 ring-offset-1 ring-offset-background",
              card.highlight && card.color.replace("text-", "ring-")
            )}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {card.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl md:text-3xl font-bold tracking-tight">
                      {card.value.toLocaleString()}
                    </p>
                    {card.trend.direction !== "neutral" && (
                      <span
                        className={cn(
                          "flex items-center gap-0.5 text-xs font-semibold",
                          card.trend.direction === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        )}
                      >
                        {card.trend.direction === "up" ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {card.trend.percentage}%
                      </span>
                    )}
                  </div>
                </div>
                <div className={cn("p-2.5 rounded-xl", card.bg)}>
                  <card.icon className={cn("h-5 w-5", card.color)} />
                </div>
              </div>

              {/* Bottom trend bar */}
              {card.trend.direction !== "neutral" && (
                <div className="mt-3 flex items-center gap-1.5">
                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        card.trend.direction === "up"
                          ? "bg-green-500"
                          : "bg-red-500"
                      )}
                      style={{ width: `${Math.min(card.trend.percentage, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    vs last month
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}