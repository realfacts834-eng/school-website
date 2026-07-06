import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmpty } from "@/components/ui/table";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { cache } from "react";
import { FileText, Users, Clock, CheckCircle2, XCircle, User, Phone, Mail } from "lucide-react";
import { AdmissionActions } from "./admission-actions";
import { cn } from "@/lib/utils";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Admissions Management",
};

// ==========================================
// Data Fetching
// ==========================================
const getAdmissions = cache(async () => {
  try {
    const [applications, total, pending, approved, rejected] = await Promise.all([
      db.admission.findMany({ orderBy: { createdAt: "desc" } }),
      db.admission.count(),
      db.admission.count({ where: { status: "pending" } }),
      db.admission.count({ where: { status: "approved" } }),
      db.admission.count({ where: { status: "rejected" } }),
    ]);
    return { applications, total, pending, approved, rejected };
  } catch {
    return { applications: [], total: 0, pending: 0, approved: 0, rejected: 0 };
  }
});

// ==========================================
// Status Badge Config
// ==========================================
const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  pending: { bg: "bg-yellow-100 dark:bg-yellow-950/50", text: "text-yellow-700 dark:text-yellow-400", icon: <Clock className="h-3.5 w-3.5" /> },
  approved: { bg: "bg-green-100 dark:bg-green-950/50", text: "text-green-700 dark:text-green-400", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  rejected: { bg: "bg-red-100 dark:bg-red-950/50", text: "text-red-700 dark:text-red-400", icon: <XCircle className="h-3.5 w-3.5" /> },
  waitlist: { bg: "bg-blue-100 dark:bg-blue-950/50", text: "text-blue-700 dark:text-blue-400", icon: <Clock className="h-3.5 w-3.5" /> },
};

// ==========================================
// Admin Admissions Page Component
// ==========================================
export default async function AdminAdmissionsPage() {
  const { applications, total, pending, approved, rejected } = await getAdmissions();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admissions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage student admission applications
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <FileText className="h-3 w-3" /> Total
            </p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{pending}</p>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" /> Pending
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{approved}</p>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Approved
            </p>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{rejected}</p>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <XCircle className="h-3 w-3" /> Rejected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Applications ({total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <TableEmpty
              colSpan={6}
              message="No admission applications yet"
              icon={<Users className="h-12 w-12" />}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((item) => {
                  const status = statusConfig[item.status] || statusConfig.pending;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p>{item.studentName}</p>
                          <p className="text-xs text-muted-foreground">
                            F/O: {item.fatherName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{item.applyingClass}</TableCell>
                      <TableCell className="text-sm">
                        <div className="space-y-0.5">
                          <span className="flex items-center gap-1 text-xs">
                            <Phone className="h-3 w-3" />
                            {item.phone}
                          </span>
                          {item.email && (
                            <span className="flex items-center gap-1 text-xs">
                              <Mail className="h-3 w-3" />
                              {item.email}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1",
                            status.bg,
                            status.text
                          )}
                        >
                          {status.icon}
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <AdmissionActions id={item.id} status={item.status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}