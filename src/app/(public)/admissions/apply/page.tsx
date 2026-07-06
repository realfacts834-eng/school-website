import { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdmissionForm } from "./admission-form";
import { db } from "@/lib/db";
import { cache } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Users,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Apply Now - Admissions",
  description: "Submit your admission application for the 2026-27 academic year.",
  robots: { index: true, follow: true },
};

// ==========================================
// Data Fetching
// ==========================================
const getPageData = cache(async () => {
  try {
    const [settings, studentCount] = await Promise.all([
      db.siteSetting.findFirst(),
      db.admission.count({ where: { status: "approved" } }),
    ]);
    return { settings, studentCount };
  } catch {
    return { settings: null, studentCount: 0 };
  }
});

// ==========================================
// Apply Page Component
// ==========================================
export default async function ApplyPage() {
  const { settings, studentCount } = await getPageData();
  const schoolName = settings?.schoolName || "Afridi Model School & College";

  const steps = [
    {
      icon: FileText,
      title: "Fill Application",
      description: "Complete the online application form with accurate information.",
    },
    {
      icon: Clock,
      title: "Application Review",
      description: "Our admission team will review your application within 3-5 working days.",
    },
    {
      icon: Phone,
      title: "Interview/Test",
      description: "Eligible candidates will be contacted for an entrance test or interview.",
    },
    {
      icon: CheckCircle2,
      title: "Confirmation",
      description: "Selected candidates will receive an admission offer via email/phone.",
    },
  ];

  const requirements = [
    "Birth Certificate (original + copy)",
    "Previous school report card (if applicable)",
    "2 passport-size photographs",
    "Father/Guardian CNIC copy",
    "Medical fitness certificate",
    "Migration certificate (if applicable)",
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container-custom">
          <Breadcrumb
            items={[
              { label: "Admissions", href: "/admissions" },
              { label: "Apply Now" },
            ]}
          />
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              Admissions 2026-27
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Apply to{" "}
              <span className="gradient-text">{schoolName}</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Join our community of {studentCount}+ students and start your 
              journey towards academic excellence.
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left: Application Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Admission Application Form
                </CardTitle>
                <CardDescription>
                  Please fill in all required fields marked with{" "}
                  <span className="text-destructive">*</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <AdmissionForm />
              </CardContent>
            </Card>
          </div>

          {/* Right: Information */}
          <div className="space-y-6">
            {/* Application Process */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Application Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={step.title} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <step.icon className="h-4 w-4 text-primary" />
                        </div>
                        {index < steps.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-semibold">{step.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Required Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Required Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {requirements.map((req) => (
                    <li key={req} className="flex items-start gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Contact for Help */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <p className="text-sm font-semibold mb-2">Need Help?</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Contact our admission office for assistance with your application.
                </p>
                {settings?.phone && (
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {settings.phone}
                  </a>
                )}
                {settings?.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-2 text-sm text-primary hover:underline mt-1.5"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {settings.email}
                  </a>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}