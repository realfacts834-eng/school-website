import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { admissionSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { sendEmail, admissionEmailTemplate, admissionNotificationTemplate } from "@/lib/email";
import { getSiteSettings } from "@/lib/seo";
import { ZodError } from "zod";

// ==========================================
// GET - List Admissions (Admin Only)
// ==========================================
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "all") where.status = status;

    const [admissions, totalCount] = await Promise.all([
      db.admission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.admission.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: admissions,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("❌ Admissions fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch admissions" },
      { status: 500 }
    );
  }
}

// ==========================================
// POST - Submit Admission (Public)
// ==========================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = admissionSchema.parse(body);

    const admission = await db.admission.create({
      data: {
        ...validated,
        dob: new Date(validated.dob),
      },
    });

    // Send email notifications (non-blocking)
    try {
      const settings = await getSiteSettings();
      const schoolName = settings?.schoolName || "Our School";
      const adminEmail = process.env.ADMIN_EMAIL || settings?.email;

      // Send confirmation to parent
      if (validated.email) {
        const parentEmailHtml = admissionEmailTemplate(
          validated.studentName,
          validated.applyingClass,
          validated.fatherName,
          { schoolName, schoolEmail: settings?.email }
        );

        await sendEmail({
          to: validated.email,
          subject: `Admission Application Received - ${schoolName}`,
          html: parentEmailHtml,
        });
      }

      // Send notification to admin
      if (adminEmail) {
        const adminEmailHtml = admissionNotificationTemplate(
          validated.studentName,
          validated.applyingClass,
          validated.fatherName,
          validated.phone,
          { schoolName }
        );

        await sendEmail({
          to: adminEmail,
          subject: `New Admission: ${validated.studentName} - ${validated.applyingClass}`,
          html: adminEmailHtml,
        });
      }
    } catch (emailError) {
      console.error("⚠️ Admission email failed:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully! We'll contact you soon.",
        id: admission.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Admission submit error:", error);

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
      { success: false, message: "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}

// ==========================================
// PUT - Update Admission Status (Admin Only)
// ==========================================
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, status, remarks } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "approved", "rejected", "waitlist"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const existing = await db.admission.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    const admission = await db.admission.update({
      where: { id },
      data: { status, remarks },
    });

    // Send email on status change
    if (existing.email && status !== existing.status) {
      try {
        const settings = await getSiteSettings();
        const schoolName = settings?.schoolName || "Our School";

        const statusMessages: Record<string, string> = {
          approved: "Congratulations! Your admission application has been approved.",
          rejected: "We regret to inform you that your application has not been accepted.",
          waitlist: "Your application has been placed on the waitlist.",
        };

        if (statusMessages[status]) {
          await sendEmail({
            to: existing.email,
            subject: `Admission Update - ${schoolName}`,
            html: `<p>Dear Parent,</p><p>${statusMessages[status]}</p><p>Contact us for more information.</p>`,
          });
        }
      } catch (emailError) {
        console.error("⚠️ Status email failed:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      data: admission,
      message: `Application ${status} successfully`,
    });
  } catch (error) {
    console.error("❌ Admission update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update status" },
      { status: 500 }
    );
  }
}