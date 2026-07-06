import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { settingsSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { ZodError } from "zod";

// ==========================================
// GET - Get Settings (Public)
// ==========================================
export async function GET() {
  try {
    const settings = await db.siteSetting.findFirst();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("❌ Settings fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// ==========================================
// PUT - Update Settings (Admin Only)
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

    const body = await request.json();
    const validated = settingsSchema.parse(body);

    const existing = await db.siteSetting.findFirst();

    let settings;
    if (existing) {
      settings = await db.siteSetting.update({
        where: { id: existing.id },
        data: validated,
      });
    } else {
      settings = await db.siteSetting.create({
        data: { id: "default", ...validated },
      });
    }

    return NextResponse.json({
      success: true,
      data: settings,
      message: "Settings saved successfully",
    });
  } catch (error) {
    console.error("❌ Settings update error:", error);

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
      { success: false, message: "Failed to save settings" },
      { status: 500 }
    );
  }
}