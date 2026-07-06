import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { db } from "@/lib/db";
import { ArrowLeft, Edit, Save, User, Mail, Phone, GraduationCap, Briefcase, Award } from "lucide-react";

// ==========================================
// Types
// ==========================================
interface EditFacultyPageProps {
  params: Promise<{ id: string }>;
}

// ==========================================
// Generate Metadata
// ==========================================
export async function generateMetadata({
  params,
}: EditFacultyPageProps): Promise<Metadata> {
  const { id } = await params;
  const faculty = await db.faculty.findUnique({
    where: { id },
    select: { name: true },
  });

  return {
    title: faculty ? `Edit: ${faculty.name}` : "Edit Faculty",
  };
}

// ==========================================
// Edit Faculty Page Component
// ==========================================
export default async function EditFacultyPage({ params }: EditFacultyPageProps) {
  const { id } = await params;
  const faculty = await db.faculty.findUnique({ where: { id } });

  if (!faculty) notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/faculty">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Faculty</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update faculty member details
          </p>
        </div>
      </div>

      <Card className="shadow-md max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Edit className="h-4 w-4 text-primary" />
            {faculty.name}
          </CardTitle>
          <CardDescription>
            Last updated: {new Date(faculty.updatedAt).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {/* Profile Image */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Profile Image
              </label>
              <ImageUploader
                currentImage={faculty.image || undefined}
                onUpload={() => {}}
                aspectRatio="1/1"
              />
            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Full Name <span className="text-destructive">*</span>
              </label>
              <Input
                defaultValue={faculty.name}
                placeholder="Full name"
                leftIcon={<User className="h-4 w-4" />}
              />
            </div>

            {/* Designation & Qualification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Designation <span className="text-destructive">*</span>
                </label>
                <Input
                  defaultValue={faculty.designation}
                  placeholder="e.g. Principal"
                  leftIcon={<Briefcase className="h-4 w-4" />}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Qualification
                </label>
                <Input
                  defaultValue={faculty.qualification || ""}
                  placeholder="e.g. Ph.D. in Education"
                  leftIcon={<GraduationCap className="h-4 w-4" />}
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Experience
              </label>
              <Input
                defaultValue={faculty.experience || ""}
                placeholder="e.g. 15+ years"
                leftIcon={<Award className="h-4 w-4" />}
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Email
                </label>
                <Input
                  defaultValue={faculty.email || ""}
                  type="email"
                  placeholder="email@school.edu.pk"
                  leftIcon={<Mail className="h-4 w-4" />}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Phone
                </label>
                <Input
                  defaultValue={faculty.phone || ""}
                  placeholder="+92 300 1234567"
                  leftIcon={<Phone className="h-4 w-4" />}
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Bio
              </label>
              <Textarea
                defaultValue={faculty.bio || ""}
                placeholder="Brief biography..."
                rows={3}
              />
            </div>

            {/* Active Status */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <Switch
                checked={faculty.isActive}
                label="Active"
                description="Show this faculty member on the website"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Link href="/admin/faculty">
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