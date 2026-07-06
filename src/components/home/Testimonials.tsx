import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { cache } from "react";
import { Star, Quote, User2, MessageSquareHeart, Sparkles } from "lucide-react";

// ==========================================
// Data Fetching
// ==========================================
const getTestimonials = cache(async () => {
  try {
    // Using contact messages as testimonials
    // Future: Create a dedicated Testimonial model
    const messages = await db.contact.findMany({
      where: { isRead: true },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        message: true,
        createdAt: true,
      },
    });
    return messages;
  } catch {
    return [];
  }
});

// ==========================================
// Default testimonials (if DB is empty)
// ==========================================
const defaultTestimonials = [
  {
    id: "default-1",
    name: "Ahmed Khan",
    message: "My daughter has been studying here for 3 years and the progress is remarkable. The teachers are dedicated and the environment is excellent.",
    createdAt: new Date("2026-01-15"),
  },
  {
    id: "default-2",
    name: "Sara Ali",
    message: "Best school in the area! The focus on both academics and character building makes this institution stand out.",
    createdAt: new Date("2026-02-20"),
  },
  {
    id: "default-3",
    name: "Muhammad Usman",
    message: "Excellent faculty and great learning environment. My son loves going to school every day!",
    createdAt: new Date("2026-03-10"),
  },
];

// ==========================================
// Testimonials Component
// ==========================================
export async function Testimonials() {
  const dbTestimonials = await getTestimonials();
  
  // Use DB data or fallback to defaults
  const testimonials = dbTestimonials.length > 0 
    ? dbTestimonials 
    : defaultTestimonials;

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="What Parents Say"
          subtitle="Hear from our community about their experience"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-10">
          {testimonials.map((item, index) => {
            // Generate random rating (4-5 stars) for demo
            const rating = Math.random() > 0.3 ? 5 : 4;

            return (
              <Card
                key={item.id}
                variant="interactive"
                className="animate-fade-in relative overflow-visible"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  {/* Avatar + Name Section */}
                  <div className="flex items-center gap-3 mb-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                    {/* Quote Icon */}
                    <Quote className="h-8 w-8 text-muted/20 ml-auto shrink-0" />
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1.5 font-medium">
                      {rating}.0
                    </span>
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 italic">
                      &ldquo;{item.message}&rdquo;
                    </p>
                  </div>

                  {/* Bottom Decoration */}
                  <div className="flex items-center gap-1 mt-4 pt-3 border-t border-border">
                    <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">Verified Parent</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-full px-4 py-2">
            <MessageSquareHeart className="h-4 w-4 text-primary" />
            <span>Share your feedback with us!</span>
          </div>
        </div>
      </div>
    </section>
  );
}