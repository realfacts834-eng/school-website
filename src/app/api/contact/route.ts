import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSchema } from "@/lib/validations";
import { sendEmail, contactEmailTemplate } from "@/lib/email";
import { getSiteSettings } from "@/lib/seo";
import { ZodError } from "zod";

// ==========================================
// POST - Submit Contact Form
// ==========================================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validated = contactSchema.parse(body);

    // Save to database
    const contact = await db.contact.create({
      data: validated,
    });

    // Send email notification (non-blocking)
    try {
      const settings = await getSiteSettings();
      const schoolName = settings?.schoolName || "Our School";
      const adminEmail = process.env.ADMIN_EMAIL || settings?.email;

      if (adminEmail) {
        const emailHtml = contactEmailTemplate(
          validated.name,
          validated.email,
          validated.phone || null,
          validated.subject,
          validated.message,
          { schoolName }
        );

        await sendEmail({
          to: adminEmail,
          subject: `New Contact: ${validated.subject}`,
          html: emailHtml,
          replyTo: validated.email,
        });

        console.log(`📧 Contact notification sent to ${adminEmail}`);
      }
    } catch (emailError) {
      // Don't fail the request if email fails
      console.error("⚠️ Contact email notification failed:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully! We'll get back to you soon.",
        id: contact.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Contact error:", error);

    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message. Please try again.",
      },
      { status: 500 }
    );
  }
}