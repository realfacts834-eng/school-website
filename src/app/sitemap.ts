import { db } from "@/lib/db";

export default async function sitemap() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const [news, events] = await Promise.all([
    db.news.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    db.event.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const newsUrls = news.map((item) => ({
    url: `${baseUrl}/news/${item.slug}`,
    lastModified: item.updatedAt,
  }));

  const eventUrls = events.map((item) => ({
    url: `${baseUrl}/events/${item.slug}`,
    lastModified: item.updatedAt,
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/admissions`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/news`, lastModified: new Date() },
    { url: `${baseUrl}/events`, lastModified: new Date() },
    { url: `${baseUrl}/gallery`, lastModified: new Date() },
    { url: `${baseUrl}/faculty`, lastModified: new Date() },
    ...newsUrls,
    ...eventUrls,
  ];
}