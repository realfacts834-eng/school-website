import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Types
// ==========================================
interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  action?: {
    label: string;
    href: string;
  };
  badge?: string;
  size?: "sm" | "default" | "lg";
  showLine?: boolean;
  lineVariant?: "primary" | "accent" | "gradient";
}

// ==========================================
// SectionHeading Component
// ==========================================
export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
  titleClassName,
  subtitleClassName,
  action,
  badge,
  size = "default",
  showLine = true,
  lineVariant = "primary",
}: SectionHeadingProps) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const sizeClasses = {
    sm: {
      title: "text-xl md:text-2xl font-bold",
      subtitle: "text-sm md:text-base",
    },
    default: {
      title: "text-2xl md:text-3xl lg:text-4xl font-bold",
      subtitle: "text-base md:text-lg",
    },
    lg: {
      title: "text-3xl md:text-4xl lg:text-5xl font-bold",
      subtitle: "text-lg md:text-xl",
    },
  };

  const lineColors = {
    primary: "bg-primary",
    accent: "bg-accent",
    gradient: "bg-gradient-to-r from-primary via-accent to-primary",
  };

  const lineAlignment = {
    left: "ml-0 mr-auto",
    center: "mx-auto",
    right: "mr-0 ml-auto",
  };

  return (
    <div
      className={cn(
        "mb-10 md:mb-14",
        alignmentClasses[align],
        className
      )}
    >
      {/* Badge */}
      {badge && (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
          {badge}
        </span>
      )}

      {/* Title */}
      <h2
        className={cn(
          sizeClasses[size].title,
          "tracking-tight text-foreground",
          titleClassName
        )}
      >
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p
          className={cn(
            sizeClasses[size].subtitle,
            "text-muted-foreground mt-3",
            align === "center" ? "max-w-2xl mx-auto" : "max-w-xl",
            "leading-relaxed",
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}

      {/* Action Link */}
      {action && align === "center" && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group"
        >
          {action.label}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}

      {/* Decorative Line */}
      {showLine && (
        <div
          className={cn(
            "mt-5 h-1 w-16 md:w-20 rounded-full",
            lineColors[lineVariant],
            lineAlignment[align]
          )}
        />
      )}
    </div>
  );
}

// ==========================================
// Section Divider
// ==========================================
export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 py-8", className)}>
      <div className="flex-1 h-px bg-border" />
      <div className="w-2 h-2 rounded-full bg-primary/30" />
      <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
      <div className="w-2 h-2 rounded-full bg-primary/30" />
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}