import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmpty } from "@/components/ui/table";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { cache } from "react";
import { Plus, Edit, Trash2, PenSquare, ExternalLink, Eye } from "lucide-react";
import { DeleteBlogButton } from "./delete-button";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Blog Management",
};

// ==========================================
// Data Fetching
// ==========================================
const getBlogPosts = cache(async () => {
  try {
    const [posts, totalCount, publishedCount] = await Promise.all([
      db.blog.findMany({
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } },
      }),
      db.blog.count(),
      db.blog.count({ where: { isPublished: true } }),
    ]);
    return { posts, totalCount, publishedCount };
  } catch {
    return { posts: [], totalCount: 0, publishedCount: 0 };
  }
});

// ==========================================
// Admin Blog Page Component
// ==========================================
export default async function AdminBlogPage() {
  const { posts, totalCount, publishedCount } = await getBlogPosts();
  const draftCount = totalCount - publishedCount;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage blog posts
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="gap-2 shadow-md">
            <Plus className="h-4 w-4" />
            Add Blog Post
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

      {/* Blog Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <PenSquare className="h-4 w-4" />
            All Posts ({totalCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <TableEmpty
              colSpan={6}
              message="No blog posts yet"
              action={
                <Link href="/admin/blog/new">
                  <Button size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Create First Post
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
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-[300px] truncate">
                      {post.title}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {post.author.name}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          post.isPublished
                            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                        }`}
                      >
                        {post.isPublished ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {post.viewCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(post.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {post.isPublished && (
                          <Link href={`/blog/${post.slug}`} target="_blank" title="View on site">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        <Link href={`/admin/blog/${post.id}`} title="Edit">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DeleteBlogButton id={post.id} title={post.title} />
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