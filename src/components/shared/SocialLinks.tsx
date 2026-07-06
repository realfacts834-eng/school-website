import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { db } from "@/lib/db";
import { cache } from "react";
import { cn } from "@/lib/utils";

// ==========================================
// Types
// ==========================================
type SocialPlatform = "facebook" | "twitter" | "instagram" | "youtube" | "linkedin";

interface SocialLink {
  href: string;
  icon: LucideIcon;
  label: string;
  color: string;
  hoverColor: string;
}

interface SocialLinksProps {
  settings?: Record<string, string | null> | null;
  variant?: "default" | "compact" | "colored" | "bordered";
  size?: "sm" | "default" | "lg";
  className?: string;
  showLabels?: boolean;
}

// ==========================================
// Social Platforms Configuration
// ==========================================
const socialPlatforms: Record<SocialPlatform, Omit<SocialLink, "href">> = {
  facebook: {
    icon: Facebook,
    label: "Facebook",
    color: "text-muted-foreground",
    hoverColor: "hover:text-[#1877F2] hover:bg-[#1877F2]/10",
  },
  twitter: {
    icon: Twitter,
    label: "Twitter",
    color: "text-muted-foreground",
    hoverColor: "hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10",
  },
  instagram: {
    icon: Instagram,
    label: "Instagram",
    color: "text-muted-foreground",
    hoverColor: "hover:text-[#E4405F] hover:bg-[#E4405F]/10",
  },
  youtube: {
    icon: Youtube,
    label: "Youtube",
    color: "text-muted-foreground",
    hoverColor: "hover:text-[#FF0000] hover:bg-[#FF0000]/10",
  },
  linkedin: {
    icon: Linkedin,
    label: "LinkedIn",
    color: "text-muted-foreground",
    hoverColor: "hover:text-[#0A66C2] hover:bg-[#0A66C2]/10",
  },
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
// Build Social Links
// ==========================================
function buildSocialLinks(settings: Record<string, string | null> | null | undefined): SocialLink[] {
  if (!settings) return [];

  return (Object.keys(socialPlatforms) as SocialPlatform[])
    .filter((key) => settings[key])
    .map((key) => ({
      href: settings[key]!,
      ...socialPlatforms[key],
    }));
}

// ==========================================
// Size Classes
// ==========================================
const sizeClasses = {
  sm: "p-1.5 rounded-md",
  default: "p-2 rounded-lg",
  lg: "p-2.5 rounded-xl",
};

const iconSizes = {
  sm: "h-3.5 w-3.5",
  default: "h-4 w-4",
  lg: "h-5 w-5",
};

// ==========================================
// SocialLinks Component
// ==========================================
export async function SocialLinks({
  settings: externalSettings,
  variant = "default",
  size = "default",
  className,
  showLabels = false,
}: SocialLinksProps = {}) {
  // Use external settings or fetch from DB
  const dbSettings = externalSettings || (await getSettings());
  const links = buildSocialLinks(dbSettings as Record<string, string | null>);

  if (links.length === 0) return null;

  const variantClasses = {
    default: cn(
      "text-muted-foreground hover:text-foreground hover:bg-muted",
      "transition-all duration-200"
    ),
    compact: cn(
      "text-muted-foreground/70 hover:text-foreground",
      "transition-all duration-200"
    ),
    colored: cn(
      "text-muted-foreground transition-all duration-200",
      links.map((l) => l.hoverColor).join(" ")
    ),
    bordered: cn(
      "text-muted-foreground hover:text-foreground border border-border hover:border-foreground/20",
      "transition-all duration-200"
    ),
  };

  return (
    <div className={cn("flex items-center", showLabels ? "gap-4" : "gap-1", className)}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          title={link.label}
          aria-label={`Follow us on ${link.label}`}
          className={cn(
            "inline-flex items-center gap-2",
            sizeClasses[size],
            variantClasses[variant],
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-school-blue focus-visible:ring-offset-2"
          )}
        >
          <link.icon className={iconSizes[size]} />
          {showLabels && (
            <span className="text-xs font-medium hidden sm:inline">
              {link.label}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}

// ==========================================
// Static Social Links (No DB dependency)
// ==========================================
interface StaticSocialLinksProps {
  links: Array<{
    platform: SocialPlatform;
    href: string;
  }>;
  variant?: "default" | "compact" | "colored" | "bordered";
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function StaticSocialLinks({
  links,
  variant = "default",
  size = "default",
  className,
}: StaticSocialLinksProps) {
  if (links.length === 0) return null;

  return (
    <SocialLinks
      settings={Object.fromEntries(
        links.map((l) => [l.platform, l.href])
      )}
      variant={variant}
      size={size}
      className={className}
    />
  );
}