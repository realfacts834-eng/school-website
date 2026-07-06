import type { Metadata, Viewport } from "next";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { CookieConsent } from "@/components/shared/CookieConsent";
import { InstallPWA } from "@/components/shared/InstallPWA";
import { Analytics } from "@/components/shared/Analytics";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import "@/styles/globals.css";

// ==========================================
// Fonts Configuration
// ==========================================
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Arial", "sans-serif"],
});

const urdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-urdu",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

// ==========================================
// Viewport Configuration
// ==========================================
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

// ==========================================
// Metadata Configuration
// ==========================================
export const metadata: Metadata = {
  title: {
    default: "Afridi Model School & College - Building Future Leaders",
    template: "%s | Afridi Model School & College",
  },
  description:
    "Afridi Model School & College - A premier educational institution dedicated to academic excellence, character building, and holistic development of students.",
  keywords: [
    "school",
    "education",
    "college",
    "Afridi Model School",
    "Peshawar",
    "Pakistan",
    "admissions",
    "students",
    "academics",
    "faculty",
    "results",
  ],
  authors: [{ name: "Afridi Model School & College", url: "https://afridischool.edu.pk" }],
  creator: "Afridi Model School & College",
  publisher: "Afridi Model School & College",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  formatDetection: {
    email: true,
    telephone: true,
    address: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Afridi Model School & College",
    title: "Afridi Model School & College - Building Future Leaders",
    description:
      "A premier educational institution dedicated to academic excellence and character building.",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Afridi Model School & College",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Afridi Model School & College",
    description: "Building Future Leaders",
    images: ["/images/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Google verification code add karein jab available ho
    // google: "your-google-verification-code",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/images/favicon.ico" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/icon-192x192.png",
        color: "#0F172A",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Afridi School",
  },
  applicationName: "Afridi Model School & College",
  generator: "Next.js 15",
  category: "Education",
  classification: "Educational Institution",
};

// ==========================================
// Root Layout
// ==========================================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${inter.variable} ${urdu.variable}`}
    >
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark", "system"]}
        >
          {/* Main Content */}
          {children}

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              classNames: {
                toast:
                  "group bg-background border-border text-foreground shadow-lg",
                title: "text-sm font-semibold",
                description: "text-xs text-muted-foreground",
                success: "border-l-4 border-l-green-500",
                error: "border-l-4 border-l-red-500",
                warning: "border-l-4 border-l-yellow-500",
                info: "border-l-4 border-l-blue-500",
              },
            }}
            closeButton
            richColors
            expand
            visibleToasts={5}
          />

          {/* Cookie Consent */}
          <CookieConsent />

          {/* PWA Install Prompt */}
          <InstallPWA />

          {/* Scroll to Top Button */}
          <ScrollToTop />

          {/* Analytics (Google Analytics) */}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}