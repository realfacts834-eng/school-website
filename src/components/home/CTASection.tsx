import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { cache } from "react";
import { ArrowRight, PhoneCall, Sparkles, GraduationCap, Star, Users, Clock } from "lucide-react";

// ==========================================
// Data Fetching
// ==========================================
const getCTAData = cache(async () => {
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
// CTA Highlights
// ==========================================
const highlights = [
  { icon: GraduationCap, text: "Quality Education" },
  { icon: Users, text: "Expert Faculty" },
  { icon: Star, text: "Holistic Development" },
  { icon: Clock, text: "Admissions Open 2026" },
];

// ==========================================
// CTASection Component
// ==========================================
export async function CTASection() {
  const { settings, studentCount, facultyCount } = await getCTAData();
  const schoolName = settings?.schoolName || "Afridi Model School & College";

  return (
    <section className="relative py-20 md:py-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large blobs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-accent/10 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-[0.04]" />

        {/* Floating dots */}
        <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-white/20 animate-float" />
        <div className="absolute top-40 right-20 w-1.5 h-1.5 rounded-full bg-white/30 animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-32 left-1/3 w-2 h-2 rounded-full bg-white/20 animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-20 right-10 w-1.5 h-1.5 rounded-full bg-white/30 animate-float" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Sparkle Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-6 animate-fade-in">
            <Sparkles className="h-8 w-8 text-yellow-300" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in leading-tight">
            Ready to Join{" "}
            <span className="text-yellow-300 relative">
              {schoolName}
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-yellow-300/50 rounded-full" />
            </span>
            ?
          </h2>

          {/* Subtext */}
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-4 animate-fade-in animation-delay-200 max-w-2xl mx-auto leading-relaxed">
            Admissions are now open for the 2026-27 academic year. 
            Secure your child&apos;s future with quality education and holistic development.
          </p>

          {/* Stats Quick View */}
          <div className="flex items-center justify-center gap-6 md:gap-10 mb-10 animate-fade-in animation-delay-300">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">{studentCount}+</p>
              <p className="text-xs md:text-sm text-white/70">Students Enrolled</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">{facultyCount}+</p>
              <p className="text-xs md:text-sm text-white/70">Expert Faculty</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-yellow-300">28+</p>
              <p className="text-xs md:text-sm text-white/70">Years Excellence</p>
            </div>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 animate-fade-in animation-delay-400">
            {highlights.map((item) => (
              <span
                key={item.text}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-medium backdrop-blur-sm border border-white/10"
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.text}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animation-delay-500">
            <Link href="/admissions/apply">
              <Button
                size="xl"
                className="group bg-white text-primary hover:bg-yellow-300 hover:text-primary font-bold shadow-2xl shadow-black/20 hover:shadow-yellow-300/20 min-w-[200px] text-base"
              >
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            {settings?.phone && (
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>
                <Button
                  size="xl"
                  variant="glass"
                  className="group border-white/30 text-white hover:bg-white/15 min-w-[200px] text-base"
                >
                  <PhoneCall className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Call Now
                </Button>
              </a>
            )}
          </div>

          {/* Bottom Note */}
          <p className="text-white/50 text-xs mt-8 animate-fade-in animation-delay-600">
            Limited seats available • Apply before June 30, 2026
          </p>
        </div>
      </div>
    </section>
  );
}