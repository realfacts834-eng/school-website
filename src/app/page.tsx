import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { HeroSection } from "@/components/home/HeroSection";
import { NewsTicker } from "@/components/home/NewsTicker";
import { StatsCounter } from "@/components/home/StatsCounter";
import { LatestNews } from "@/components/home/LatestNews";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { CTASection } from "@/components/home/CTASection";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { db } from "@/lib/db";
import { cache } from "react";
import type { Metadata } from "next";

// ==========================================
// SEO Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to Afridi Model School & College - A premier educational institution dedicated to academic excellence and character building.",
  openGraph: {
    title: "Afridi Model School & College - Building Future Leaders",
    description:
      "A premier educational institution dedicated to academic excellence and character building.",
    images: [{ url: "/images/hero-bg.webp", width: 1200, height: 630 }],
  },
};

// ==========================================
// Data Fetching (Cached)
// ==========================================
const getHomeData = cache(async () => {
  try {
    const [
      settings,
      students,
      faculty,
      events,
      news,
      publishedNews,
      upcomingEvents,
      albums,
      notices,
    ] = await Promise.all([
      db.siteSetting.findFirst(),
      db.admission.count({ where: { status: "approved" } }),
      db.faculty.count({ where: { isActive: true } }),
      db.event.count({ where: { isPublished: true } }),
      db.news.count({ where: { isPublished: true } }),
      db.news.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          isBreaking: true,
          createdAt: true,
          author: { select: { name: true } },
        },
      }),
      db.event.findMany({
        where: { isPublished: true, date: { gte: new Date() } },
        orderBy: { date: "asc" },
        take: 3,
        select: {
          id: true,
          title: true,
          slug: true,
          date: true,
          time: true,
          location: true,
          image: true,
        },
      }),
      db.gallery.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true,
          images: { take: 1, select: { url: true } },
        },
      }),
      db.notice.findMany({
        where: { isPublished: true },
        orderBy: [{ isUrgent: "desc" }, { createdAt: "desc" }],
        take: 5,
        select: {
          id: true,
          title: true,
          isUrgent: true,
          createdAt: true,
        },
      }),
    ]);

    const stats = [
      { label: "Students", value: students, icon: "GraduationCap" },
      { label: "Teachers", value: faculty, icon: "Users" },
      { label: "Events", value: events, icon: "Calendar" },
      { label: "News", value: news, icon: "Newspaper" },
    ];

    return {
      settings,
      stats,
      publishedNews,
      upcomingEvents,
      albums,
      notices,
    };
  } catch (error) {
    console.error("❌ Home data fetch failed:", error);
    return {
      settings: null,
      stats: [],
      publishedNews: [],
      upcomingEvents: [],
      albums: [],
      notices: [],
    };
  }
});

// ==========================================
// Home Page Component
// ==========================================
export default async function HomePage() {
  const data = await getHomeData();

  return (
    <>
      {/* Top Bar */}
      <TopBar settings={data.settings} />

      {/* Header with Navigation */}
      <Header settings={data.settings} />

      {/* Mobile Navigation */}
      <MobileNav />

      <main className="flex flex-col">
        {/* News Ticker */}
        <Suspense fallback={<div className="h-10 bg-muted animate-pulse" />}>
          <NewsTicker notices={data.notices} />
        </Suspense>

        {/* Hero Section */}
        <Suspense fallback={<div className="h-[80vh] bg-muted animate-pulse" />}>
          <HeroSection settings={data.settings} />
        </Suspense>

        {/* Stats Counter */}
        <Suspense
          fallback={
            <div className="h-32 flex items-center justify-center">
              <LoadingSpinner size="md" />
            </div>
          }
        >
          <StatsCounter stats={data.stats} />
        </Suspense>

        {/* Latest News Section */}
        <section className="section bg-muted/30">
          <div className="container-custom">
            <SectionHeading
              title="Latest News"
              subtitle="Stay updated with the latest happenings at our school"
              align="center"
            />
            <Suspense
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton h-64 rounded-lg" />
                  ))}
                </div>
              }
            >
              <LatestNews news={data.publishedNews} />
            </Suspense>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="section">
          <div className="container-custom">
            <SectionHeading
              title="Upcoming Events"
              subtitle="Join us in our upcoming activities and programs"
              align="center"
            />
            <Suspense
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton h-72 rounded-lg" />
                  ))}
                </div>
              }
            >
              <UpcomingEvents events={data.upcomingEvents} />
            </Suspense>
          </div>
        </section>

        {/* Gallery Preview */}
        <section className="section bg-muted/30">
          <div className="container-custom">
            <SectionHeading
              title="Gallery"
              subtitle="A glimpse into our vibrant school life"
              align="center"
              action={{ label: "View All", href: "/gallery" }}
            />
            <Suspense
              fallback={
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="skeleton aspect-square rounded-lg" />
                  ))}
                </div>
              }
            >
              <GalleryPreview albums={data.albums} />
            </Suspense>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section">
          <div className="container-custom">
            <SectionHeading
              title="What People Say"
              subtitle="Hear from our students, parents, and alumni"
              align="center"
            />
            <Suspense
              fallback={
                <div className="skeleton h-48 rounded-lg max-w-2xl mx-auto mt-8" />
              }
            >
              <Testimonials />
            </Suspense>
          </div>
        </section>

        {/* CTA Section */}
        <Suspense fallback={<div className="skeleton h-64" />}>
          <CTASection settings={data.settings} />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer settings={data.settings} />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </>
  );
}

// ==========================================
// Revalidation (ISR)
// ==========================================
export const revalidate = 60; // Revalidate every 60 seconds