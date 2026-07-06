import { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { cache } from "react";
import {
  Users,
  Mail,
  Phone,
  Award,
  GraduationCap,
  Briefcase,
  ChevronRight,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Our Faculty",
  description: "Meet our dedicated team of highly qualified educators and staff.",
};

// ==========================================
// Data Fetching
// ==========================================
const getFaculty = cache(async () => {
  try {
    const [faculty, totalCount] = await Promise.all([
      db.faculty.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      db.faculty.count({ where: { isActive: true } }),
    ]);
    return { faculty, totalCount };
  } catch {
    return { faculty: [], totalCount: 0 };
  }
});

// ==========================================
// Faculty Page Component
// ==========================================
export default async function FacultyPage() {
  const { faculty, totalCount } = await getFaculty();

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container-custom">
          <Breadcrumb items={[{ label: "Faculty" }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              👨‍🏫 Our Team
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Our Faculty
            </h1>
            <p className="text-muted-foreground text-lg">
              Meet our dedicated team of highly qualified educators
            </p>
            {totalCount > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {totalCount} dedicated educator{totalCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-custom">
          {faculty.length === 0 ? (
            <EmptyState
              iconName="users"
              title="No Faculty Listed"
              description="Faculty information will be updated soon."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
              {faculty.map((member, index) => (
                <Card
                  key={member.id}
                  variant="interactive"
                  className="text-center animate-fade-in overflow-visible group"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <CardContent className="p-6 pt-8">
                    {/* Avatar */}
                    <div className="relative w-24 h-24 mx-auto -mt-12 mb-4">
                      <div className="w-full h-full rounded-full overflow-hidden border-4 border-background shadow-lg bg-muted">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                            <span className="text-2xl font-bold text-primary">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Status Dot */}
                      <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                    </div>

                    {/* Info */}
                    <h3 className="font-bold text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary font-medium">
                      {member.designation}
                    </p>

                    {/* Details */}
                    <div className="space-y-1.5 mt-3">
                      {member.qualification && (
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5" />
                          {member.qualification}
                        </p>
                      )}
                      {member.experience && (
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5" />
                          {member.experience}
                        </p>
                      )}
                    </div>

                    {/* Bio */}
                    {member.bio && (
                      <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                        {member.bio}
                      </p>
                    )}

                    {/* Contact */}
                    <div className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title={`Email ${member.name}`}
                        >
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </a>
                      )}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone.replace(/\s/g, "")}`}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title={`Call ${member.name}`}
                        >
                          <Phone className="h-4 w-4 text-muted-foreground" />
                        </a>
                      )}
                    </div>
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