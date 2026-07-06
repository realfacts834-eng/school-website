import Link from "next/link";
import {
  FileQuestion,
  FolderOpen,
  SearchX,
  PackageOpen,
  MessageSquare,
  Newspaper,
  Calendar,
  Camera,
  Users,
  FileText,
  Bell,
  GraduationCap,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ==========================================
// Types
// ==========================================
interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  iconName?: keyof typeof iconMap;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  size?: "sm" | "default" | "lg";
  className?: string;
  bordered?: boolean;
}

// ==========================================
// Icon Mapping
// ==========================================
const iconMap = {
  default: FileQuestion,
  folder: FolderOpen,
  search: SearchX,
  package: PackageOpen,
  message: MessageSquare,
  news: Newspaper,
  calendar: Calendar,
  camera: Camera,
  users: Users,
  file: FileText,
  bell: Bell,
  graduation: GraduationCap,
} as const;

// ==========================================
// EmptyState Component
// ==========================================
export function EmptyState({
  title = "No Data Found",
  description = "There is nothing to display right now.",
  icon,
  iconName = "default",
  action,
  secondaryAction,
  size = "default",
  className,
  bordered = false,
}: EmptyStateProps) {
  const IconComponent = icon ? null : iconMap[iconName];
  
  const sizeClasses = {
    sm: {
      container: "py-8",
      icon: "h-10 w-10",
      wrapper: "w-16 h-16",
      title: "text-base",
      description: "text-xs max-w-xs",
    },
    default: {
      container: "py-12 md:py-16",
      icon: "h-12 w-12",
      wrapper: "w-20 h-20",
      title: "text-lg",
      description: "text-sm max-w-sm",
    },
    lg: {
      container: "py-16 md:py-20",
      icon: "h-16 w-16",
      wrapper: "w-24 h-24",
      title: "text-xl",
      description: "text-base max-w-md",
    },
  };

  const styles = sizeClasses[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-4",
        styles.container,
        bordered && "border-2 border-dashed border-border rounded-2xl",
        className
      )}
    >
      {/* Icon Wrapper */}
      <div
        className={cn(
          "mb-5 rounded-full bg-muted/50 flex items-center justify-center",
          styles.wrapper
        )}
      >
        {icon ? (
          <div className={cn("text-muted-foreground/60", styles.icon)}>
            {icon}
          </div>
        ) : IconComponent ? (
          <IconComponent
            className={cn("text-muted-foreground/60", styles.icon)}
          />
        ) : null}
      </div>

      {/* Title */}
      <h3 className={cn("font-semibold text-foreground mb-2", styles.title)}>
        {title}
      </h3>

      {/* Description */}
      <p
        className={cn(
          "text-muted-foreground leading-relaxed",
          styles.description
        )}
      >
        {description}
      </p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 mt-6">
          {action &&
            (action.href ? (
              <Link href={action.href}>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  {action.label}
                </Button>
              </Link>
            ) : (
              <Button size="sm" onClick={action.onClick} className="gap-2">
                <Plus className="h-4 w-4" />
                {action.label}
              </Button>
            ))}

          {secondaryAction &&
            (secondaryAction.href ? (
              <Link href={secondaryAction.href}>
                <Button variant="outline" size="sm" className="gap-2">
                  {secondaryAction.label}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={secondaryAction.onClick}
                className="gap-2"
              >
                {secondaryAction.label}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ))}
        </div>
      )}
    </div>
  );
}