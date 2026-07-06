import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  Microscope,
  Palette,
  ArrowRight,
  Star,
  Clock,
  Users,
  Trophy,
  Globe,
  Laptop,
  Music,
  Dumbbell,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Academics",
  description: "Explore our comprehensive academic programs from primary to secondary education.",
};

// ==========================================
// Academics Page Component
// ==========================================
export default function AcademicsPage() {
  const programs = [
    {
      icon: BookOpen,
      title: "Primary School",
      description: "Building strong foundations in core subjects with interactive learning methods.",
      grades: "Grades 1-5",
      subjects: ["English", "Urdu", "Mathematics", "Science", "Social Studies", "Islamiyat"],
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      icon: GraduationCap,
      title: "Middle School",
      description: "Developing critical thinking, analytical skills, and subject specialization.",
      grades: "Grades 6-8",
      subjects: ["English", "Urdu", "Mathematics", "Science", "Computer", "History"],
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/50",
    },
    {
      icon: Microscope,
      title: "Secondary School",
      description: "Preparing students for board examinations with focused curriculum.",
      grades: "Grades 9-10",
      subjects: ["Science Group", "Arts Group", "Computer Science", "Elective Subjects"],
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/50",
    },
    {
      icon: Palette,
      title: "Extra-Curricular",
      description: "Holistic development through sports, arts, music, and various clubs.",
      grades: "All Grades",
      subjects: ["Sports", "Arts & Crafts", "Music", "Debate", "Drama", "Community Service"],
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-950/50",
    },
  ];

  const highlights = [
    { icon: Users, label: "Small Class Sizes", desc: "Individual attention" },
    { icon: Laptop, label: "Smart Classrooms", desc: "Digital learning" },
    { icon: Globe, label: "Modern Curriculum", desc: "Updated regularly" },
    { icon: Trophy, label: "Competitions", desc: "Inter-school events" },
    { icon: Music, label: "Arts & Music", desc: "Creative expression" },
    { icon: Dumbbell, label: "Sports Facilities", desc: "Physical development" },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container-custom">
          <Breadcrumb items={[{ label: "Academics" }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              📚 Academics
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Academic Excellence
            </h1>
            <p className="text-muted-foreground text-lg">
              Nurturing minds, building character, and preparing students for a successful future.
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom py-12">
        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {programs.map((program, index) => (
            <Card
              key={program.title}
              variant="interactive"
              className="animate-fade-in h-full"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 md:p-8">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn("p-3 rounded-xl shrink-0", program.bg)}>
                    <program.icon className={cn("h-6 w-6", program.color)} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{program.title}</h3>
                    <span className="inline-block text-xs font-medium bg-muted px-2.5 py-1 rounded-full mt-1.5">
                      {program.grades}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {program.description}
                </p>

                {/* Subjects */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Subjects / Areas
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {program.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="inline-flex items-center gap-1 text-xs bg-muted/50 px-2.5 py-1 rounded-full"
                      >
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Highlights */}
        <div className="mt-16">
          <SectionHeading
            title="Our Facilities"
            subtitle="Providing the best environment for learning and growth"
            align="center"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
            {highlights.map((item) => (
              <Card
                key={item.label}
                variant="interactive"
                className="text-center animate-fade-in"
              >
                <CardContent className="p-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 inline-block mb-3">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="text-sm font-semibold">{item.label}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/admissions">
            <Button size="lg" className="gap-2 shadow-md">
              Apply for Admission
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}