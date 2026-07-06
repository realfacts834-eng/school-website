import Link from "next/link";
import { ChevronRight, Home, Slash } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

// ==========================================
// Types
// ==========================================
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: "chevron" | "slash" | "dot";
  homeHref?: string;
  showHome?: boolean;
  maxItems?: number;
}

// ==========================================
// Breadcrumb Component
// ==========================================
export function Breadcrumb({
  items,
  className,
  separator = "chevron",
  homeHref = "/",
  showHome = true,
  maxItems,
}: BreadcrumbProps) {
  // If maxItems is set, collapse middle items
  const displayItems =
    maxItems && items.length > maxItems
      ? [
          items[0],
          { label: "...", href: undefined },
          ...items.slice(-(maxItems - 2)),
        ]
      : items;

  const separatorIcon = {
    chevron: <ChevronRight className="h-3.5 w-3.5" />,
    slash: <Slash className="h-3.5 w-3.5" />,
    dot: (
      <span className="w-1 h-1 rounded-full bg-muted-foreground/50 inline-block" />
    ),
  };

  // JSON-LD Breadcrumb Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      ...(showHome
        ? [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: homeHref,
            },
          ]
        : []),
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + (showHome ? 2 : 1),
        name: item.label,
        ...(item.href ? { item: item.href } : {}),
      })),
    ],
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className={cn(
          "flex items-center flex-wrap gap-1 text-sm text-muted-foreground py-3",
          className
        )}
      >
        <ol className="flex items-center flex-wrap gap-1">
          {/* Home */}
          {showHome && (
            <li className="flex items-center gap-1">
              <Link
                href={homeHref}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors rounded-md hover:bg-muted/50 px-1.5 py-0.5"
                aria-label="Home"
              >
                <Home className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              {items.length > 0 && (
                <span className="text-muted-foreground/50">
                  {separatorIcon[separator]}
                </span>
              )}
            </li>
          )}

          {/* Items */}
          {displayItems.map((item, index) => {
            const isLast = index === displayItems.length - 1;

            return (
              <Fragment key={index}>
                <li className="flex items-center">
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 hover:text-foreground transition-colors rounded-md hover:bg-muted/50 px-1.5 py-0.5 max-w-[200px] truncate"
                    >
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </Link>
                  ) : (
                    <span
                      className={cn(
                        "flex items-center gap-1 px-1.5 py-0.5 max-w-[200px] truncate",
                        isLast
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      )}
                      {...(isLast && { "aria-current": "page" })}
                    >
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </span>
                  )}
                  {!isLast && (
                    <span className="text-muted-foreground/50 ml-1">
                      {separatorIcon[separator]}
                    </span>
                  )}
                </li>
              </Fragment>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

// ==========================================
// Auto Breadcrumb Generator
// ==========================================
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  
  const items: BreadcrumbItem[] = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return { label, href };
  });

  return items;
}