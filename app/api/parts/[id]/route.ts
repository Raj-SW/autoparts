import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { withAdminAuth, AuthUser } from "@/middleware/auth";
import { updatePartSchema } from "@/utils/validation";
import { IPart } from "@/models/Part";
import { ObjectId } from "mongodb";
import { z } from "zod";

// GET /api/parts/[id] - Get single part details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid part ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const partsCollection = db.collection<IPart>("parts");

    const part = await partsCollection.findOne({
      _id: new ObjectId(id),
      isActive: true,
    });

    if (!part) {
      return NextResponse.json({ error: "Part not found" }, { status: 404 });
    }

    return NextResponse.json({
      part: {
        id: part._id!.toString(),
        ...part,
        _id: undefined,
      },
    });
  } catch (error) {
    console.error("Get part error:", error);
    return NextResponse.json(
      { error: "Failed to fetch part" },
      { status: 500 }
    );
  }
}

// PUT /api/parts/[id] - Update part (Admin only)
export const PUT = withAdminAuth(
  async (
    request: NextRequest,
    user: AuthUser,
    { params }: { params: { id: string } }
  ) => {
    try {
      const { id } = params;

      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid part ID" }, { status: 400 });
      }

      const body = await request.json();

      let validatedData;
      try {
        validatedData = await updatePartSchema.parseAsync(body);
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

      // Check if part exists
      const existingPart = await partsCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!existingPart) {
        return NextResponse.json({ error: "Part not found" }, { status: 404 });
      }

      // If part number is being changed, check for duplicates
      if (
        validatedData.partNumber &&
        validatedData.partNumber !== existingPart.partNumber
      ) {
        const duplicate = await partsCollection.findOne({
          partNumber: validatedData.partNumber,
          _id: { $ne: new ObjectId(id) },
        });

        if (duplicate) {
          return NextResponse.json(
            { error: "Part with this part number already exists" },
            { status: 409 }
          );
        }
      }

      // Update part
      const updateData = {
        ...validatedData,
        updatedAt: new Date(),
        lastModifiedBy: new ObjectId(user.userId),
      };

      const result = await partsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: "Failed to update part" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "Part updated successfully",
      });
    } catch (error) {
      console.error("Update part error:", error);
      return NextResponse.json(
        { error: "Failed to update part" },
        { status: 500 }
      );
    }
  }
);

// DELETE /api/parts/[id] - Delete part (Admin only - soft delete)
export const DELETE = withAdminAuth(
  async (
    request: NextRequest,
    user: AuthUser,
    { params }: { params: { id: string } }
  ) => {
    try {
      const { id } = params;

      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid part ID" }, { status: 400 });
      }

      const db = await getDatabase();
      const partsCollection = db.collection<IPart>("parts");

      // Soft delete - just mark as inactive
      const result = await partsCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            isActive: false,
            updatedAt: new Date(),
            lastModifiedBy: new ObjectId(user.userId),
          },
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Part not found" }, { status: 404 });
      }

      return NextResponse.json({
        message: "Part deleted successfully",
      });
    } catch (error) {
      console.error("Delete part error:", error);
      return NextResponse.json(
        { error: "Failed to delete part" },
        { status: 500 }
      );
    }
  }
);
