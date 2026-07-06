import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { ZodError } from "zod";

// ==========================================
// GET - Single News
// ==========================================
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const news = await db.news.findUnique({
      where: { id },
      include: { author: { select: { name: true, image: true } } },
    });

    if (!news) {
      return NextResponse.json(
        { success: false, message: "News not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("❌ News fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

// ==========================================
// PUT - Update News
// ==========================================
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validated = newsSchema.parse(body);

    // Check if news exists
    const existing = await db.news.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "News not found" },
        { status: 404 }
      );
    }

    // Generate unique slug (if title changed)
    let slug = existing.slug;
    if (validated.title !== existing.title) {
      slug = slugify(validated.title);
      const slugExists = await db.news.findFirst({
        where: { slug, id: { not: id } },
      });
      if (slugExists) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
    }

    const news = await db.news.update({
      where: { id },
      data: {
        ...validated,
        slug,
      },
      include: {
        author: { select: { name: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: news,
      message: "News updated successfully",
    });
  } catch (error) {
    console.error("❌ News update error:", error);

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
      { success: false, message: "Failed to update news" },
      { status: 500 }
    );
  }
}

// ==========================================
// DELETE - Delete News
// ==========================================
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if exists
    const existing = await db.news.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "News not found" },
        { status: 404 }
      );
    }

    await db.news.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    console.error("❌ News delete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete news" },
      { status: 500 }
    );
  }
}