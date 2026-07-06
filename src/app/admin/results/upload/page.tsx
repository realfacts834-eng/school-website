import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Award, Upload, FileText, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Upload Result",
};

export default function UploadResultPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/results">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Upload Result</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload a new examination result file
          </p>
        </div>
      </div>

      <Card className="shadow-md max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            Result Details
          </CardTitle>
          <CardDescription>
            Fill in the details and upload the result file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {/* Title */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g. Final Term Result 2026"
              />
            </div>

            {/* Class & Exam Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Class <span className="text-destructive">*</span>
                </label>
                <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-school-blue">
                  <option value="">Select class</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="F.Sc">F.Sc</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Exam Type <span className="text-destructive">*</span>
                </label>
                <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-school-blue">
                  <option value="">Select exam type</option>
                  <option value="Monthly Test">Monthly Test</option>
                  <option value="Mid Term">Mid Term</option>
                  <option value="Final Term">Final Term</option>
                  <option value="Pre-Board">Pre-Board</option>
                  <option value="Board Exam">Board Exam</option>
                </select>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Result File <span className="text-destructive">*</span>
              </label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/20">
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">
                  Drag & drop your file here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported formats: PDF, Excel, Word (Max 20MB)
                </p>
              </div>
            </div>

            {/* Published Toggle */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <Switch
                checked={true}
                label="Published"
                description="Make this result visible on the website"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button type="submit" size="lg" className="gap-2 min-w-[160px]">
                <Upload className="h-4 w-4" />
                Upload Result
              </Button>
              <Link href="/admin/results">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}