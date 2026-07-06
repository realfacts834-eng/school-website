import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// ==========================================
// Card Variants
// ==========================================
const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: "shadow-sm hover:shadow-md",
        elevated: "shadow-md hover:shadow-lg",
        flat: "shadow-none border-0 bg-muted/50",
        outline: "shadow-none border-2",
        glass: "glass-card shadow-lg",
        interactive: "shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer",
      },
      padding: {
        none: "",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

// ==========================================
// Card Types
// ==========================================
interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  overlay?: boolean;
  aspectRatio?: "1/1" | "4/3" | "16/9" | "21/9";
}

// ==========================================
// Card Component
// ==========================================
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

// ==========================================
// Card Header
// ==========================================
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-0", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// ==========================================
// Card Title
// ==========================================
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" | "h4" }
>(({ className, as: Tag = "h3", ...props }, ref) => (
  <Tag
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-tight tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// ==========================================
// Card Description
// ==========================================
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground line-clamp-2", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// ==========================================
// Card Image
// ==========================================
const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  ({ className, overlay = false, aspectRatio, alt = "", ...props }, ref) => {
    const aspectClasses = {
      "1/1": "aspect-square",
      "4/3": "aspect-[4/3]",
      "16/9": "aspect-video",
      "21/9": "aspect-[21/9]",
    };

    return (
      <div className={cn("relative overflow-hidden rounded-t-xl", aspectRatio && aspectClasses[aspectRatio], className)}>
        <img
          ref={ref}
          alt={alt}
          className={cn(
            "h-full w-full object-cover transition-transform duration-500",
            "group-hover:scale-105"
          )}
          loading="lazy"
          {...props}
        />
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        )}
      </div>
    );
  }
);
CardImage.displayName = "CardImage";

// ==========================================
// Card Content
// ==========================================
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

// ==========================================
// Card Footer
// ==========================================
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// ==========================================
// Card Badge
// ==========================================
const CardBadge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "success" | "warning" | "danger" | "gold" }
>(({ className, variant = "default", ...props }, ref) => {
  const badgeVariants = {
    default: "bg-primary/10 text-primary",
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    gold: "bg-school-gold/20 text-school-gold",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
});
CardBadge.displayName = "CardBadge";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardImage,
  CardBadge,
};