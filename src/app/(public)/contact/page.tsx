import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GoogleMap } from "@/components/shared/GoogleMap";
import { ContactForm } from "./contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { cache } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  ArrowRight,
  Send,
  Headphones,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with us for admissions, inquiries, or any questions.",
};

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

// ==========================================
// Contact Page Component
// ==========================================
export default async function ContactPage() {
  const settings = await getSettings();
  const schoolName = settings?.schoolName || "Afridi Model School & College";

  const infoItems = [
    {
      icon: Phone,
      label: "Phone",
      value: settings?.phone,
      href: settings?.phone ? `tel:${settings.phone.replace(/\s/g, "")}` : undefined,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      icon: Mail,
      label: "Email",
      value: settings?.email,
      href: settings?.email ? `mailto:${settings.email}` : undefined,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/50",
    },
    {
      icon: MapPin,
      label: "Address",
      value: settings?.address,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/50",
    },
    {
      icon: Clock,
      label: "Office Hours",
      value: settings?.officeTiming,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/50",
    },
  ].filter((item) => item.value);

  const alternativeContact = [
    {
      icon: MessageSquare,
      title: "Quick Inquiry",
      description: "Fill out the form and we'll get back to you within 24 hours.",
    },
    {
      icon: Headphones,
      title: "Phone Support",
      description: "Call us during office hours for immediate assistance.",
    },
    {
      icon: Building2,
      title: "Visit Campus",
      description: "Schedule a campus tour to see our facilities in person.",
    },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container-custom">
          <Breadcrumb items={[{ label: "Contact" }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              Get in Touch
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Contact <span className="gradient-text">{schoolName}</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Have questions about admissions, academics, or anything else? 
              We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left: Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <div className="space-y-3">
                  {infoItems.map((item, index) => (
                    <Card
                      key={item.label}
                      className="animate-fade-in overflow-hidden group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-4">
                        {item.href ? (
                          <a
                            href={item.href}
                            className="flex items-center gap-3 group/link"
                          >
                            <div className={cn("p-2 rounded-lg shrink-0", item.bg)}>
                              <item.icon className={cn("h-5 w-5", item.color)} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground">{item.label}</p>
                              <p className="text-sm font-semibold group-hover/link:text-primary transition-colors truncate">
                                {item.value}
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground/30 ml-auto shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </a>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg shrink-0", item.bg)}>
                              <item.icon className={cn("h-5 w-5", item.color)} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground">{item.label}</p>
                              <p className="text-sm font-semibold truncate">{item.value}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Alternative Contact */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  More Ways to Reach Us
                </h3>
                {alternativeContact.map((item, index) => (
                  <Card key={item.title} className="animate-fade-in"
                    style={{ animationDelay: `${(index + 4) * 100}ms` }}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-muted shrink-0">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Send className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold">Send Us a Message</h2>
                  </div>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map */}
      <GoogleMap />

      {/* Bottom CTA */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Join Us?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Take the first step towards a bright future. Apply now for the 2026-27 academic year.
          </p>
          <Link href="/admissions/apply">
            <Button size="lg" className="gap-2 shadow-md">
              Apply Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}