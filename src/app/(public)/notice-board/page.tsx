import { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardBadge } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { cache } from "react";
import {
  Clipboard,
  AlertCircle,
  FileText,
  Download,
  Calendar,
  Megaphone,
  Bell,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Notice Board",
  description: "View important announcements, notices, and updates from our school.",
};

// ==========================================
// Data Fetching
// ==========================================
const getNotices = cache(async () => {
  try {
    const [notices, totalCount, urgentCount] = await Promise.all([
      db.notice.findMany({
        where: { isPublished: true },
        orderBy: [{ isUrgent: "desc" }, { createdAt: "desc" }],
      }),
      db.notice.count({ where: { isPublished: true } }),
      db.notice.count({ where: { isPublished: true, isUrgent: true } }),
    ]);
    return { notices, totalCount, urgentCount };
  } catch {
    return { notices: [], totalCount: 0, urgentCount: 0 };
  }
});

// ==========================================
// Notice Board Page Component
// ==========================================
export default async function NoticeBoardPage() {
  const { notices, totalCount, urgentCount } = await getNotices();

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container-custom">
          <Breadcrumb items={[{ label: "Notice Board" }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              📋 Announcements
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Notice Board
            </h1>
            <p className="text-muted-foreground text-lg">
              Stay informed with important announcements and updates
            </p>
            <div className="flex items-center justify-center gap-4 mt-3 text-sm text-muted-foreground">
              {totalCount > 0 && (
                <span>{totalCount} notice{totalCount !== 1 ? "s" : ""}</span>
              )}
              {urgentCount > 0 && (
                <span className="flex items-center gap-1 text-red-500 font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {urgentCount} urgent
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-custom">
          {notices.length === 0 ? (
            <EmptyState
              iconName="bell"
              title="No Notices"
              description="There are no notices at the moment. Check back later."
            />
          ) : (
            <div className="max-w-3xl mx-auto space-y-3">
              {notices.map((notice, index) => (
                <Card
                  key={notice.id}
                  className={cn(
                    "animate-fade-in overflow-hidden transition-all duration-300",
                    notice.isUrgent
                      ? "border-l-4 border-l-red-500 bg-red-50/30 dark:bg-red-950/10"
                      : "hover:shadow-md"
                  )}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={cn(
                          "p-2 rounded-lg shrink-0 mt-0.5",
                          notice.isUrgent
                            ? "bg-red-100 dark:bg-red-950/50"
                            : "bg-primary/10"
                        )}
                      >
                        {notice.isUrgent ? (
                          <Bell className="h-4 w-4 text-red-500 animate-pulse" />
                        ) : (
                          <Megaphone className="h-4 w-4 text-primary" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h3
                            className={cn(
                              "font-semibold text-sm",
                              notice.isUrgent && "text-red-600 dark:text-red-400"
                            )}
                          >
                            {notice.title}
                          </h3>
                          {notice.isUrgent && (
                            <CardBadge variant="danger">Urgent</CardBadge>
                          )}
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                          <Calendar className="h-3 w-3" />
                          {formatDate(notice.createdAt)}
                        </div>

                        {/* Content */}
                        {notice.content && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {notice.content}
                          </p>
                        )}

                        {/* File Download */}
                        {notice.fileUrl && (
                          <a
                            href={notice.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-primary hover:underline bg-primary/5 px-3 py-1.5 rounded-lg transition-colors hover:bg-primary/10"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download Attachment
                            <ArrowRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}