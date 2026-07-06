import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCounter } from "@/components/home/StatsCounter";
import { db } from "@/lib/db";
import { cache } from "react";
import {
  CheckCircle,
  ArrowRight,
  FileText,
  Clock,
  GraduationCap,
  Users,
  Phone,
  Mail,
  Calendar,
  School,
  Star,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Admissions",
  description: "Apply for admission for the 2026-27 academic year.",
};

// ==========================================
// Data Fetching
// ==========================================
const getAdmissionsData = cache(async () => {
  try {
    const [settings, studentCount, facultyCount] = await Promise.all([
      db.siteSetting.findFirst(),
      db.admission.count({ where: { status: "approved" } }),
      db.faculty.count({ where: { isActive: true } }),
    ]);
    return { settings, studentCount, facultyCount };
  } catch {
    return { settings: null, studentCount: 0, facultyCount: 0 };
  }
});

// ==========================================
// Admissions Page Component
// ==========================================
export default async function AdmissionsPage() {
  const { settings, studentCount, facultyCount } = await getAdmissionsData();
  const schoolName = settings?.schoolName || "Afridi Model School & College";

  const steps = [
    {
      title: "Submit Application",
      description: "Fill out the online admission form with accurate student details.",
      icon: FileText,
    },
    {
      title: "Document Verification",
      description: "Submit required documents for verification by our team.",
      icon: CheckCircle,
    },
    {
      title: "Entrance Assessment",
      description: "Student appears for an entrance test or interview.",
      icon: Clock,
    },
    {
      title: "Admission Confirmation",
      description: "Admission confirmed upon successful evaluation and fee submission.",
      icon: GraduationCap,
    },
  ];

  const requirements = [
    "Birth Certificate (original + copy)",
    "Previous School Report Card (if applicable)",
    "2 Passport-size Photographs",
    "Father/Guardian CNIC Copy",
    "Medical Fitness Certificate",
    "Migration Certificate (if applicable)",
  ];

  const features = [
    { icon: Users, label: `${studentCount}+ Students` },
    { icon: GraduationCap, label: `${facultyCount}+ Faculty` },
    { icon: Star, label: "28+ Years Excellence" },
    { icon: School, label: "Modern Campus" },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container-custom">
          <Breadcrumb items={[{ label: "Admissions" }]} />
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
              Join <span className="gradient-text">{schoolName}</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Take the first step towards a bright future. Admissions are now open.
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom py-12">
        {/* Admission Process */}
        <SectionHeading
          title="Admission Process"
          subtitle="Follow these simple steps to apply"
          align="center"
          badge="4 Easy Steps"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-10">
          {steps.map((step, index) => (
            <Card
              key={step.title}
              variant="interactive"
              className="text-center animate-fade-in relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                {/* Step Number */}
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-sm shadow-md">
                  {index + 1}
                </div>
                <div className="p-2 rounded-lg bg-primary/10 inline-block mb-3">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Requirements + Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
          {/* Requirements */}
          <div className="lg:col-span-2">
            <Card className="shadow-md">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">Required Documents</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {requirements.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/30"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Features */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-5">
                <h3 className="font-bold mb-3">Why Choose Us</h3>
                <div className="space-y-2.5">
                  {features.map((feature) => (
                    <div
                      key={feature.label}
                      className="flex items-center gap-2.5 text-sm"
                    >
                      <feature.icon className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Help */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold mb-3">Need Help?</h3>
                {settings?.phone && (
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 text-sm text-primary hover:underline mb-2"
                  >
                    <Phone className="h-4 w-4" />
                    {settings.phone}
                  </a>
                )}
                {settings?.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    {settings.email}
                  </a>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/admissions/apply">
            <Button size="xl" className="gap-2 shadow-lg min-w-[200px]">
              Apply Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-3">
            Limited seats available for the 2026-27 academic year
          </p>
        </div>
      </div>
    </>
  );
}