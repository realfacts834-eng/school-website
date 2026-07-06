import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { db } from "@/lib/db";
import { cache } from "react";

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
// Public Layout
// ==========================================
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <>
      {/* Top Bar - Contact info, social links */}
      <TopBar />

      {/* Main Header with Navigation */}
      <Header settings={settings} />

      {/* Main Content */}
      <main className="min-h-screen">{children}</main>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </>
  );
}