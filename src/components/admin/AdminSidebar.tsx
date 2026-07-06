"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ADMIN_SIDEBAR } from "@/lib/constants";
import {
  LayoutDashboard,
  Newspaper,
  PenSquare,
  CalendarDays,
  Image,
  Users,
  FileText,
  ClipboardList,
  Award,
  Settings,
  LogOut,
  X,
  School,
  ChevronLeft,
  BarChart3,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// Icon Mapping
// ==========================================
const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-5 w-5" />,
  Newspaper: <Newspaper className="h-5 w-5" />,
  PenSquare: <PenSquare className="h-5 w-5" />,
  CalendarDays: <CalendarDays className="h-5 w-5" />,
  Image: <Image className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  FileText: <FileText className="h-5 w-5" />,
  ClipboardList: <ClipboardList className="h-5 w-5" />,
  Award: <Award className="h-5 w-5" />,
  BarChart3: <BarChart3 className="h-5 w-5" />,
  Settings: <Settings className="h-5 w-5" />,
};

// ==========================================
// Types
// ==========================================
interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

// ==========================================
// AdminSidebar Component
// ==========================================
export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setCollapsed((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label)
        ? prev.filter((g) => g !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard" || pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-card border-r shadow-xl",
          "transform transition-all duration-300 ease-in-out",
          "lg:translate-x-0 lg:static lg:z-auto",
          "flex flex-col",
          collapsed ? "w-16" : "w-64",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center border-b",
          collapsed ? "justify-center p-3" : "justify-between p-4"
        )}>
          {!collapsed && (
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <School className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">Admin Panel</p>
                <p className="text-[9px] text-muted-foreground leading-tight">
                  {session?.user?.role || "Admin"}
                </p>
              </div>
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <School className="h-4 w-4 text-primary-foreground" />
            </div>
          )}

          <div className="flex items-center gap-1">
            {/* Collapse Toggle (Desktop) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1 rounded-md hover:bg-muted transition-colors"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar (⌘B)"}
            >
              <ChevronLeft className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180"
              )} />
            </button>

            {/* Close (Mobile) */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {ADMIN_SIDEBAR.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-all duration-200 group relative",
                collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              {iconMap[item.icon]}
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {isActive(item.href) && (
                    <Sparkles className="h-3.5 w-3.5 opacity-70" />
                  )}
                </>
              )}

              {/* Active Indicator */}
              {isActive(item.href) && collapsed && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-foreground rounded-l-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className={cn(
          "border-t p-2",
          collapsed ? "space-y-1" : "space-y-1"
        )}>
          {/* User Info */}
          {!collapsed && (
            <div className="px-3 py-2 mb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                  {session?.user?.name?.charAt(0) || "A"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">
                    {session?.user?.name || "Admin"}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className={cn(
              "flex items-center rounded-lg text-sm font-medium transition-all duration-200 w-full",
              "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20",
              collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
            )}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}