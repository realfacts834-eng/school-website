import { db } from "./db";
import { headers } from "next/headers";
import { cache } from "react";

// ==========================================
// Page View Tracking (Server Component)
// ==========================================
export async function trackPageView(page: string) {
  try {
    const headersList = await headers();
    const referrer = headersList.get("referer") || undefined;
    const userAgent = headersList.get("user-agent") || undefined;

    // Device Detection
    let device = "desktop";
    if (userAgent) {
      if (/mobile|android|iphone|ipad|ipod/i.test(userAgent)) device = "mobile";
      else if (/tablet|ipad/i.test(userAgent)) device = "tablet";
    }

    // Country Detection (Vercel/Cloudflare headers)
    const country = headersList.get("x-vercel-ip-country") || 
                    headersList.get("cf-ipcountry") || 
                    null;

    // Non-blocking insert
    db.pageView.create({
      data: {
        page: page.substring(0, 200),
        referrer: referrer?.substring(0, 500) || null,
        device,
        country,
      },
    }).catch(err => console.error("Analytics insert failed:", err));

  } catch (error) {
    // Silent fail - analytics should never break the app
    console.error("Analytics tracking failed:", error);
  }
}

// ==========================================
// Get Dashboard Analytics (Cached)
// ==========================================
export const getAnalytics = cache(async (days: number = 30) => {
  try {
    const now = new Date();
    const since = new Date();
    since.setDate(since.getDate() - days);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalViews,
      todayViews,
      yesterdayViews,
      thisMonthViews,
      topPages,
      deviceBreakdown,
      countryBreakdown,
      dailyViews,
    ] = await Promise.all([
      // Total views
      db.pageView.count(),

      // Today's views
      db.pageView.count({
        where: { createdAt: { gte: today } },
      }),

      // Yesterday's views
      db.pageView.count({
        where: {
          createdAt: {
            gte: yesterday,
            lt: today,
          },
        },
      }),

      // This month
      db.pageView.count({
        where: { createdAt: { gte: thisMonth } },
      }),

      // Top pages
      db.pageView.groupBy({
        by: ["page"],
        _count: { page: true },
        orderBy: { _count: { page: "desc" } },
        take: 10,
        where: { createdAt: { gte: since } },
      }),

      // Device breakdown
      db.pageView.groupBy({
        by: ["device"],
        _count: { device: true },
        where: { createdAt: { gte: since } },
      }),

      // Country breakdown
      db.pageView.groupBy({
        by: ["country"],
        _count: { country: true },
        orderBy: { _count: { country: "desc" } },
        take: 10,
        where: {
          createdAt: { gte: since },
          country: { not: null },
        },
      }),

      // Daily views for chart
      db.pageView.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    // Process daily views into chart data
    const dailyMap = new Map<string, number>();
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dailyMap.set(date.toISOString().split("T")[0], 0);
    }

    dailyViews.forEach((view) => {
      const dateKey = view.createdAt.toISOString().split("T")[0];
      dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + 1);
    });

    const chartData = Array.from(dailyMap.entries())
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate percentage change
    const yesterdayCount = yesterdayViews;
    const todayCount = todayViews;
    const percentChange = yesterdayCount > 0
      ? ((todayCount - yesterdayCount) / yesterdayCount * 100).toFixed(1)
      : "100";

    return {
      totalViews,
      todayViews,
      yesterdayViews,
      thisMonthViews,
      percentChange: `${percentChange}%`,
      topPages: topPages.map(p => ({
        page: p.page,
        views: p._count.page,
      })),
      deviceBreakdown: deviceBreakdown.map(d => ({
        device: d.device || "unknown",
        count: d._count.device,
      })),
      countryBreakdown: countryBreakdown.map(c => ({
        country: c.country,
        count: c._count.country,
      })),
      chartData,
    };
  } catch (error) {
    console.error("Analytics fetch failed:", error);
    return {
      totalViews: 0,
      todayViews: 0,
      yesterdayViews: 0,
      thisMonthViews: 0,
      percentChange: "0%",
      topPages: [],
      deviceBreakdown: [],
      countryBreakdown: [],
      chartData: [],
    };
  }
});

// ==========================================
// Get Real-time Stats (Last 24 hours)
// ==========================================
export const getRealtimeStats = cache(async () => {
  try {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const [totalViews, uniquePages, uniqueCountries] = await Promise.all([
      db.pageView.count({ where: { createdAt: { gte: last24h } } }),
      db.pageView.groupBy({
        by: ["page"],
        where: { createdAt: { gte: last24h } },
      }).then(r => r.length),
      db.pageView.groupBy({
        by: ["country"],
        where: { 
          createdAt: { gte: last24h },
          country: { not: null },
        },
      }).then(r => r.length),
    ]);

    return { totalViews, uniquePages, uniqueCountries };
  } catch {
    return { totalViews: 0, uniquePages: 0, uniqueCountries: 0 };
  }
});

// ==========================================
// Track Event (Custom events)
// ==========================================
export async function trackEvent(
  eventName: string,
  properties: Record<string, string> = {}
) {
  try {
    console.log(`📊 Event: ${eventName}`, properties);
    
    // Store as page view with event prefix
    await db.pageView.create({
      data: {
        page: `[EVENT] ${eventName}`,
        referrer: JSON.stringify(properties).substring(0, 500),
        device: "event",
      },
    }).catch(() => {});
  } catch {
    // Silent fail
  }
}

// ==========================================
// Cleanup old analytics data
// ==========================================
export async function cleanupOldAnalytics(daysToKeep: number = 90) {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysToKeep);

    const deleted = await db.pageView.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });

    console.log(`🧹 Cleaned ${deleted.count} old analytics records`);
    return deleted.count;
  } catch (error) {
    console.error("Analytics cleanup failed:", error);
    return 0;
  }
}