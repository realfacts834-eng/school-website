import { cn } from "@/lib/utils";

// ==========================================
// Skeleton Props
// ==========================================
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

// ==========================================
// Skeleton Component
// ==========================================
function Skeleton({
  className,
  variant = "text",
  width,
  height,
  animation = "pulse",
  style,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-lg",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
    none: "",
  };

  return (
    <div
      className={cn(
        "bg-muted",
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

// ==========================================
// Preset Skeletons
// ==========================================

// Text line skeleton
function SkeletonText({
  lines = 3,
  className,
  ...props
}: SkeletonProps & { lines?: number }) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

// Card skeleton
function SkeletonCard({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <Skeleton variant="rounded" className="aspect-video w-full" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

// Avatar skeleton
function SkeletonAvatar({
  size = 40,
  className,
  ...props
}: SkeletonProps & { size?: number }) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
}

// Table row skeleton
function SkeletonTableRow({
  columns = 4,
  className,
  ...props
}: SkeletonProps & { columns?: number }) {
  return (
    <div className={cn("flex items-center gap-4 p-4", className)} {...props}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === 0 ? "w-1/4" : "flex-1")}
        />
      ))}
    </div>
  );
}

// Page skeleton
function SkeletonPage({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("space-y-8", className)} {...props}>
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

// Stats card skeleton
function SkeletonStats({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)} {...props}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2 p-4 border rounded-lg">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-3/4" />
        </div>
      ))}
    </div>
  );
}

export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonTableRow,
  SkeletonPage,
  SkeletonStats,
};