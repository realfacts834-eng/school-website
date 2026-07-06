import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { cache } from "react";
import {
  HelpCircle,
  ChevronDown,
  MessageCircle,
  ArrowRight,
  Search,
  Plus,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions",
  description: "Find answers to commonly asked questions about our school.",
};

// ==========================================
// Data Fetching
// ==========================================
const getFaqs = cache(async () => {
  try {
    const [faqs, totalCount] = await Promise.all([
      db.faq.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      db.faq.count({ where: { isActive: true } }),
    ]);
    return { faqs, totalCount };
  } catch {
    return { faqs: [], totalCount: 0 };
  }
});

// ==========================================
// FAQ Page Component
// ==========================================
export default async function FaqPage() {
  const { faqs, totalCount } = await getFaqs();

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container-custom">
          <Breadcrumb items={[{ label: "FAQ" }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              ❓ Help Center
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground text-lg">
              Find answers to the most commonly asked questions
            </p>
            {totalCount > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {totalCount} question{totalCount !== 1 ? "s" : ""} answered
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-custom">
          {faqs.length === 0 ? (
            <EmptyState
              iconName="message"
              title="No FAQs Yet"
              description="Frequently asked questions will be added here."
            />
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <details
                    key={faq.id}
                    className="group border border-border rounded-xl bg-card hover:shadow-md transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-sm list-none">
                      <div className="flex items-center gap-3 pr-4">
                        <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
                          <HelpCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span className="group-open:text-primary transition-colors">
                          {faq.question}
                        </span>
                      </div>
                      <span className="shrink-0 text-muted-foreground group-open:hidden">
                        <Plus className="h-4 w-4" />
                      </span>
                      <span className="shrink-0 text-primary hidden group-open:block">
                        <Minus className="h-4 w-4" />
                      </span>
                    </summary>
                    <div className="px-5 pb-5 pl-14">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Still Have Questions */}
          <div className="max-w-3xl mx-auto mt-12">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 md:p-8 text-center">
                <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">Still Have Questions?</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  Can&apos;t find what you&apos;re looking for? Feel free to contact us directly.
                </p>
                <Link href="/contact">
                  <Button className="gap-2">
                    Contact Us
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}