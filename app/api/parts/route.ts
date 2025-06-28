import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { withAuth, withAdminAuth, AuthUser } from "@/middleware/auth";
import { createPartSchema, updatePartSchema } from "@/utils/validation";
import { IPart } from "@/models/Part";
import { ObjectId } from "mongodb";
import { z } from "zod";

// GET /api/parts - Get all parts with search, filter, and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Search and filters
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const year = searchParams.get("year");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const inStock = searchParams.get("inStock") === "true";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const db = await getDatabase();
    const partsCollection = db.collection<IPart>("parts");

    // Build query
    const query: any = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { partNumber: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
        { searchKeywords: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (make) query["compatibility.make"] = { $in: [make] };
    if (model) query["compatibility.model"] = { $in: [model] };
    if (year) query["compatibility.year"] = { $in: [parseInt(year)] };
    if (minPrice) query.price = { ...query.price, $gte: parseFloat(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: parseFloat(maxPrice) };
    if (inStock) query.stock = { $gt: 0 };

    // Get total count for pagination
    const totalCount = await partsCollection.countDocuments(query);

    // Get parts with pagination and sorting
    const parts = await partsCollection
      .find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get aggregated data for filters
    const [categories, brands, makes] = await Promise.all([
      partsCollection.distinct("category", { isActive: true }),
      partsCollection.distinct("brand", { isActive: true }),
      partsCollection.distinct("compatibility.make", { isActive: true }),
    ]);

    return NextResponse.json({
      parts: parts.map((part) => ({
        ...part,
        _id: part._id!.toString(),
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      filters: {
        categories,
        brands,
        makes,
      },
    });
  } catch (error) {
    console.error("Get parts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch parts" },
      { status: 500 }
    );
  }
}

// POST /api/parts - Create new part (Admin only)
export const POST = withAdminAuth(
  async (request: NextRequest, user: AuthUser) => {
    try {
      const body = await request.json();

      let validatedData;
      try {
        validatedData = await createPartSchema.parseAsync(body);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            { error: "Validation failed", issues: error.errors },
            { status: 400 }
          );
        }
        throw error;
      }

      const db = await getDatabase();
      const partsCollection = db.collection<IPart>("parts");

      // Check if part number already exists
      const existingPart = await partsCollection.findOne({
        partNumber: validatedData.partNumber,
      });

      if (existingPart) {
        return NextResponse.json(
          { error: "Part with this part number already exists" },
          { status: 409 }
        );
      }

      // Create new part
      const newPart: Omit<IPart, "_id"> = {
        ...validatedData,
        currency: "USD",
        lowStockThreshold: validatedData.stock < 10 ? validatedData.stock : 10,
        isActive: true,
        isFeatured: false,
        averageRating: 0,
        reviewCount: 0,
        searchKeywords: validatedData.searchKeywords || [],
        tags: validatedData.tags || [],
        images: validatedData.images || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: new ObjectId(user.userId),
      };

      const result = await partsCollection.insertOne(newPart);

      if (!result.insertedId) {
        throw new Error("Failed to create part");
      }

      return NextResponse.json(
        {
          message: "Part created successfully",
          part: {
            id: result.insertedId.toString(),
            ...newPart,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Create part error:", error);
      return NextResponse.json(
        { error: "Failed to create part" },
        { status: 500 }
      );
    }
  }
);
