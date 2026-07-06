import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eventSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { ZodError } from "zod";

// ==========================================
// GET - List All Events
// ==========================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const type = searchParams.get("type"); // upcoming | past

    const where: any = {};

    if (status === "published") where.isPublished = true;
    if (status === "draft") where.isPublished = false;
    if (type === "upcoming") where.date = { gte: new Date() };
    if (type === "past") where.date = { lt: new Date() };

    const [events, totalCount] = await Promise.all([
      db.event.findMany({
        where,
        orderBy: { date: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.event.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: events,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("❌ Events fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// ==========================================
// POST - Create Event
// ==========================================
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = eventSchema.parse(body);

    let slug = slugify(validated.title);
    const existingSlug = await db.event.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const event = await db.event.create({
      data: {
        ...validated,
        slug,
        date: new Date(validated.date),
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        authorId: session.user.id as string,
      },
    });

    return NextResponse.json(
      { success: true, data: event, message: "Event created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Event create error:", error);

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
      { success: false, message: "Failed to create event" },
      { status: 500 }
    );
  }
}