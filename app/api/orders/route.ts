import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Order from "@/models/Order";
import Part from "@/models/Part";
import { verifyAuth } from "@/middleware/auth";
import { orderSchema } from "@/utils/validation";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate order data
    const validationResult = orderSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid order data",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const orderData = validationResult.data;

    // Verify stock availability and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of orderData.items) {
      const part = await Part.findById(item.partId);
      if (!part) {
        return NextResponse.json(
          {
            error: `Part not found: ${item.partId}`,
          },
          { status: 400 }
        );
      }

      if (part.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${part.name}. Available: ${part.stock}, Requested: ${item.quantity}`,
          },
          { status: 400 }
        );
      }

      const itemTotal = part.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        partId: part._id,
        partNumber: part.partNumber,
        name: part.name,
        price: part.price,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    // Calculate order totals
    const shippingCost = orderData.shipping.cost || 0;
    const tax = subtotal * (orderData.taxRate || 0.15); // 15% default VAT
    const total = subtotal + shippingCost + tax;

    // Generate order number
    const orderNumber =
      "AMO-" +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).substr(2, 4).toUpperCase();

    // Create order
    const order = new Order({
      orderNumber,
      userId: authResult.user.id,
      items: orderItems,
      subtotal,
      shippingCost,
      tax,
      total,
      shipping: orderData.shipping,
      payment: {
        method: orderData.payment.method,
        status: orderData.payment.method === "cod" ? "pending" : "processing",
      },
      status: "processing",
      estimatedDelivery: new Date(
        Date.now() +
          (orderData.shipping.estimatedDays || 5) * 24 * 60 * 60 * 1000
      ),
    });

    await order.save();

    // Update part stock
    for (const item of orderData.items) {
      await Part.findByIdAndUpdate(item.partId, {
        $inc: { stock: -item.quantity },
      });
    }

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status,
          estimatedDelivery: order.estimatedDelivery,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      {
        error: "Failed to create order",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    // Build query
    const query: any = {};

    // Regular users can only see their own orders, admins can see all
    if (authResult.user.role !== "admin") {
      query.userId = authResult.user.id;
    }

    if (status) {
      query.status = status;
    }

    // Get orders with pagination
    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email");

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}
