import { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { cache } from "react";
import {
  Award,
  Download,
  FileText,
  Calendar,
  GraduationCap,
  Star,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Exam Results",
  description: "View and download examination results and performance reports.",
};

// ==========================================
// Data Fetching
// ==========================================
const getResults = cache(async () => {
  try {
    const [results, totalCount] = await Promise.all([
      db.result.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      }),
      db.result.count({ where: { isPublished: true } }),
    ]);
    return { results, totalCount };
  } catch {
    return { results: [], totalCount: 0 };
  }
});

// ==========================================
// Results Page Component
// ==========================================
export default async function ResultsPage() {
  const { results, totalCount } = await getResults();

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container-custom">
          <Breadcrumb items={[{ label: "Results" }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              🏆 Academic Results
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Exam Results
            </h1>
            <p className="text-muted-foreground text-lg">
              View and download examination results and performance reports
            </p>
            {totalCount > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {totalCount} result{totalCount !== 1 ? "s" : ""} published
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-custom">
          {results.length === 0 ? (
            <EmptyState
              iconName="award"
              title="No Results Published"
              description="Examination results will be published here once available."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {results.map((result, index) => (
                <Card
                  key={result.id}
                  variant="interactive"
                  className="animate-fade-in group"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <CardContent className="p-6">
                    {/* Icon */}
                    <div className="p-3 rounded-xl bg-primary/10 inline-block mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Award className="h-6 w-6" />
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors">
                      {result.title}
                    </h3>

                    {/* Meta */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        <span>Class: <strong>{result.class}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Exam: <strong>{result.examType}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Published: {formatDate(result.createdAt)}</span>
                      </div>
                    </div>

                    {/* Download Button */}
                    <a
                      href={result.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex items-center gap-2 w-full justify-center",
                        "px-4 py-2.5 rounded-lg",
                        "bg-primary text-primary-foreground",
                        "hover:bg-primary/90",
                        "text-sm font-semibold",
                        "transition-all duration-200",
                        "shadow-md hover:shadow-lg"
                      )}
                    >
                      <Download className="h-4 w-4" />
                      Download Result
                      <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}