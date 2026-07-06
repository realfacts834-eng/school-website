import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { cache } from "react";
import { ArrowRight, Play, GraduationCap, Users, Calendar, Newspaper, Star, Award } from "lucide-react";

// ==========================================
// Data Fetching
// ==========================================
const getSettings = cache(async () => {
  try {
    return await db.siteSetting.findFirst();
  } catch {
    return null;
  }
});

const getStats = cache(async () => {
  try {
    const [studentCount, facultyCount, eventCount, newsCount, yearsActive] = await Promise.all([
      db.admission.count({ where: { status: "approved" } }),
      db.faculty.count({ where: { isActive: true } }),
      db.event.count({ where: { isPublished: true } }),
      db.news.count({ where: { isPublished: true } }),
      Promise.resolve(28), // Years since 1998
    ]);
    return { studentCount, facultyCount, eventCount, newsCount, yearsActive };
  } catch {
    return { studentCount: 0, facultyCount: 0, eventCount: 0, newsCount: 0, yearsActive: 28 };
  }
});

// ==========================================
// HeroSection Component
// ==========================================
export async function HeroSection() {
  const settings = await getSettings();
  const stats = await getStats();
  const schoolName = settings?.schoolName || "Afridi Model School & College";

  const statItems = [
    { label: "Students", value: stats.studentCount, icon: GraduationCap, suffix: "+" },
    { label: "Expert Faculty", value: stats.facultyCount, icon: Users, suffix: "+" },
    { label: "Annual Events", value: stats.eventCount, icon: Calendar, suffix: "+" },
    { label: "Years Excellence", value: stats.yearsActive, icon: Award, suffix: "+" },
  ];

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden">
      {/* Background Image (if available) */}
      {settings?.ogImage && (
        <Image
          src={settings.ogImage}
          alt={schoolName}
          fill
          className="object-cover opacity-10"
          priority
          sizes="100vw"
        />
      )}

      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
      
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute -bottom-40 right-1/4 h-[300px] w-[300px] rounded-full bg-accent/10 blur-3xl animate-pulse" style={{ animationDelay: "3s" }} />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Tagline Badge */}
          {settings?.tagline && (
            <div className="inline-block animate-fade-in">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
                <Star className="h-3 w-3 fill-primary" />
                {settings.tagline}
              </span>
            </div>
          )}

          {/* Main Heading */}
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-tight animate-slide-up">
            Welcome to{" "}
            <br className="sm:hidden" />
            <span className="gradient-text">{schoolName}</span>
          </h1>

          {/* Description */}
          {settings?.metaDescription && (
            <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
              {settings.metaDescription}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-300">
            <Link href="/admissions/apply">
              <Button size="xl" className="group shadow-glow hover:shadow-glow-lg min-w-[180px]">
                Apply Now 2026
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="xl" className="group min-w-[180px] border-2">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Discover More
              </Button>
            </Link>
          </div>

          {/* Dynamic Stats Counter */}
          <div className="mt-20 animate-slide-up animation-delay-500">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {statItems.map((stat, index) => (
                <div
                  key={stat.label}
                  className="relative group"
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-foreground text-center">
                      {stat.value}
                      <span className="text-primary">{stat.suffix}</span>
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground text-center mt-1 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 animate-fade-in animation-delay-1000">
            <div className="w-6 h-10 mx-auto rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5">
              <div className="w-1.5 h-3 rounded-full bg-primary animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}