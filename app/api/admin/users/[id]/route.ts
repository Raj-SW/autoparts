import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { withAdminAuth, AuthUser } from "@/middleware/auth";
import { IUser } from "@/models/User";
import { ObjectId } from "mongodb";
import { z } from "zod";

// User update schema
const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.enum(["customer", "admin"]).optional(),
  emailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  adminNotes: z.string().optional(),
});

// GET /api/admin/users/[id] - Get specific user
export const GET = withAdminAuth(
  async (
    request: NextRequest,
    user: AuthUser,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;

      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }

      const db = await getDatabase();
      const usersCollection = db.collection<IUser>("users");

      const userData = await usersCollection.findOne(
        { _id: new ObjectId(id) },
        {
          projection: {
            password: 0, // Exclude password
          },
        }
      );

      if (!userData) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Get additional user statistics
      const ordersCollection = db.collection("orders");
      const quotesCollection = db.collection("quotes");
      const partnersCollection = db.collection("partners");

      const [orderCount, quoteCount, partnerApplication] = await Promise.all([
        ordersCollection.countDocuments({ userId: new ObjectId(id) }),
        quotesCollection.countDocuments({ userId: new ObjectId(id) }),
        partnersCollection.findOne({ userId: new ObjectId(id) }),
      ]);

      // Get recent orders
      const recentOrders = await ordersCollection
        .find({ userId: new ObjectId(id) })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();

      // Get recent quotes
      const recentQuotes = await quotesCollection
        .find({ userId: new ObjectId(id) })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();

      return NextResponse.json({
        user: {
          id: userData._id!.toString(),
          ...userData,
          _id: undefined,
        },
        statistics: {
          orderCount,
          quoteCount,
          hasPartnerApplication: !!partnerApplication,
          partnerStatus: partnerApplication?.status || null,
        },
        recentOrders: recentOrders.map((order) => ({
          id: order._id.toString(),
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
        })),
        recentQuotes: recentQuotes.map((quote) => ({
          id: quote._id.toString(),
          quoteNumber: quote.quoteNumber,
          status: quote.status,
          createdAt: quote.createdAt,
        })),
      });
    } catch (error) {
      console.error("Get user error:", error);
      return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: 500 }
      );
    }
  }
);

// PATCH /api/admin/users/[id] - Update user
export const PATCH = withAdminAuth(
  async (
    request: NextRequest,
    user: AuthUser,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;

      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }

      const body = await request.json();

      let validatedData;
      try {
        validatedData = await userUpdateSchema.parseAsync(body);
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
      const usersCollection = db.collection<IUser>("users");

      // Check if user exists
      const existingUser = await usersCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!existingUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Prevent users from changing their own role or status
      if (existingUser._id!.toString() === user.userId) {
        if (validatedData.role || validatedData.isActive === false) {
          return NextResponse.json(
            { error: "Cannot modify your own role or status" },
            { status: 403 }
          );
        }
      }

      // Check for email uniqueness if email is being changed
      if (validatedData.email && validatedData.email !== existingUser.email) {
        const emailExists = await usersCollection.findOne({
          email: validatedData.email,
          _id: { $ne: new ObjectId(id) },
        });

        if (emailExists) {
          return NextResponse.json(
            { error: "Email already exists" },
            { status: 400 }
          );
        }
      }

      // Prepare update data
      const updateData: Partial<IUser> = {
        ...validatedData,
        updatedAt: new Date(),
      };

      // Update user
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Get updated user
      const updatedUser = await usersCollection.findOne(
        { _id: new ObjectId(id) },
        {
          projection: {
            password: 0,
          },
        }
      );

      return NextResponse.json({
        message: "User updated successfully",
        user: {
          id: updatedUser!._id!.toString(),
          ...updatedUser,
          _id: undefined,
        },
      });
    } catch (error) {
      console.error("Update user error:", error);
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }
  }
);

// DELETE /api/admin/users/[id] - Delete user
export const DELETE = withAdminAuth(
  async (
    request: NextRequest,
    user: AuthUser,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;

      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }

      // Prevent users from deleting themselves
      if (id === user.userId) {
        return NextResponse.json(
          { error: "Cannot delete your own account" },
          { status: 403 }
        );
      }

      const db = await getDatabase();
      const usersCollection = db.collection<IUser>("users");

      // Check if user exists
      const existingUser = await usersCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!existingUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Check if user has orders or quotes (optional: prevent deletion if they do)
      const ordersCollection = db.collection("orders");
      const quotesCollection = db.collection("quotes");

      const [orderCount, quoteCount] = await Promise.all([
        ordersCollection.countDocuments({ userId: new ObjectId(id) }),
        quotesCollection.countDocuments({ userId: new ObjectId(id) }),
      ]);

      // Optional: Prevent deletion if user has orders or quotes
      if (orderCount > 0 || quoteCount > 0) {
        return NextResponse.json(
          {
            error: `Cannot delete user with existing orders (${orderCount}) or quotes (${quoteCount}). Consider deactivating instead.`,
          },
          { status: 400 }
        );
      }

      // Delete user
      const result = await usersCollection.deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);
      return NextResponse.json(
        { error: "Failed to delete user" },
        { status: 500 }
      );
    }
  }
);
