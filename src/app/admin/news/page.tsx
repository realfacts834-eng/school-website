import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableEmpty,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { cache } from "react";
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  Newspaper,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";
import { DeleteNewsButton } from "./delete-button";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "News Management",
};

// ==========================================
// Data Fetching
// ==========================================
const getNews = cache(async () => {
  try {
    const [news, totalCount, publishedCount, draftCount] = await Promise.all([
      db.news.findMany({
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } },
      }),
      db.news.count(),
      db.news.count({ where: { isPublished: true } }),
      db.news.count({ where: { isPublished: false } }),
    ]);
    return { news, totalCount, publishedCount, draftCount };
  } catch {
    return { news: [], totalCount: 0, publishedCount: 0, draftCount: 0 };
  }
});

// ==========================================
// Admin News Page Component
// ==========================================
export default async function AdminNewsPage() {
  const { news, totalCount, publishedCount, draftCount } = await getNews();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">News Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, edit, and manage school news articles
          </p>
        </div>
        <Link href="/admin/news/new">
          <Button className="gap-2 shadow-md">
            <Plus className="h-4 w-4" />
            Add News
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{totalCount}</p>
            <p className="text-xs text-muted-foreground">Total</p>
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

      {/* News Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              All News ({totalCount})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {news.length === 0 ? (
            <TableEmpty
              colSpan={6}
              message="No news articles yet"
              action={
                <Link href="/admin/news/new">
                  <Button size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Create First News
                  </Button>
                </Link>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium max-w-[300px]">
                      <div className="flex items-center gap-2">
                        {item.isBreaking && (
                          <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 px-1.5 py-0.5 rounded font-bold">
                            BREAKING
                          </span>
                        )}
                        <span className="truncate">{item.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.author.name}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          item.isPublished
                            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                        }`}
                      >
                        {item.isPublished ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.viewCount}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/news/${item.slug}`}
                          target="_blank"
                          title="View on site"
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/news/${item.id}`} title="Edit">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DeleteNewsButton id={item.id} />
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