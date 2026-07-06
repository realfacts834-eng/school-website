import { Metadata } from "next";
import { AdminLayoutClient } from "./sidebar-wrapper";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: {
    default: "Admin Panel",
    template: "%s | Admin Panel",
  },
  robots: { index: false, follow: false },
};

// ==========================================
// Admin Layout (Server Component)
// ==========================================
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}