"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { usePathname } from "next/navigation";

// ==========================================
// Page Title Mapping
// ==========================================
const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/dashboard": "Dashboard",
  "/admin/news": "News Management",
  "/admin/blog": "Blog Management",
  "/admin/events": "Events Management",
  "/admin/gallery": "Gallery Management",
  "/admin/faculty": "Faculty Management",
  "/admin/admissions": "Admissions",
  "/admin/notice-board": "Notice Board",
  "/admin/results": "Results",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Settings",
};

// ==========================================
// AdminLayoutClient Component
// ==========================================
export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Get page title based on pathname
  const getPageTitle = () => {
    // Check exact match first
    if (pageTitles[pathname]) return pageTitles[pathname];

    // Check parent paths
    for (const [path, title] of Object.entries(pageTitles)) {
      if (pathname.startsWith(path + "/")) return title;
    }

    return "Admin Panel";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Header */}
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          title={getPageTitle()}
        />

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}