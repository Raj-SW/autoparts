import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const db = await getDatabase();
  const ordersCollection = db.collection("orders");

  const orderId = paymentIntent.metadata.orderId;

  if (!orderId) {
    console.error("No order ID found in payment intent metadata");
    return;
  }

  try {
    // Update order payment status
    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          "payment.status": "paid",
          "payment.paymentIntentId": paymentIntent.id,
          "payment.paidAt": new Date(),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      console.error(`Order not found: ${orderId}`);
      return;
    }

    console.log(`Payment successful for order: ${orderId}`);

    // Here you could add email notification logic
    // await sendOrderConfirmationEmail(orderId);
  } catch (error) {
    console.error("Error updating order payment status:", error);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const db = await getDatabase();
  const ordersCollection = db.collection("orders");

  const orderId = paymentIntent.metadata.orderId;

  if (!orderId) {
    console.error("No order ID found in payment intent metadata");
    return;
  }

  try {
    // Update order payment status
    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          "payment.status": "failed",
          "payment.paymentIntentId": paymentIntent.id,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      console.error(`Order not found: ${orderId}`);
      return;
    }

    console.log(`Payment failed for order: ${orderId}`);

    // Here you could add email notification logic for failed payments
    // await sendPaymentFailedEmail(orderId);
  } catch (error) {
    console.error("Error updating order payment status:", error);
  }
}
