import { Phone, Mail, Clock, MapPin, ChevronDown, Globe, LogIn } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { cache } from "react";
import { SocialLinks } from "@/components/shared/SocialLinks";

// ==========================================
// Data Fetching
// ==========================================
const getSettings = cache(async () => {
  try {
    const settings = await db.siteSetting.findFirst();
    return settings;
  } catch {
    return null;
  }
});

// ==========================================
// TopBar Component
// ==========================================
export async function TopBar() {
  const settings = await getSettings();

  // If no settings, don't render
  if (!settings) return null;

  const hasContactInfo = settings.phone || settings.email || settings.officeTiming;

  return (
    <div className="hidden lg:block bg-primary text-primary-foreground/90">
      <div className="container-custom">
        <div className="flex items-center justify-between py-1.5 text-xs">
          {/* Left: Contact Info */}
          <div className="flex items-center gap-6">
            {settings.phone && (
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 hover:text-primary-foreground transition-colors"
                title="Call us"
              >
                <Phone className="h-3 w-3" />
                <span>{settings.phone}</span>
              </a>
            )}
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-1.5 hover:text-primary-foreground transition-colors"
                title="Email us"
              >
                <Mail className="h-3 w-3" />
                <span className="max-w-[200px] truncate">{settings.email}</span>
              </a>
            )}
            {settings.officeTiming && (
              <span className="flex items-center gap-1.5" title="Office Hours">
                <Clock className="h-3 w-3" />
                <span>{settings.officeTiming}</span>
              </span>
            )}
            {settings.address && (
              <span className="flex items-center gap-1.5" title="Address">
                <MapPin className="h-3 w-3" />
                <span className="max-w-[200px] truncate">{settings.address}</span>
              </span>
            )}
          </div>

          {/* Right: Links & Social */}
          <div className="flex items-center gap-4">
            {/* Quick Links */}
            <nav className="flex items-center gap-3">
              <Link
                href="/notice-board"
                className="hover:text-primary-foreground transition-colors hover:underline underline-offset-2"
              >
                Notice Board
              </Link>
              <Link
                href="/results"
                className="hover:text-primary-foreground transition-colors hover:underline underline-offset-2"
              >
                Results
              </Link>
              <Link
                href="/faq"
                className="hover:text-primary-foreground transition-colors hover:underline underline-offset-2"
              >
                FAQ
              </Link>
              <Link
                href="/gallery"
                className="hover:text-primary-foreground transition-colors hover:underline underline-offset-2"
              >
                Gallery
              </Link>
            </nav>

            {/* Divider */}
            <div className="h-4 w-px bg-primary-foreground/20" />

            {/* Social Links (Compact) */}
            <SocialLinks settings={settings} variant="compact" />

            {/* Divider */}
            <div className="h-4 w-px bg-primary-foreground/20" />

            {/* Admin Login */}
            <Link
              href="/admin/login"
              className="flex items-center gap-1 hover:text-primary-foreground transition-colors hover:underline underline-offset-2"
              title="Admin Login"
            >
              <LogIn className="h-3 w-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}