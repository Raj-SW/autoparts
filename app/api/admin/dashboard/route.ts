import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { withAdminAuth, AuthUser } from "@/middleware/auth";

export const GET = withAdminAuth(
  async (request: NextRequest, user: AuthUser) => {
    try {
      const db = await getDatabase();

      // Get date ranges for statistics
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const lastMonth = new Date(thisMonth);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      // Fetch statistics in parallel
      const [
        totalUsers,
        newUsersToday,
        activeUsers,
        totalParts,
        lowStockParts,
        totalOrders,
        pendingOrders,
        todayOrders,
        thisMonthOrders,
        totalRevenue,
        todayRevenue,
        thisMonthRevenue,
        pendingQuotes,
        recentOrders,
        topSellingParts,
      ] = await Promise.all([
        // User statistics
        db.collection("users").countDocuments({ role: "user" }),
        db.collection("users").countDocuments({
          role: "user",
          createdAt: { $gte: today },
        }),
        db.collection("users").countDocuments({
          role: "user",
          lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Active in last 7 days
        }),

        // Parts statistics
        db.collection("parts").countDocuments({ isActive: true }),
        db.collection("parts").countDocuments({
          isActive: true,
          $expr: { $lte: ["$stock", "$lowStockThreshold"] },
        }),

        // Order statistics
        db.collection("orders").countDocuments(),
        db.collection("orders").countDocuments({ status: "pending" }),
        db.collection("orders").countDocuments({ createdAt: { $gte: today } }),
        db
          .collection("orders")
          .countDocuments({ createdAt: { $gte: thisMonth } }),

        // Revenue statistics
        db
          .collection("orders")
          .aggregate([
            { $match: { paymentStatus: "paid" } },
            { $group: { _id: null, total: { $sum: "$total" } } },
          ])
          .toArray(),

        db
          .collection("orders")
          .aggregate([
            { $match: { paymentStatus: "paid", createdAt: { $gte: today } } },
            { $group: { _id: null, total: { $sum: "$total" } } },
          ])
          .toArray(),

        db
          .collection("orders")
          .aggregate([
            {
              $match: { paymentStatus: "paid", createdAt: { $gte: thisMonth } },
            },
            { $group: { _id: null, total: { $sum: "$total" } } },
          ])
          .toArray(),

        // Quote statistics
        db.collection("quotes").countDocuments({ status: "pending" }),

        // Recent orders
        db
          .collection("orders")
          .find()
          .sort({ createdAt: -1 })
          .limit(5)
          .toArray(),

        // Top selling parts
        db
          .collection("orders")
          .aggregate([
            { $unwind: "$items" },
            {
              $group: {
                _id: "$items.partId",
                partName: { $first: "$items.name" },
                partNumber: { $first: "$items.partNumber" },
                totalQuantity: { $sum: "$items.quantity" },
                totalRevenue: { $sum: "$items.subtotal" },
              },
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 },
          ])
          .toArray(),
      ]);

      // Calculate growth percentages
      const lastMonthOrders = await db.collection("orders").countDocuments({
        createdAt: { $gte: lastMonth, $lt: thisMonth },
      });

      const orderGrowth =
        lastMonthOrders > 0
          ? ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100
          : 0;

      return NextResponse.json({
        statistics: {
          users: {
            total: totalUsers,
            newToday: newUsersToday,
            activeUsers: activeUsers,
          },
          parts: {
            total: totalParts,
            lowStock: lowStockParts,
          },
          orders: {
            total: totalOrders,
            pending: pendingOrders,
            today: todayOrders,
            thisMonth: thisMonthOrders,
            growth: orderGrowth.toFixed(1),
          },
          revenue: {
            total: totalRevenue[0]?.total || 0,
            today: todayRevenue[0]?.total || 0,
            thisMonth: thisMonthRevenue[0]?.total || 0,
          },
          quotes: {
            pending: pendingQuotes,
          },
        },
        recentOrders: recentOrders.map((order) => ({
          id: order._id.toString(),
          orderNumber: order.orderNumber,
          customerName: order.customer.name,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
        })),
        topSellingParts: topSellingParts.map((part) => ({
          id: part._id.toString(),
          name: part.partName,
          partNumber: part.partNumber,
          totalQuantity: part.totalQuantity,
          totalRevenue: part.totalRevenue,
        })),
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      return NextResponse.json(
        { error: "Failed to fetch dashboard data" },
        { status: 500 }
      );
    }
  }
);
