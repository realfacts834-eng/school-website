import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmpty } from "@/components/ui/table";
import { db } from "@/lib/db";
import { cache } from "react";
import { Plus, Edit, Users, Mail, Phone, GraduationCap, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Faculty Management",
};

// ==========================================
// Data Fetching
// ==========================================
const getFaculty = cache(async () => {
  try {
    const [faculty, totalCount, activeCount] = await Promise.all([
      db.faculty.findMany({ orderBy: { order: "asc" } }),
      db.faculty.count(),
      db.faculty.count({ where: { isActive: true } }),
    ]);
    return { faculty, totalCount, activeCount };
  } catch {
    return { faculty: [], totalCount: 0, activeCount: 0 };
  }
});

// ==========================================
// Admin Faculty Page Component
// ==========================================
export default async function AdminFacultyPage() {
  const { faculty, totalCount, activeCount } = await getFaculty();
  const inactiveCount = totalCount - activeCount;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Faculty Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage teachers and staff members
          </p>
        </div>
        <Link href="/admin/faculty/new">
          <Button className="gap-2 shadow-md">
            <Plus className="h-4 w-4" />
            Add Faculty
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
            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{inactiveCount}</p>
            <p className="text-xs text-muted-foreground">Inactive</p>
          </CardContent>
        </Card>
      </div>

      {/* Faculty Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            All Faculty ({totalCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {faculty.length === 0 ? (
            <TableEmpty
              colSpan={6}
              message="No faculty members yet"
              action={
                <Link href="/admin/faculty/new">
                  <Button size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Add Faculty
                  </Button>
                </Link>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Qualification</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faculty.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                          {item.name.charAt(0)}
                        </div>
                        <span>{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                        {item.designation}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.qualification ? (
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3.5 w-3.5" />
                          {item.qualification}
                        </span>
                      ) : "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="space-y-0.5">
                        {item.email && (
                          <a href={`mailto:${item.email}`} className="flex items-center gap-1 text-xs hover:text-primary">
                            <Mail className="h-3 w-3" />
                            {item.email}
                          </a>
                        )}
                        {item.phone && (
                          <a href={`tel:${item.phone}`} className="flex items-center gap-1 text-xs hover:text-primary">
                            <Phone className="h-3 w-3" />
                            {item.phone}
                          </a>
                        )}
                        {!item.email && !item.phone && "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          item.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                        )}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/faculty/${item.id}`} title="Edit">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
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