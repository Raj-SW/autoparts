import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { withAuth, AuthUser } from "@/middleware/auth";
import { ObjectId } from "mongodb";
import { z } from "zod";

// Order update schema
const orderUpdateSchema = z.object({
  status: z
    .enum([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ])
    .optional(),
  trackingNumber: z.string().optional(),
  adminNotes: z.string().optional(),
  estimatedDelivery: z.string().optional(),
  actualDelivery: z.string().optional(),
});

export const GET = withAuth(
  async (
    request: NextRequest,
    user: AuthUser,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;

      if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "Invalid order ID" },
          { status: 400 }
        );
      }

      const db = await getDatabase();
      const ordersCollection = db.collection("orders");

      // Build query - regular users can only see their own orders
      const query: any = { _id: new ObjectId(id) };
      if (user.role !== "admin") {
        query.userId = new ObjectId(user.userId);
      }

      const order = await ordersCollection.findOne(query);

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Format order response
      const formattedOrder = {
        _id: order._id.toString(),
        orderNumber: order.orderNumber,
        status: order.status,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost || order.shipping?.cost || 0,
        tax: order.tax,
        total: order.total,
        items: order.items,
        createdAt: order.createdAt,
        estimatedDelivery: order.estimatedDelivery,
        actualDelivery: order.actualDelivery,
        trackingNumber: order.trackingNumber,
        shipping: order.shipping,
        payment: order.payment,
        customerNotes: order.customerNotes,
        adminNotes: order.adminNotes,
        updatedAt: order.updatedAt,
      };

      return NextResponse.json(formattedOrder);
    } catch (error) {
      console.error("Order fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch order" },
        { status: 500 }
      );
    }
  }
);

// PATCH /api/orders/[id] - Update order (admin only)
export const PATCH = withAuth(
  async (
    request: NextRequest,
    user: AuthUser,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      // Only admins can update orders
      if (user.role !== "admin") {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      const { id } = await params;

      if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "Invalid order ID" },
          { status: 400 }
        );
      }

      const body = await request.json();

      // Validate update data
      let validatedData;
      try {
        validatedData = await orderUpdateSchema.parseAsync(body);
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
      const ordersCollection = db.collection("orders");

      // Check if order exists
      const existingOrder = await ordersCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!existingOrder) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Prepare update data
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (validatedData.status) {
        updateData.status = validatedData.status;

        // Set status timestamps
        if (validatedData.status === "confirmed") {
          updateData.confirmedAt = new Date();
        } else if (validatedData.status === "shipped") {
          updateData.shippedAt = new Date();
        } else if (validatedData.status === "delivered") {
          updateData.deliveredAt = new Date();
        } else if (validatedData.status === "cancelled") {
          updateData.cancelledAt = new Date();
        }
      }

      if (validatedData.trackingNumber !== undefined) {
        updateData.trackingNumber = validatedData.trackingNumber;
      }

      if (validatedData.adminNotes !== undefined) {
        updateData.adminNotes = validatedData.adminNotes;
      }

      if (validatedData.estimatedDelivery) {
        updateData.estimatedDelivery = new Date(
          validatedData.estimatedDelivery
        );
      }

      if (validatedData.actualDelivery) {
        updateData.actualDelivery = new Date(validatedData.actualDelivery);
      }

      // Update order
      const result = await ordersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Get updated order
      const updatedOrder = await ordersCollection.findOne({
        _id: new ObjectId(id),
      });

      return NextResponse.json({
        message: "Order updated successfully",
        order: {
          _id: updatedOrder!._id!.toString(),
          ...updatedOrder,
          _id: undefined,
        },
      });
    } catch (error) {
      console.error("Order update error:", error);
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }
  }
);
