import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { withAdminAuth, AuthUser } from "@/middleware/auth";
import { IUser } from "@/models/User";
import { ObjectId } from "mongodb";

// GET /api/admin/users - Get all users with pagination and filters
export const GET = withAdminAuth(
  async (request: NextRequest, user: AuthUser) => {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");
      const search = searchParams.get("search") || "";
      const role = searchParams.get("role") || "all";
      const status = searchParams.get("status") || "all";
      const sortBy = searchParams.get("sortBy") || "createdAt";
      const sortOrder = searchParams.get("sortOrder") || "desc";

      const db = await getDatabase();
      const usersCollection = db.collection<IUser>("users");

      // Build filter query
      const filter: any = {};

      // Search filter
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ];
      }

      // Role filter
      if (role !== "all") {
        filter.role = role;
      }

      // Status filter (active/inactive based on email verification)
      if (status !== "all") {
        if (status === "active") {
          filter.emailVerified = true;
        } else if (status === "inactive") {
          filter.emailVerified = { $ne: true };
        }
      }

      // Get total count
      const total = await usersCollection.countDocuments(filter);

      // Build sort object
      const sort: any = {};
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;

      // Get users with pagination
      const users = await usersCollection
        .find(filter, {
          projection: {
            password: 0, // Exclude password from results
          },
        })
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();

      // Get statistics
      const statistics = await Promise.all([
        usersCollection.countDocuments({}),
        usersCollection.countDocuments({ role: "customer" }),
        usersCollection.countDocuments({ role: "admin" }),
        usersCollection.countDocuments({ emailVerified: true }),
        usersCollection.countDocuments({ emailVerified: { $ne: true } }),
        usersCollection.countDocuments({
          createdAt: {
            $gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        }),
        usersCollection.countDocuments({
          lastLoginAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        }),
      ]);

      const [
        totalUsers,
        customers,
        admins,
        verified,
        unverified,
        newToday,
        activeLastWeek,
      ] = statistics;

      return NextResponse.json({
        users: users.map((user) => ({
          id: user._id!.toString(),
          ...user,
          _id: undefined,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        statistics: {
          total: totalUsers,
          customers,
          admins,
          verified,
          unverified,
          newToday,
          activeLastWeek,
        },
      });
    } catch (error) {
      console.error("Get users error:", error);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }
  }
);
