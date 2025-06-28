import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { withAuth, AuthUser } from "@/middleware/auth";
import { ObjectId } from "mongodb";

export const GET = withAuth(async (request: NextRequest, user: AuthUser) => {
  try {
    const db = await getDatabase();
    const userId = new ObjectId(user.userId);

    // Get date ranges for statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    // Fetch user statistics in parallel
    const [
      totalOrders,
      pendingOrders,
      todayOrders,
      thisMonthOrders,
      totalQuotes,
      pendingQuotes,
      recentOrders,
      recentQuotes,
    ] = await Promise.all([
      // Order statistics
      db.collection("orders").countDocuments({ userId }),
      db.collection("orders").countDocuments({
        userId,
        status: { $in: ["pending", "processing"] },
      }),
      db.collection("orders").countDocuments({
        userId,
        createdAt: { $gte: today },
      }),
      db.collection("orders").countDocuments({
        userId,
        createdAt: { $gte: thisMonth },
      }),

      // Quote statistics
      db.collection("quotes").countDocuments({ userId }),
      db.collection("quotes").countDocuments({
        userId,
        status: "pending",
      }),

      // Recent orders (last 5)
      db
        .collection("orders")
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),

      // Recent quotes (last 5)
      db
        .collection("quotes")
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
    ]);

    return NextResponse.json({
      statistics: {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          today: todayOrders,
          thisMonth: thisMonthOrders,
        },
        quotes: {
          total: totalQuotes,
          pending: pendingQuotes,
        },
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
        vehicle: quote.vehicle,
        createdAt: quote.createdAt,
      })),
    });
  } catch (error) {
    console.error("User dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
});
