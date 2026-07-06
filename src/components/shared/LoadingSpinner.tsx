import { cn } from "@/lib/utils";
import { Loader2, School } from "lucide-react";

// ==========================================
// Types
// ==========================================
interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "default" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse" | "school";
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

// ==========================================
// LoadingSpinner Component
// ==========================================
export function LoadingSpinner({
  size = "default",
  variant = "spinner",
  text,
  className,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-5 w-5",
    default: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const borderSizes = {
    xs: "border-2",
    sm: "border-2",
    default: "border-[3px]",
    lg: "border-4",
    xl: "border-4",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    : "flex items-center justify-center p-8";

  const spinner = (
    <div
      className={cn(
        sizeClasses[size],
        borderSizes[size],
        "rounded-full border-muted/30 border-t-primary animate-spin",
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );

  const dots = (
    <div className="flex items-center gap-1.5" role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            size === "xs" ? "h-1.5 w-1.5" : size === "sm" ? "h-2 w-2" : "h-3 w-3",
            "rounded-full bg-primary animate-bounce",
            className
          )}
          style={{
            animationDelay: `${i * 150}ms`,
            animationDuration: "0.8s",
          }}
        />
      ))}
    </div>
  );

  const pulse = (
    <div className="flex items-center gap-1" role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            size === "xs" ? "h-4 w-1" : size === "sm" ? "h-6 w-1.5" : "h-10 w-2",
            "rounded-full bg-primary animate-pulse",
            className
          )}
          style={{
            animationDelay: `${i * 200}ms`,
          }}
        />
      ))}
    </div>
  );

  const schoolSpinner = (
    <div className="relative" role="status" aria-label="Loading">
      <div
        className={cn(
          sizeClasses[size],
          borderSizes[size],
          "rounded-full border-muted/30 border-t-school-gold animate-spin",
          className
        )}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <School
          className={cn(
            size === "xs" ? "h-2 w-2" : size === "sm" ? "h-3 w-3" : "h-4 w-4",
            "text-school-gold"
          )}
        />
      </div>
    </div>
  );

  const variantMap = {
    spinner,
    dots,
    pulse,
    school: schoolSpinner,
  };

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-3">
        {variantMap[variant]}

        {text && (
          <p
            className={cn(
              "text-muted-foreground animate-pulse",
              size === "xs" || size === "sm" ? "text-xs" : "text-sm"
            )}
          >
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

// ==========================================
// Page Loader (Full Screen)
// ==========================================
export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <LoadingSpinner
      size="lg"
      variant="school"
      text={text}
      fullScreen
    />
  );
}

// ==========================================
// Inline Loader
// ==========================================
export function InlineLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}