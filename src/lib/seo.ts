import { db } from "./db";
import { cache } from "react";
import { Metadata } from "next";

// ==========================================
// Site Settings Cache (1 hour revalidation)
// ==========================================
export const getSiteSettings = cache(async () => {
  try {
    const settings = await db.siteSetting.findFirst();
    return settings;
  } catch (error) {
    console.error("❌ Failed to fetch site settings:", error);
    return null;
  }
});

// ==========================================
// Generate SEO Metadata
// ==========================================
interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "event";
  publishedAt?: string;
  author?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export async function generateMetadata({
  title,
  description,
  image,
  url,
  type = "website",
  publishedAt,
  author,
  keywords = [],
  noIndex = false,
}: SEOProps = {}): Promise<Metadata> {
  // Get site settings from DB
  const settings = await getSiteSettings();
  
  const schoolName = settings?.schoolName || "Afridi Model School & College";
  const defaultDescription = settings?.metaDescription || 
    "A premier educational institution dedicated to academic excellence and character building.";
  const defaultImage = settings?.ogImage || "/images/og-default.jpg";
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const siteName = schoolName;
  const twitterHandle = settings?.twitter?.replace("https://twitter.com/", "@") || "";

  // Build meta title
  const metaTitle = title 
    ? `${title} | ${schoolName}` 
    : `${schoolName} - ${settings?.tagline || "Building Future Leaders"}`;

  // Build meta description
  const metaDescription = description || defaultDescription;

  // Build keywords
  const defaultKeywords = [
    "school",
    "education",
    "college",
    schoolName,
    "Peshawar",
    "Pakistan",
    "academics",
    "admissions",
  ];
  const metaKeywords = [...defaultKeywords, ...keywords].join(", ");

  // Build canonical URL
  const canonicalUrl = url ? `${siteUrl}${url}` : siteUrl;

  // Build OpenGraph images
  const ogImages = image || defaultImage
    ? [{ 
        url: image || defaultImage,
        width: 1200,
        height: 630,
        alt: metaTitle,
      }]
    : [];

  return {
    // Basic
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    
    // Canonical
    alternates: {
      canonical: canonicalUrl,
    },
    
    // Robots
    robots: noIndex 
      ? { index: false, follow: false }
      : { index: true, follow: true, nocache: false },

    // Open Graph
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName,
      type,
      locale: "en_US",
      images: ogImages,
      ...(publishedAt && { publishedTime: publishedAt }),
      ...(author && { authors: [author] }),
      ...(type === "article" && {
        article: {
          publishedTime: publishedAt,
          authors: author ? [author] : [],
        },
      }),
    },

    // Twitter
    twitter: {
      card: "summary_large_image",
      site: twitterHandle || undefined,
      title: metaTitle,
      description: metaDescription,
      images: ogImages.length > 0 ? [ogImages[0].url] : [],
    },

    // Additional
    metadataBase: new URL(siteUrl),
    applicationName: schoolName,
    generator: "Next.js",
    creator: schoolName,
    publisher: schoolName,
    
    // Icons
    icons: {
      icon: settings?.favicon || "/images/favicon.ico",
      apple: "/icons/apple-icon-180x180.png",
    },

    // Verification (add later if needed)
    // verification: {
    //   google: "your-google-verification-code",
    // },
  };
}

// ==========================================
// Generate JSON-LD Structured Data
// ==========================================
export function generateOrganizationSchema(settings?: {
  schoolName?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: settings?.schoolName || "Afridi Model School & College",
    description: settings?.tagline || "Building Future Leaders",
    url: siteUrl,
    logo: settings?.logo ? `${siteUrl}${settings.logo}` : undefined,
    email: settings?.email,
    telephone: settings?.phone,
    address: settings?.address
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.address,
          addressCountry: "PK",
        }
      : undefined,
    sameAs: [
      settings?.facebook,
      settings?.twitter,
      settings?.instagram,
    ].filter(Boolean),
  };
}

// ==========================================
// Generate Article Schema (News/Blog)
// ==========================================
export function generateArticleSchema(article: {
  title: string;
  description?: string;
  image?: string;
  url: string;
  publishedAt: string;
  updatedAt: string;
  authorName: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    url: `${siteUrl}${article.url}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: article.authorName,
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: "Afridi Model School & College",
    },
  };
}

// ==========================================
// Generate Event Schema
// ==========================================
export function generateEventSchema(event: {
  title: string;
  description?: string;
  image?: string;
  url: string;
  startDate: string;
  endDate?: string;
  location?: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    image: event.image,
    url: `${siteUrl}${event.url}`,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    ...(event.location && {
      location: {
        "@type": "Place",
        name: event.location,
      },
    }),
    organizer: {
      "@type": "EducationalOrganization",
      name: "Afridi Model School & College",
    },
  };
}

// ==========================================
// Generate Breadcrumb Schema
// ==========================================
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

// ==========================================
// Generate FAQ Schema
// ==========================================
export function generateFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}