import { Metadata } from "next";
import Link from "next/link";
import { DashboardCards } from "@/components/admin/DashboardCards";
import { db } from "@/lib/db";
import { formatDate, timeAgo } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Newspaper,
  Calendar,
  Users,
  MessageSquare,
  ArrowRight,
  Plus,
  Eye,
  Bell,
  FileText,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

// پروجیکٹ کو مجبور کرنا کہ وہ ہمیشہ لائیو ڈیٹا دکھائے اور اسٹیٹک کیشے نہ بنائے
export const dynamic = "force-dynamic";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Admin dashboard overview",
};

// ==========================================
// Data Fetching
// ==========================================
async function getDashboardData() {
  try {
    const [
      recentNews,
      upcomingEvents,
      recentAdmissions,
      recentContacts,
      unreadMessages,
    ] = await Promise.all([
      db.news.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          createdAt: true,
          isPublished: true,
        },
      }),
      db.event.findMany({
        where: { date: { gte: new Date() } },
        orderBy: { date: "asc" },
        take: 5,
        select: { id: true, title: true, date: true },
      }),
      db.admission.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          studentName: true,
          applyingClass: true,
          status: true,
          createdAt: true,
        },
      }),
      db.contact.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          subject: true,
          isRead: true,
          createdAt: true,
        },
      }),
      db.contact.count({ where: { isRead: false } }),
    ]);
    return {
      recentNews,
      upcomingEvents,
      recentAdmissions,
      recentContacts,
      unreadMessages,
    };
  } catch (error) {
    console.error("❌ Failed to fetch dashboard metrics:", error);
    return {
      recentNews: [],
      upcomingEvents: [],
      recentAdmissions: [],
      recentContacts: [],
      unreadMessages: 0,
    };
  }
}

// ==========================================
// Quick Actions
// ==========================================
const quickActions = [
  { label: "Add News", href: "/admin/news/new", icon: Plus },
  { label: "Add Event", href: "/admin/events/new", icon: Plus },
  { label: "Add Notice", href: "/admin/notice-board/new", icon: Plus },
  { label: "Upload Result", href: "/admin/results/upload", icon: Plus },
];

// ==========================================
// Dashboard Page Component
// ==========================================
export default async function DashboardPage() {
  const {
    recentNews,
    upcomingEvents,
    recentAdmissions,
    recentContacts,
    unreadMessages,
  } = await getDashboardData();

  const statusBadge = (status: string) => {
    const styles = {
      approved: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
      rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
      waitlist: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    };
    return styles[status as keyof typeof styles] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back! Here&apos;s your overview.
          </p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button size="sm" variant="outline" className="gap-1.5 whitespace-nowrap">
                <action.icon className="h-3.5 w-3.5" />
                <span>{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardCards />

      {/* Unread Alert */}
      {unreadMessages > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
          <Bell className="h-4 w-4 text-blue-600" />
          <span>
            You have <strong>{unreadMessages}</strong> unread message
            {unreadMessages !== 1 ? "s" : ""}.
          </span>
          <Link
            href="/admin/contact"
            className="ml-auto text-blue-600 hover:underline text-xs font-medium"
          >
            View →
          </Link>
        </div>
      )}

      {/* Recent Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent News */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2 font-semibold">
                <Newspaper className="h-4 w-4 text-blue-600" />
                Recent News
              </CardTitle>
              <Link
                href="/admin/news"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentNews.length === 0 ? (
              <div className="text-center py-6">
                <Newspaper className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No news articles yet</p>
                <Link href="/admin/news/new">
                  <Button size="sm" variant="outline" className="mt-3 gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    Create First News
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {recentNews.map((item) => (
                  <Link
                    key={item.id}
                    href={`/admin/news/${item.id}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {!item.isPublished && (
                        <Eye className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                      )}
                      <span className="text-sm truncate">{item.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {timeAgo(item.createdAt)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2 font-semibold">
                <Calendar className="h-4 w-4 text-green-600" />
                Upcoming Events
              </CardTitle>
              <Link
                href="/admin/events"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No upcoming events</p>
                <Link href="/admin/events/new">
                  <Button size="sm" variant="outline" className="mt-3 gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    Create Event
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {upcomingEvents.map((item) => (
                  <Link
                    key={item.id}
                    href={`/admin/events/${item.id}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm truncate">{item.title}</span>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {formatDate(item.date)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Admissions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2 font-semibold">
                <Users className="h-4 w-4 text-purple-600" />
                Recent Applications
              </CardTitle>
              <Link
                href="/admin/admissions"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentAdmissions.length === 0 ? (
              <div className="text-center py-6">
                <FileText className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No applications yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentAdmissions.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <span className="text-sm font-medium truncate block">
                        {item.studentName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.applyingClass}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ml-2 uppercase tracking-wider",
                        statusBadge(item.status)
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2 font-semibold">
                <MessageSquare className="h-4 w-4 text-orange-600" />
                Recent Messages
                {unreadMessages > 0 && (
                  <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">
                    {unreadMessages}
                  </span>
                )}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {recentContacts.length === 0 ? (
              <div className="text-center py-6">
                <Mail className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentContacts.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium truncate">
                          {item.name}
                        </span>
                        {!item.isRead && (
                          <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground truncate block">
                        {item.subject}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {timeAgo(item.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
