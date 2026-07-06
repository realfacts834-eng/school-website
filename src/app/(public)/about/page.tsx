import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCounter } from "@/components/home/StatsCounter";
import { db } from "@/lib/db";
import { cache } from "react";
import {
  Target,
  Eye,
  Heart,
  Award,
  ArrowRight,
  GraduationCap,
  Users,
  Calendar,
  Star,
  School,
  BookOpen,
  Shield,
  Globe,
  Sparkles,
  Quote,
} from "lucide-react";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about our history, mission, vision, and the values that drive our educational excellence.",
};

// ==========================================
// Data Fetching
// ==========================================
const getAboutData = cache(async () => {
  try {
    const [settings, studentCount, facultyCount, eventCount] = await Promise.all([
      db.siteSetting.findFirst(),
      db.admission.count({ where: { status: "approved" } }),
      db.faculty.count({ where: { isActive: true } }),
      db.event.count({ where: { isPublished: true } }),
    ]);
    return { settings, studentCount, facultyCount, eventCount };
  } catch {
    return { settings: null, studentCount: 0, facultyCount: 0, eventCount: 0 };
  }
});

// ==========================================
// About Page Component
// ==========================================
export default async function AboutPage() {
  const { settings, studentCount, facultyCount, eventCount } = await getAboutData();
  const schoolName = settings?.schoolName || "Afridi Model School & College";

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To provide quality education that empowers students to become lifelong learners, critical thinkers, and responsible global citizens.",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      icon: Eye,
      title: "Our Vision",
      description:
        "To be a leading educational institution recognized for academic excellence, character development, and innovative teaching methodologies.",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/50",
    },
    {
      icon: Heart,
      title: "Our Values",
      description:
        "Integrity, respect, excellence, compassion, and inclusivity guide everything we do at our institution.",
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/50",
    },
    {
      icon: Award,
      title: "Our Achievement",
      description:
        "28+ years of academic excellence with thousands of successful alumni making their mark worldwide.",
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-50 dark:bg-yellow-950/50",
    },
  ];

  const features = [
    { icon: School, title: "Modern Campus", description: "State-of-the-art facilities with smart classrooms" },
    { icon: Users, title: "Expert Faculty", description: "Highly qualified and experienced teaching staff" },
    { icon: BookOpen, title: "Rich Curriculum", description: "Comprehensive curriculum blending tradition with innovation" },
    { icon: Shield, title: "Safe Environment", description: "Secure campus with 24/7 security and surveillance" },
    { icon: Globe, title: "Global Perspective", description: "International exchange programs and global exposure" },
    { icon: Sparkles, title: "Holistic Development", description: "Focus on academics, sports, arts, and character" },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container-custom">
          <Breadcrumb items={[{ label: "About Us" }]} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              About{" "}
              <span className="gradient-text">{schoolName}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Established in 1998, {schoolName} has been at the forefront of 
              providing quality education that shapes future leaders. Our commitment 
              to academic excellence and character building has made us one of the 
              most trusted educational institutions in the region.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {values.map((item, index) => (
              <Card
                key={item.title}
                variant="interactive"
                className="animate-fade-in h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-xl shrink-0", item.bg)}>
                      <item.icon className={cn("h-6 w-6", item.color)} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <StatsCounter
        stats={[
          { label: "Students", value: studentCount, icon: "GraduationCap", suffix: "+" },
          { label: "Expert Faculty", value: facultyCount, icon: "Users", suffix: "+" },
          { label: "Annual Events", value: eventCount, icon: "Calendar", suffix: "+" },
          { label: "Years Excellence", value: 28, icon: "Award", suffix: "+" },
        ]}
        variant="card"
      />

      {/* Features Grid */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container-custom">
          <SectionHeading
            title="Why Choose Us"
            subtitle="Discover what makes our institution special"
            align="center"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-10">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                variant="interactive"
                className="animate-fade-in text-center"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="container-custom text-center">
          <Quote className="h-10 w-10 text-primary/20 mx-auto mb-6" />
          <blockquote className="text-2xl md:text-3xl font-bold text-foreground max-w-3xl mx-auto leading-relaxed">
            &ldquo;Education is not the filling of a pail, but the lighting of a fire.&rdquo;
          </blockquote>
          <p className="text-muted-foreground mt-3">— W.B. Yeats</p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Link href="/admissions/apply">
              <Button size="lg" className="gap-2 shadow-md">
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// Helper for cn
import { cn } from "@/lib/utils";