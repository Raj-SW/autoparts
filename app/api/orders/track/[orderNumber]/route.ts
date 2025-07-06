import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Order number is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const ordersCollection = db.collection("orders");

    // Find order by order number (public endpoint, no auth required)
    const order = await ordersCollection.findOne({
      orderNumber: orderNumber.toUpperCase(),
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Return limited order information for tracking
    const trackingInfo = {
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order.createdAt,
      estimatedDelivery: order.estimatedDelivery,
      actualDelivery: order.actualDelivery,
      trackingNumber: order.trackingNumber,
      shipping: {
        method: order.shipping?.method,
        status: order.shipping?.status,
      },
      payment: {
        method: order.payment?.method,
        status: order.payment?.status,
      },
      items: order.items?.map((item: any) => ({
        name: item.name,
        partNumber: item.partNumber,
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.total,
      timeline: generateOrderTimeline(order),
    };

    return NextResponse.json(trackingInfo);
  } catch (error) {
    console.error("Order tracking error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order tracking information" },
      { status: 500 }
    );
  }
}

function generateOrderTimeline(order: any) {
  const timeline = [];

  // Order placed
  if (order.createdAt) {
    timeline.push({
      status: "placed",
      title: "Order Placed",
      description: "Your order has been received and is being processed",
      timestamp: order.createdAt,
      completed: true,
    });
  }

  // Payment confirmed
  if (order.payment?.paidAt || order.payment?.status === "paid") {
    timeline.push({
      status: "paid",
      title: "Payment Confirmed",
      description: "Your payment has been processed successfully",
      timestamp: order.payment.paidAt || order.createdAt,
      completed: true,
    });
  }

  // Order confirmed
  if (order.confirmedAt || order.status === "confirmed") {
    timeline.push({
      status: "confirmed",
      title: "Order Confirmed",
      description: "Your order has been confirmed and is being prepared",
      timestamp: order.confirmedAt || order.createdAt,
      completed: true,
    });
  }

  // Processing
  if (
    order.status === "processing" ||
    order.status === "shipped" ||
    order.status === "delivered"
  ) {
    timeline.push({
      status: "processing",
      title: "Processing",
      description: "Your order is being prepared for shipment",
      timestamp: order.updatedAt,
      completed: true,
    });
  }

  // Shipped
  if (
    order.shippedAt ||
    order.status === "shipped" ||
    order.status === "delivered"
  ) {
    timeline.push({
      status: "shipped",
      title: "Shipped",
      description: order.trackingNumber
        ? `Your order has been shipped. Tracking: ${order.trackingNumber}`
        : "Your order has been shipped",
      timestamp: order.shippedAt || order.updatedAt,
      completed: order.status === "shipped" || order.status === "delivered",
    });
  }

  // Delivered
  if (order.deliveredAt || order.status === "delivered") {
    timeline.push({
      status: "delivered",
      title: "Delivered",
      description: "Your order has been delivered successfully",
      timestamp: order.deliveredAt || order.actualDelivery,
      completed: order.status === "delivered",
    });
  } else {
    // Expected delivery
    timeline.push({
      status: "delivery",
      title: "Expected Delivery",
      description: `Estimated delivery date`,
      timestamp: order.estimatedDelivery,
      completed: false,
      estimated: true,
    });
  }

  return timeline;
}
