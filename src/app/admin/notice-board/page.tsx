import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmpty } from "@/components/ui/table";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { cache } from "react";
import { Plus, Clipboard, Bell, FileText, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Notice Board Management",
};

// ==========================================
// Data Fetching
// ==========================================
const getNotices = cache(async () => {
  try {
    const [notices, totalCount, urgentCount, publishedCount] = await Promise.all([
      db.notice.findMany({ orderBy: [{ isUrgent: "desc" }, { createdAt: "desc" }] }),
      db.notice.count(),
      db.notice.count({ where: { isUrgent: true } }),
      db.notice.count({ where: { isPublished: true } }),
    ]);
    return { notices, totalCount, urgentCount, publishedCount };
  } catch {
    return { notices: [], totalCount: 0, urgentCount: 0, publishedCount: 0 };
  }
});

// ==========================================
// Admin Notice Board Page Component
// ==========================================
export default async function AdminNoticeBoardPage() {
  const { notices, totalCount, urgentCount, publishedCount } = await getNotices();
  const draftCount = totalCount - publishedCount;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notice Board</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage school notices and announcements
          </p>
        </div>
        <Link href="/admin/notice-board/new">
          <Button className="gap-2 shadow-md">
            <Plus className="h-4 w-4" />
            Add Notice
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{totalCount}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Bell className="h-3 w-3" /> Urgent
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{draftCount}</p>
            <p className="text-xs text-muted-foreground">Drafts</p>
          </CardContent>
        </Card>
      </div>

      {/* Notices Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clipboard className="h-4 w-4" />
            Notices ({totalCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notices.length === 0 ? (
            <TableEmpty
              colSpan={5}
              message="No notices yet"
              action={
                <Link href="/admin/notice-board/new">
                  <Button size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Create Notice
                  </Button>
                </Link>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[350px]">Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notices.map((item) => (
                  <TableRow
                    key={item.id}
                    className={cn(
                      item.isUrgent && "bg-red-50/30 dark:bg-red-950/5"
                    )}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {item.isUrgent && (
                          <Bell className="h-4 w-4 text-red-500 animate-pulse shrink-0" />
                        )}
                        <div>
                          <span className={cn(item.isUrgent && "text-red-700 dark:text-red-400")}>
                            {item.title}
                          </span>
                          {item.content && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {item.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.isUrgent ? (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">
                          Urgent
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
                          Normal
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          item.isPublished
                            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                        )}
                      >
                        {item.isPublished ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {item.fileUrl && (
                          <a href={item.fileUrl} target="_blank" title="View file">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                        <Link href={`/admin/notice-board/${item.id}`} title="Edit">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}