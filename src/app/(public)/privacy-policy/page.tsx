import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { cache } from "react";
import { Shield, ArrowRight, Mail } from "lucide-react";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how we collect, use, and protect your personal information.",
  robots: { index: true, follow: true },
};

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
// Privacy Policy Page Component
// ==========================================
export default async function PrivacyPolicyPage() {
  const settings = await getSettings();
  const schoolName = settings?.schoolName || "Afridi Model School & College";
  const lastUpdated = "January 1, 2026";

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container-custom">
          <Breadcrumb items={[{ label: "Privacy Policy" }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              🔒 Privacy
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-lg">
              How {schoolName} collects, uses, and protects your information
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-md">
              <CardContent className="p-8 md:p-10">
                <div className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-heading prose-headings:scroll-mt-20
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline">

                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg mb-8">
                    <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground m-0">
                      At {schoolName}, we take your privacy seriously. This policy describes 
                      how we collect, use, and protect your personal information.
                    </p>
                  </div>

                  <h2>1. Information We Collect</h2>
                  <p>
                    We collect information you provide directly to us, such as when you:
                  </p>
                  <ul>
                    <li>Fill out a contact form or inquiry</li>
                    <li>Submit an admission application</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Register for events or activities</li>
                  </ul>
                  <p>
                    This information may include your name, email address, phone number, 
                    mailing address, and other relevant details.
                  </p>

                  <h2>2. How We Use Information</h2>
                  <p>We use the collected information to:</p>
                  <ul>
                    <li>Respond to your inquiries and requests</li>
                    <li>Process admission applications</li>
                    <li>Send newsletters, updates, and announcements</li>
                    <li>Improve our website and services</li>
                    <li>Comply with legal obligations</li>
                  </ul>

                  <h2>3. Cookies & Tracking</h2>
                  <p>
                    Our website uses cookies to enhance your browsing experience. 
                    You can control cookie preferences through your browser settings. 
                    Essential cookies are required for the website to function properly.
                  </p>

                  <h2>4. Data Sharing</h2>
                  <p>
                    We do not sell, trade, or rent your personal information to third parties. 
                    We may share data with trusted service providers who assist us in 
                    operating our website and services, subject to confidentiality agreements.
                  </p>

                  <h2>5. Data Security</h2>
                  <p>
                    We implement reasonable security measures to protect your personal 
                    information from unauthorized access, alteration, disclosure, or 
                    destruction. However, no method of transmission over the Internet 
                    is 100% secure.
                  </p>

                  <h2>6. Your Rights</h2>
                  <p>You have the right to:</p>
                  <ul>
                    <li>Access your personal data</li>
                    <li>Request correction of inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Withdraw consent for data processing</li>
                    <li>Lodge a complaint with relevant authorities</li>
                  </ul>

                  <h2>7. Third-Party Links</h2>
                  <p>
                    Our website may contain links to third-party websites. We are not 
                    responsible for the privacy practices of these external sites.
                  </p>

                  <h2>8. Children&apos;s Privacy</h2>
                  <p>
                    We do not knowingly collect personal information from children under 
                    13 without parental consent. Parents/guardians may contact us to 
                    review or delete their child&apos;s information.
                  </p>

                  <h2>9. Changes to This Policy</h2>
                  <p>
                    We may update this privacy policy from time to time. Changes will be 
                    posted on this page with an updated revision date.
                  </p>

                  <h2>10. Contact Us</h2>
                  <p>
                    If you have any questions about this Privacy Policy, please contact us:
                  </p>
                  {settings?.email && (
                    <p>
                      <Mail className="h-4 w-4 inline mr-1" />
                      <a href={`mailto:${settings.email}`}>{settings.email}</a>
                    </p>
                  )}
                </div>

                {/* CTA */}
                <div className="text-center pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-4">
                    Have questions about our privacy practices?
                  </p>
                  <Link href="/contact">
                    <Button variant="outline" className="gap-2">
                      Contact Us
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}