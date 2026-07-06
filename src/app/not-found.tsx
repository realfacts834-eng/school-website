import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, BookOpen, School } from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  robots: { index: false, follow: false },
};

const quickLinks = [
  { label: "Admissions", href: "/admissions", icon: School },
  { label: "News", href: "/news", icon: BookOpen },
  { label: "Contact Us", href: "/contact", icon: Search },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-dots opacity-[0.03] pointer-events-none" />

        <div className="text-center px-4 max-w-2xl mx-auto py-16">
          {/* 404 Large Text */}
          <div className="relative">
            <h1 className="text-[10rem] md:text-[12rem] font-bold text-primary/5 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl md:text-8xl font-bold gradient-text">
                404
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold mt-4 text-foreground">
            Oops! Page Not Found
          </h2>

          {/* Description */}
          <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm md:text-base leading-relaxed">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link href="/">
              <Button size="lg" className="gap-2">
                <Home className="h-5 w-5" />
                Back to Home
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </Button>
          </div>

          {/* Divider */}
          <div className="divider-accent my-10" />

          {/* Quick Links */}
          <p className="text-sm text-muted-foreground mb-4">
            Maybe you were looking for:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Help Text */}
          <p className="text-xs text-muted-foreground mt-8">
            If you think this is a mistake, please{" "}
            <Link href="/contact" className="text-school-blue hover:underline font-medium">
              contact us
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}