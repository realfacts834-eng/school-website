"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  School,
  GraduationCap,
  Calendar,
  Image,
  FileText,
  Users,
  BookOpen,
  Home,
  Info,
  Contact2,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/types";

// ==========================================
// Icon Mapping for Links
// ==========================================
const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="h-4 w-4" />,
  About: <Info className="h-4 w-4" />,
  Academics: <GraduationCap className="h-4 w-4" />,
  Admissions: <FileText className="h-4 w-4" />,
  Faculty: <Users className="h-4 w-4" />,
  News: <Newspaper className="h-4 w-4" />,
  Events: <Calendar className="h-4 w-4" />,
  Gallery: <Image className="h-4 w-4" />,
  "Notice Board": <BookOpen className="h-4 w-4" />,
  Contact: <Contact2 className="h-4 w-4" />,
};

// ==========================================
// MobileNav Props
// ==========================================
interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  settings: SiteSettings | null;
}

// ==========================================
// MobileNav Component
// ==========================================
export function MobileNav({ open, onClose, settings }: MobileNavProps) {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const schoolName = settings?.schoolName || "Afridi Model School";

  const toggleSubmenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-[320px] max-w-[85vw] bg-background shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-2.5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <School className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight">{schoolName}</p>
                  <p className="text-[10px] text-muted-foreground">Menu</p>
                </div>
              </Link>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-2">
              <nav className="px-2 space-y-0.5">
                {NAV_LINKS.map((link, index) => {
                  const isActive = pathname === link.href;
                  const hasDropdown = "dropdown" in link && link.dropdown;
                  const isExpanded = expandedMenu === link.label;

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      {hasDropdown ? (
                        <div>
                          <button
                            onClick={() => toggleSubmenu(link.label)}
                            className={cn(
                              "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-foreground hover:bg-muted"
                            )}
                          >
                            <span className="flex items-center gap-3">
                              {iconMap[link.label]}
                              {link.label}
                            </span>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                isExpanded && "rotate-180"
                              )}
                            />
                          </button>
                          {/* Submenu */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="ml-8 border-l-2 border-muted pl-3 py-1 space-y-0.5">
                                  {link.dropdown!.map((sub) => (
                                    <Link
                                      key={sub.href}
                                      href={sub.href}
                                      onClick={onClose}
                                      className={cn(
                                        "block px-3 py-2 rounded-md text-sm transition-colors",
                                        pathname === sub.href
                                          ? "text-primary font-medium bg-primary/5"
                                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                      )}
                                    >
                                      {sub.label}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-muted"
                          )}
                        >
                          <span className="flex items-center gap-3">
                            {iconMap[link.label]}
                            {link.label}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* Footer */}
            <div className="border-t p-4 space-y-3">
              {/* Action Buttons */}
              <div className="space-y-2">
                <Link href="/admissions/apply" onClick={onClose}>
                  <Button className="w-full shadow-md">Apply Now 2026</Button>
                </Link>
                <Link href="/contact" onClick={onClose}>
                  <Button variant="outline" className="w-full">
                    Contact Us
                  </Button>
                </Link>
              </div>

              {/* Contact Info (Dynamic from DB) */}
              {(settings?.phone || settings?.email || settings?.address) && (
                <div className="pt-3 space-y-2 text-xs text-muted-foreground">
                  {settings.phone && (
                    <a
                      href={`tel:${settings.phone}`}
                      className="flex items-center gap-2 hover:text-foreground transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{settings.phone}</span>
                    </a>
                  )}
                  {settings.email && (
                    <a
                      href={`mailto:${settings.email}`}
                      className="flex items-center gap-2 hover:text-foreground transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{settings.email}</span>
                    </a>
                  )}
                  {settings.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="line-clamp-1">{settings.address}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}