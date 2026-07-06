import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlogForm } from "../blog-form";
import { ArrowLeft, PenSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Add Blog Post",
};

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Blog Post</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create a new blog article
          </p>
        </div>
      </div>
      <Card className="shadow-md max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <PenSquare className="h-4 w-4 text-primary" />
            Blog Details
          </CardTitle>
          <CardDescription>Write your blog content below.</CardDescription>
        </CardHeader>
        <CardContent>
          <BlogForm />
        </CardContent>
      </Card>
    </div>
  );
}