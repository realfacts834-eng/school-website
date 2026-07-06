import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscribeSchema } from "@/lib/validations";
import { sendEmail, subscriberWelcomeTemplate } from "@/lib/email";
import { getSiteSettings } from "@/lib/seo";
import { ZodError } from "zod";

// ==========================================
// POST - Subscribe to Newsletter
// ==========================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = subscribeSchema.parse(body);

    // Check if already subscribed
    const existing = await db.subscriber.findUnique({ where: { email } });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { success: true, message: "You are already subscribed!" },
          { status: 200 }
        );
      }

      // Reactivate subscription
      await db.subscriber.update({
        where: { email },
        data: { isActive: true },
      });

      return NextResponse.json(
        { success: true, message: "Subscription reactivated!" },
        { status: 200 }
      );
    }

    // Create new subscriber
    await db.subscriber.create({ data: { email } });

    // Send welcome email (non-blocking)
    try {
      const settings = await getSiteSettings();
      const schoolName = settings?.schoolName || "Our School";

      const welcomeHtml = subscriberWelcomeTemplate(email, {
        schoolName,
        schoolEmail: settings?.email,
      });

      await sendEmail({
        to: email,
        subject: `Welcome to ${schoolName} Newsletter!`,
        html: welcomeHtml,
      });

      console.log(`📧 Welcome email sent to ${email}`);
    } catch (emailError) {
      console.error("⚠️ Welcome email failed:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for subscribing! Check your email for confirmation.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Subscribe error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address",
          errors: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}

// ==========================================
// GET - Get Subscriber Count (Admin)
// ==========================================
export async function GET() {
  try {
    const count = await db.subscriber.count({ where: { isActive: true } });
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("❌ Subscriber count error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch count" },
      { status: 500 }
    );
  }
}