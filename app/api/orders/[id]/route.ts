import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Order from "@/models/Order";
import { verifyAuth } from "@/middleware/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = params.id;

    // Build query - users can only see their own orders, admins can see all
    const query: any = { _id: orderId };
    if (authResult.user.role !== "admin") {
      query.userId = authResult.user.id;
    }

    const order = await Order.findOne(query).populate("userId", "name email");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch order",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can update orders
    if (authResult.user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const orderId = params.id;
    const updates = await request.json();

    // Validate allowed update fields
    const allowedFields = ["status", "tracking", "notes"];
    const updateData: any = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    }

    // Update shipping status based on order status
    if (updates.status) {
      switch (updates.status) {
        case "shipped":
          updateData["shipping.status"] = "shipped";
          updateData["shipping.shippedAt"] = new Date();
          break;
        case "delivered":
          updateData["shipping.status"] = "delivered";
          updateData["shipping.deliveredAt"] = new Date();
          break;
        case "cancelled":
          updateData["shipping.status"] = "cancelled";
          break;
      }
    }

    updateData.updatedAt = new Date();

    const order = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateData },
      { new: true }
    ).populate("userId", "name email");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      {
        error: "Failed to update order",
      },
      { status: 500 }
    );
  }
}
