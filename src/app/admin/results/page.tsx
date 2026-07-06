import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmpty } from "@/components/ui/table";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { cache } from "react";
import { Plus, Award, Download, ExternalLink, Edit, Trash2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Results Management",
};

// ==========================================
// Data Fetching
// ==========================================
const getResults = cache(async () => {
  try {
    const [results, totalCount, publishedCount] = await Promise.all([
      db.result.findMany({ orderBy: { createdAt: "desc" } }),
      db.result.count(),
      db.result.count({ where: { isPublished: true } }),
    ]);
    return { results, totalCount, publishedCount };
  } catch {
    return { results: [], totalCount: 0, publishedCount: 0 };
  }
});

// ==========================================
// Admin Results Page Component
// ==========================================
export default async function AdminResultsPage() {
  const { results, totalCount, publishedCount } = await getResults();
  const draftCount = totalCount - publishedCount;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Results Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload and manage examination results
          </p>
        </div>
        <Link href="/admin/results/upload">
          <Button className="gap-2 shadow-md">
            <Plus className="h-4 w-4" />
            Upload Result
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{totalCount}</p>
            <p className="text-xs text-muted-foreground">Total Results</p>
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

      {/* Results Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-4 w-4" />
            Results ({totalCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <TableEmpty
              colSpan={6}
              message="No results published yet"
              action={
                <Link href="/admin/results/upload">
                  <Button size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Upload First Result
                  </Button>
                </Link>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Title</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Exam Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{item.class}</TableCell>
                    <TableCell className="text-sm">{item.examType}</TableCell>
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
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Download"
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
                        <Link href={`/admin/results/${item.id}`} title="Edit">
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