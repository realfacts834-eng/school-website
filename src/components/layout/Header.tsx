"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Menu, X, ChevronDown, School, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./MobileNav";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

// ==========================================
// Header Props
// ==========================================
interface HeaderProps {
  settings?: {
    schoolName?: string | null;
    logo?: string | null;
    phone?: string | null;
  } | null;
}

// ==========================================
// Header Component
// ==========================================
export function Header({ settings }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Track scroll position for glass effect
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Prevent body scroll when mobile open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown-trigger") && !target.closest(".dropdown-menu")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const schoolName = settings?.schoolName || "Afridi Model School";
  const logo = settings?.logo;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-background/50 backdrop-blur-sm border-b border-transparent"
        )}
      >
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between">
            {/* Logo Section */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              aria-label={schoolName}
            >
              {logo ? (
                <img
                  src={logo}
                  alt={schoolName}
                  className="h-10 w-auto object-contain"
                  width={40}
                  height={40}
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-md group-hover:shadow-lg transition-all">
                  <School className="h-5 w-5" />
                </div>
              )}
              <div className="hidden sm:block">
                <span className="text-lg font-bold tracking-tight text-foreground leading-tight">
                  {schoolName}
                </span>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Building Future Leaders
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                const hasDropdown = "dropdown" in link && link.dropdown;

                return (
                  <div key={link.href} className="relative dropdown-trigger">
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                      onClick={() =>
                        hasDropdown &&
                        setActiveDropdown(
                          activeDropdown === link.label ? null : link.label
                        )
                      }
                    >
                      {link.label}
                      {hasDropdown && (
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-200",
                            activeDropdown === link.label && "rotate-180"
                          )}
                        />
                      )}
                    </Link>

                    {/* Dropdown Menu */}
                    {hasDropdown && activeDropdown === link.label && (
                      <div className="dropdown-menu absolute top-full left-0 mt-1 w-48 py-2 bg-background border border-border rounded-lg shadow-lg animate-fade-in">
                        {link.dropdown!.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Phone (Desktop) */}
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mr-2"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>{settings.phone}</span>
                </a>
              )}

              {/* CTA Button */}
              <Link href="/admissions/apply">
                <Button size="sm" className="hidden sm:flex shadow-md hover:shadow-lg gap-1.5">
                  Apply Now
                  <span className="text-xs opacity-80">2026</span>
                </Button>
              </Link>

              {/* Mobile Toggle */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors relative"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-16" />

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Navigation */}
      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        settings={settings}
      />
    </>
  );
}