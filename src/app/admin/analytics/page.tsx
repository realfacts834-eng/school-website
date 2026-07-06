import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAnalytics, getRealtimeStats } from "@/lib/analytics";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Analytics",
};

// ==========================================
// Analytics Page Component
// ==========================================
export default async function AnalyticsPage() {
  const analytics = await getAnalytics(30);
  const realtime = await getRealtimeStats();

  const deviceIcons: Record<string, React.ReactNode> = {
    desktop: <Monitor className="h-4 w-4" />,
    mobile: <Smartphone className="h-4 w-4" />,
    tablet: <Tablet className="h-4 w-4" />,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Website traffic and visitor statistics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Eye className="h-5 w-5 text-blue-600" />
              <span className={cn(
                "text-xs font-medium flex items-center gap-1",
                analytics.percentChange.startsWith("-") ? "text-red-600" : "text-green-600"
              )}>
                {analytics.percentChange.startsWith("-") ? (
                  <ArrowDownRight className="h-3 w-3" />
                ) : (
                  <ArrowUpRight className="h-3 w-3" />
                )}
                {analytics.percentChange}
              </span>
            </div>
            <p className="text-2xl font-bold">{analytics.todayViews.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Page Views Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <TrendingUp className="h-5 w-5 text-green-600 mb-3" />
            <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Views (30 days)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <Globe className="h-5 w-5 text-purple-600 mb-3" />
            <p className="text-2xl font-bold">{realtime.uniqueCountries || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Countries (24h)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <Users className="h-5 w-5 text-orange-600 mb-3" />
            <p className="text-2xl font-bold">{realtime.uniquePages || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Active Pages (24h)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Top Pages
            </CardTitle>
            <CardDescription>Most visited pages in last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topPages.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {analytics.topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                        index === 0 ? "bg-yellow-100 text-yellow-700" :
                        index === 1 ? "bg-gray-100 text-gray-700" :
                        index === 2 ? "bg-orange-100 text-orange-700" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </span>
                      <span className="text-sm truncate">{page.page || "/"}</span>
                    </div>
                    <span className="text-sm font-semibold shrink-0 ml-2">
                      {page.views.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Device Breakdown
            </CardTitle>
            <CardDescription>Visitor devices in last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.deviceBreakdown.length === 0 ? (
              <div className="text-center py-8">
                <Monitor className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No data yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.deviceBreakdown.map((device) => {
                  const total = analytics.deviceBreakdown.reduce((sum, d) => sum + d.count, 0);
                  const percentage = total > 0 ? Math.round((device.count / total) * 100) : 0;
                  
                  return (
                    <div key={device.device}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm flex items-center gap-2 capitalize">
                          {deviceIcons[device.device] || <Smartphone className="h-4 w-4" />}
                          {device.device}
                        </span>
                        <span className="text-sm font-semibold">{percentage}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            device.device === "desktop" ? "bg-blue-500" :
                            device.device === "mobile" ? "bg-green-500" : "bg-purple-500"
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Top Countries
            </CardTitle>
            <CardDescription>Visitor locations in last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.countryBreakdown.length === 0 ? (
              <div className="text-center py-8">
                <Globe className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {analytics.countryBreakdown.map((country) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <span className="text-sm">{country.country}</span>
                    <span className="text-sm font-semibold">{country.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Monthly Overview
            </CardTitle>
            <CardDescription>Last 30 days traffic</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.chartData.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No data yet</p>
              </div>
            ) : (
              <div>
                <div className="flex items-end gap-1 h-32 mb-4">
                  {analytics.chartData.slice(-14).map((day) => {
                    const maxViews = Math.max(...analytics.chartData.map(d => d.views), 1);
                    const heightPercent = (day.views / maxViews) * 100;
                    
                    return (
                      <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                        <div
                          className="w-full bg-primary/20 hover:bg-primary/40 rounded-t transition-colors cursor-pointer min-h-[4px]"
                          style={{ height: `${Math.max(heightPercent, 4)}%` }}
                        />
                        <span className="text-[9px] text-muted-foreground hidden group-hover:block absolute -bottom-5">
                          {day.views}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>14 days ago</span>
                  <span>Today</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* This Month Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Views</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{analytics.todayViews.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Today</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{analytics.thisMonthViews.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{analytics.topPages.length}</p>
              <p className="text-xs text-muted-foreground">Active Pages</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}