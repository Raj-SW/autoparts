import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();

    // Calculate company stats from database
    const [totalCustomers, totalParts, totalOrders, avgResponseTime] =
      await Promise.all([
        // Total customers (users with role 'user')
        db.collection("users").countDocuments({ role: "user" }),

        // Total parts in stock
        db.collection("parts").countDocuments({ isActive: true }),

        // Total completed orders
        db.collection("orders").countDocuments({
          status: { $in: ["delivered", "completed"] },
        }),

        // Average response time calculation (placeholder - could be calculated from support tickets)
        Promise.resolve("24hr"), // Keep as static for now since this would require support/quote response tracking
      ]);

    // Calculate years in business (since 2010)
    const currentYear = new Date().getFullYear();
    const yearsInBusiness = currentYear - 2010;

    return NextResponse.json({
      stats: [
        {
          number: `${totalCustomers}+`,
          label: "Happy Customers",
          icon: "Users",
        },
        {
          number: yearsInBusiness.toString(),
          label: "Years in Business",
          icon: "Award",
        },
        {
          number: `${totalParts}+`,
          label: "Parts in Stock",
          icon: "Shield",
        },
        {
          number: avgResponseTime,
          label: "Average Response",
          icon: "Clock",
        },
      ],
      // Additional company data
      totalCustomers,
      totalParts,
      totalOrders,
      yearsInBusiness,
    });
  } catch (error) {
    console.error("Company stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch company stats" },
      { status: 500 }
    );
  }
}
