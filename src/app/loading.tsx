import { School } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none" />

      <div className="text-center relative z-10">
        {/* Animated School Logo/Icon */}
        <div className="relative mb-8">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-school-gold/20 animate-spin-slow" />
          
          {/* Middle Ring */}
          <div className="absolute inset-2 rounded-full border-4 border-school-blue/30 animate-spin-slow" 
               style={{ animationDirection: "reverse", animationDuration: "6s" }} />
          
          {/* Inner Icon */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-background shadow-lg border border-border">
            <School className="w-10 h-10 md:w-12 md:h-12 text-school-gold animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
          Loading
          <span className="inline-flex">
            <span className="animate-pulse" style={{ animationDelay: "0ms" }}>.</span>
            <span className="animate-pulse" style={{ animationDelay: "200ms" }}>.</span>
            <span className="animate-pulse" style={{ animationDelay: "400ms" }}>.</span>
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Preparing something amazing for you
        </p>

        {/* Progress Bar */}
        <div className="mt-6 w-48 md:w-64 h-1 bg-muted rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-school-blue via-school-gold to-school-blue rounded-full animate-shimmer"
               style={{ width: "100%" }}>
            <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Section Loading (for Suspense fallback)
// ==========================================
export function SectionLoading({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-school-blue border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
}

// ==========================================
// Page Transition Loading
// ==========================================
export function PageTransitionLoading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-school-gold border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-sm font-medium text-foreground">Loading page...</p>
      </div>
    </div>
  );
}