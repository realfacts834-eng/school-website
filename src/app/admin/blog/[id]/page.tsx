import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlogForm } from "../blog-form";
import { db } from "@/lib/db";
import { ArrowLeft, Edit, ExternalLink } from "lucide-react";

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditBlogPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await db.blog.findUnique({ where: { id }, select: { title: true } });
  return { title: post ? `Edit: ${post.title}` : "Edit Blog" };
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const post = await db.blog.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog"><Button variant="ghost" size="icon" className="h-9 w-9"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Edit Blog Post</h1>
          <p className="text-sm text-muted-foreground mt-1">Update blog post details</p>
        </div>
        {post.isPublished && <Link href={`/blog/${post.slug}`} target="_blank"><Button variant="outline" size="sm" className="gap-2"><ExternalLink className="h-4 w-4" />View Live</Button></Link>}
      </div>
      <Card className="shadow-md max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Edit className="h-4 w-4 text-primary" />{post.title}</CardTitle>
          <CardDescription>Last updated: {new Date(post.updatedAt).toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent><BlogForm initialData={post} /></CardContent>
      </Card>
    </div>
  );
}