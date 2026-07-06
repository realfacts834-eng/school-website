"use client";

import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, MessageCircle } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console
    console.error("❌ Application Error:", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    // Optional: Send to error tracking service
    // sendToErrorTracking(error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-dots opacity-[0.03] pointer-events-none" />

        <div className="text-center px-4 max-w-xl mx-auto py-16">
          {/* Error Icon */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-destructive/10 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Oops! Something Went Wrong
          </h1>

          {/* Error Description */}
          <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm md:text-base leading-relaxed">
            We encountered an unexpected error. Our team has been notified. 
            Please try again or go back to the homepage.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg text-left max-w-lg mx-auto overflow-auto">
              <p className="text-xs font-mono text-destructive break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs font-mono text-muted-foreground mt-2">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Button onClick={reset} size="lg" className="gap-2">
              <RefreshCw className="h-5 w-5" />
              Try Again
            </Button>
            <Link href="/">
              <Button variant="outline" size="lg" className="gap-2">
                <Home className="h-5 w-5" />
                Go Home
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="lg" className="gap-2">
                <MessageCircle className="h-5 w-5" />
                Contact Support
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-xs text-muted-foreground mt-10">
            Error Code: {error.digest?.substring(0, 8) || "N/A"} | 
            If the problem persists, please{" "}
            <Link href="/contact" className="text-school-blue hover:underline font-medium">
              contact our support team
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}