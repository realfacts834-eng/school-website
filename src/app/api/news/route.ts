import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { ZodError } from "zod";

// ==========================================
// GET - List All News
// ==========================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status"); // published | draft

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status === "published") where.isPublished = true;
    if (status === "draft") where.isPublished = false;

    const [news, totalCount] = await Promise.all([
      db.news.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: { name: true, image: true },
          },
        },
      }),
      db.news.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: news,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("❌ News fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

// ==========================================
// POST - Create News
// ==========================================
export async function POST(request: Request) {
  try {
    // Auth check
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = newsSchema.parse(body);

    // Generate unique slug
    let slug = slugify(validated.title);
    const existingSlug = await db.news.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const news = await db.news.create({
      data: {
        ...validated,
        slug,
        authorId: session.user.id as string,
      },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(
      { success: true, data: news, message: "News created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ News create error:", error);

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
      { success: false, message: "Failed to create news" },
      { status: 500 }
    );
  }
}