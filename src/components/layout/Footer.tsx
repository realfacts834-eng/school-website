import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  School,
  Clock,
  Send,
  ArrowUpRight,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { cache } from "react";

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
// Footer Links
// ==========================================
const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Admissions", href: "/admissions" },
  { label: "Faculty", href: "/faculty" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
];

const resources = [
  { label: "Notice Board", href: "/notice-board" },
  { label: "Results", href: "/results" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
];

const socialLinks = [
  { icon: Facebook, href: "facebook", label: "Facebook" },
  { icon: Twitter, href: "twitter", label: "Twitter" },
  { icon: Instagram, href: "instagram", label: "Instagram" },
  { icon: Youtube, href: "youtube", label: "Youtube" },
  { icon: Linkedin, href: "linkedin", label: "LinkedIn" },
];

// ==========================================
// Footer Component
// ==========================================
export async function Footer() {
  const settings = await getSettings();
  const schoolName = settings?.schoolName || "Afridi Model School & College";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: About */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <School className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-bold leading-tight">{schoolName}</p>
                <p className="text-[10px] text-muted-foreground">
                  {settings?.tagline || "Building Future Leaders"}
                </p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              A premier educational institution dedicated to academic excellence, 
              character building, and holistic development of students since 1998.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => {
                const url = settings?.[href as keyof typeof settings];
                if (!url) return null;
                return (
                  <a
                    key={label}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition-all duration-200 border border-border"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-3 transition-all duration-200 overflow-hidden">
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-foreground">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-3 transition-all duration-200 overflow-hidden">
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-foreground">
              Contact & Newsletter
            </h3>

            {/* Contact Info */}
            <ul className="space-y-3 mb-6">
              {settings?.address && (
                <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.phone && (
                <li className="flex items-center gap-2.5 text-sm">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-2.5 text-sm">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.officeTiming && (
                <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0 text-primary" />
                  <span>{settings.officeTiming}</span>
                </li>
              )}
            </ul>

            {/* Newsletter */}
            <div>
              <p className="text-sm font-medium mb-2">Subscribe to Newsletter</p>
              <form className="flex gap-2" action="/api/subscribe" method="POST">
                <Input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  className="h-9 text-sm"
                  required
                />
                <Button type="submit" size="sm" className="shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            &copy; {currentYear} {schoolName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
          <p className="text-xs text-muted-foreground/60 flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for Education
          </p>
        </div>
      </div>
    </footer>
  );
}