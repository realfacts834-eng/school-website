import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ==========================================
// POST - Webhook Handler
// ==========================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const signature = request.headers.get("x-webhook-signature");

    // Verify webhook secret (if configured)
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (webhookSecret && signature !== webhookSecret) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 401 }
      );
    }

    console.log("📨 Webhook received:", body);

    // Handle different webhook types
    const { type, data } = body;

    switch (type) {
      case "contact.created":
        // Handle new contact notification
        console.log("📞 New contact created:", data);
        break;

      case "admission.created":
        // Handle new admission notification
        console.log("🎓 New admission:", data);
        break;

      case "subscriber.created":
        // Handle new subscriber
        console.log("📧 New subscriber:", data);
        break;

      case "page.viewed":
        // Track page view
        if (data?.page) {
          await db.pageView.create({
            data: {
              page: data.page,
              referrer: data.referrer || null,
              device: data.device || "unknown",
              country: data.country || null,
            },
          });
        }
        break;

      case "cleanup":
        // Cleanup old data
        const daysToKeep = data?.days || 90;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - daysToKeep);

        const deleted = await db.pageView.deleteMany({
          where: { createdAt: { lt: cutoff } },
        });

        console.log(`🧹 Cleaned ${deleted.count} old records`);
        break;

      default:
        console.log("📨 Unknown webhook type:", type);
    }

    return NextResponse.json({
      success: true,
      message: "Webhook processed",
    });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { success: false, message: "Webhook processing failed" },
      { status: 500 }
    );
  }
}