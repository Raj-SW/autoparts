import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { authenticate } from "@/middleware/auth";
import { orderSchema } from "@/utils/validation";

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();

    // Verify authentication
    const { user, error } = await authenticate(request);
    if (error) {
      return error;
    }

    if (!user) {
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
      const part = await db.collection("parts").findOne({
        _id: new ObjectId(item.partId),
      });
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
    const order = {
      orderNumber,
      userId: new ObjectId(user.userId),
      items: orderItems,
      subtotal,
      shippingCost,
      tax,
      total,
      shipping: {
        ...orderData.shipping,
        status: "pending",
      },
      payment: {
        method: orderData.payment.method,
        status:
          orderData.payment.method === "cod"
            ? "pending"
            : orderData.payment.status || "processing",
        paymentIntentId: orderData.payment.paymentIntentId,
        paidAt: orderData.payment.status === "paid" ? new Date() : undefined,
      },
      status: orderData.payment.status === "paid" ? "confirmed" : "pending",
      estimatedDelivery: new Date(
        Date.now() +
          (orderData.shipping.estimatedDays || 5) * 24 * 60 * 60 * 1000
      ),
      customerNotes: orderData.customerNotes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(order);

    // Update part stock
    for (const item of orderData.items) {
      await db
        .collection("parts")
        .updateOne(
          { _id: new ObjectId(item.partId) },
          { $inc: { stock: -item.quantity } }
        );
    }

    return NextResponse.json(
      {
        success: true,
        order: {
          id: result.insertedId,
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
    const db = await getDatabase();

    // Verify authentication
    const { user, error } = await authenticate(request);
    if (error) {
      return error;
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    // Build query
    const query: any = {};

    // Regular users can only see their own orders, admins can see all
    if (user.role !== "admin") {
      query.userId = new ObjectId(user.userId);
    }

    if (status) {
      query.status = status;
    }

    // Get orders with pagination
    const skip = (page - 1) * limit;
    const orders = await db
      .collection("orders")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection("orders").countDocuments(query);

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
