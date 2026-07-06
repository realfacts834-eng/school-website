import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { cache } from "react";
import { FileText, ArrowRight, AlertCircle } from "lucide-react";

// ==========================================
// Metadata
// ==========================================
export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the terms and conditions for using our website and services.",
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
// Terms Page Component
// ==========================================
export default async function TermsPage() {
  const settings = await getSettings();
  const schoolName = settings?.schoolName || "Afridi Model School & College";
  const lastUpdated = "January 1, 2026";

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container-custom">
          <Breadcrumb items={[{ label: "Terms of Service" }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              📜 Legal
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-lg">
              Rules and guidelines for using {schoolName} website and services
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
                    <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground m-0">
                      Please read these terms carefully before using the {schoolName} website. 
                      By accessing this site, you agree to be bound by these terms and conditions.
                    </p>
                  </div>

                  <h2>1. Acceptance of Terms</h2>
                  <p>
                    By accessing and using this website, you accept and agree to be bound 
                    by these Terms of Service. If you do not agree with any part of these 
                    terms, you should not use this website.
                  </p>

                  <h2>2. Use of Website</h2>
                  <p>You agree to use this website only for lawful purposes and in a manner that:</p>
                  <ul>
                    <li>Does not infringe the rights of others</li>
                    <li>Does not restrict or inhibit anyone else&apos;s use of the website</li>
                    <li>Does not violate any applicable laws or regulations</li>
                    <li>Does not attempt to gain unauthorized access to our systems</li>
                  </ul>

                  <h2>3. Intellectual Property</h2>
                  <p>
                    All content on this website, including but not limited to text, images, 
                    logos, graphics, videos, and software, is the exclusive property of 
                    {schoolName} and is protected by applicable copyright and intellectual 
                    property laws.
                  </p>
                  <p>You may not:</p>
                  <ul>
                    <li>Reproduce or redistribute content without permission</li>
                    <li>Use our trademarks or logos without authorization</li>
                    <li>Modify or create derivative works from our content</li>
                  </ul>

                  <h2>4. User Submissions</h2>
                  <p>
                    Any information or materials you submit through our website (contact forms, 
                    admission applications, etc.) become our property. By submitting, you grant 
                    us the right to use this information to provide our services.
                  </p>

                  <h2>5. Third-Party Links</h2>
                  <p>
                    Our website may contain links to third-party websites for your convenience. 
                    We do not endorse or assume responsibility for the content, privacy policies, 
                    or practices of any third-party sites.
                  </p>

                  <h2>6. Disclaimer of Warranties</h2>
                  <p>
                    This website is provided &ldquo;as is&rdquo; without any representations or warranties, 
                    express or implied. We do not warrant that the website will be constantly 
                    available or completely error-free.
                  </p>

                  <h2>7. Limitation of Liability</h2>
                  <p>
                    {schoolName} shall not be liable for any direct, indirect, incidental, or 
                    consequential damages arising from the use or inability to use this website 
                    or its services.
                  </p>

                  <h2>8. Indemnification</h2>
                  <p>
                    You agree to indemnify and hold harmless {schoolName}, its employees, 
                    agents, and affiliates from any claims or demands arising from your use 
                    of the website or violation of these terms.
                  </p>

                  <h2>9. Admission Terms</h2>
                  <p>
                    Submission of an admission application does not guarantee admission. 
                    Admission decisions are based on eligibility criteria, availability of seats, 
                    and the school&apos;s admission policies.
                  </p>

                  <h2>10. Changes to Terms</h2>
                  <p>
                    We reserve the right to modify these Terms of Service at any time without 
                    prior notice. Changes will be effective immediately upon posting. Continued 
                    use of the website after modifications constitutes acceptance of the updated terms.
                  </p>

                  <h2>11. Governing Law</h2>
                  <p>
                    These terms shall be governed by and construed in accordance with the laws 
                    of Pakistan. Any disputes shall be subject to the exclusive jurisdiction of 
                    the courts in Peshawar.
                  </p>

                  <h2>12. Contact Information</h2>
                  <p>
                    For questions or concerns regarding these Terms of Service, please contact us 
                    through our contact page or at the address below:
                  </p>
                  {settings?.email && (
                    <p>
                      📧 <a href={`mailto:${settings.email}`}>{settings.email}</a>
                    </p>
                  )}
                  {settings?.phone && (
                    <p>
                      📞 {settings.phone}
                    </p>
                  )}
                </div>

                {/* CTA */}
                <div className="text-center pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-4">
                    Have questions about our terms?
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