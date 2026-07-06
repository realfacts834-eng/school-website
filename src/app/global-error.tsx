"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, Wifi, WifiOff } from "lucide-react";
import { School } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log critical error
    console.error("🔴 CRITICAL Global Error:", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    });

    // Check if it's a network error
    if (!navigator.onLine) {
      console.warn("⚠️ Network offline detected");
    }
  }, [error]);

  const isOffline = typeof window !== "undefined" && !navigator.onLine;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Critical Error - Afridi Model School & College</title>
        <style>{`
          body { margin: 0; padding: 0; }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}</style>
      </head>
      <body className="min-h-screen flex items-center justify-center bg-background font-sans antialiased">
        <div className="text-center px-4 max-w-xl mx-auto py-16 animate-fade-in">
          {/* School Logo */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <School className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Error Icon */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-destructive/10 rounded-full animate-ping" />
            <div className="relative w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
          </div>

          {/* Network Status */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {isOffline ? (
              <>
                <WifiOff className="h-5 w-5 text-destructive" />
                <span className="text-sm font-medium text-destructive">
                  You are offline
                </span>
              </>
            ) : (
              <>
                <Wifi className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-500">
                  Connected
                </span>
              </>
            )}
          </div>

          {/* Error Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {isOffline ? "No Internet Connection" : "Critical Error"}
          </h1>

          {/* Error Description */}
          <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm md:text-base leading-relaxed">
            {isOffline
              ? "Please check your internet connection and try again."
              : "A critical error occurred while loading the application. Please try refreshing the page."}
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg text-left max-w-lg mx-auto overflow-auto border border-destructive/20">
              <p className="text-xs font-mono text-destructive break-all font-semibold mb-2">
                {error.name}: {error.message}
              </p>
              {error.digest && (
                <p className="text-xs font-mono text-muted-foreground">
                  Digest: {error.digest}
                </p>
              )}
              {error.stack && (
                <pre className="text-xs font-mono text-muted-foreground mt-2 whitespace-pre-wrap max-h-40 overflow-auto">
                  {error.stack}
                </pre>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Button onClick={reset} size="lg" className="gap-2">
              <RefreshCw className="h-5 w-5" />
              {isOffline ? "Reconnect" : "Refresh Page"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              <Home className="h-5 w-5" />
              Go to Homepage
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-muted-foreground mt-10">
            Afridi Model School & College
            <br />
            Error Reference: {error.digest?.substring(0, 8) || "N/A"}
          </p>
        </div>
      </body>
    </html>
  );
}