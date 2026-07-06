"use client";

import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  Command,
  Sun,
  Moon,
  Monitor,
  Shield,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getGreeting } from "@/lib/utils";

// ==========================================
// Types
// ==========================================
interface AdminHeaderProps {
  onMenuClick: () => void;
  title?: string;
  notifications?: Array<{
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
  }>;
}

// ==========================================
// AdminHeader Component
// ==========================================
export function AdminHeader({ onMenuClick, title }: AdminHeaderProps) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const greeting = getGreeting();
  const userName = session?.user?.name || "Admin";
  const userRole = session?.user?.role || "admin";

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Page Title */}
          <h1 className="text-lg font-bold text-foreground hidden sm:block">
            {title || "Dashboard"}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1.5">
          {/* Search Trigger */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(true)}
            className="hidden md:flex items-center gap-2 text-muted-foreground"
          >
            <Search className="h-4 w-4" />
            <span className="text-xs">Search...</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono ml-2">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </Button>

          {/* Theme Toggle */}
          <div className="flex items-center border rounded-lg p-0.5">
            <button
              onClick={() => setTheme("light")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                theme === "light" ? "bg-muted text-foreground" : "text-muted-foreground"
              )}
              title="Light mode"
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setTheme("system")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                theme === "system" ? "bg-muted text-foreground" : "text-muted-foreground"
              )}
              title="System mode"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                theme === "dark" ? "bg-muted text-foreground" : "text-muted-foreground"
              )}
              title="Dark mode"
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
            </Button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-xl shadow-xl z-50"
                >
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">Notifications</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        3 New
                      </span>
                    </div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    <div className="p-8 text-center">
                      <Bell className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No new notifications</p>
                    </div>
                  </div>
                  <div className="p-2 border-t">
                    <button className="w-full text-xs text-center text-primary hover:underline py-1">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-muted transition-colors border-l"
            >
              {/* Avatar */}
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-bold shadow-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold leading-tight">{userName}</p>
                <p className="text-[10px] text-muted-foreground leading-tight capitalize">
                  {userRole}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-muted-foreground transition-transform hidden md:block",
                  showProfile && "rotate-180"
                )}
              />
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-xl shadow-xl z-50"
                >
                  {/* User Info */}
                  <div className="p-3 border-b">
                    <p className="text-sm font-semibold">{userName}</p>
                    <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Shield className="h-3 w-3 text-primary" />
                      <span className="text-[10px] font-medium text-primary capitalize">
                        {userRole}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-1.5">
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        router.push("/admin/settings");
                      }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                    >
                      <UserCircle className="h-4 w-4 text-muted-foreground" />
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        router.push("/admin/settings");
                      }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      Settings
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="p-1.5 border-t">
                    <button
                      onClick={() => signOut({ callbackUrl: "/admin/login" })}
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}