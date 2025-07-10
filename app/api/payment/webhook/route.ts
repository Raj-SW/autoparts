import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

// Lazy Stripe initialization
function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is required");
  }
  return new Stripe(secretKey, {
    apiVersion: "2024-06-20",
  });
}

function getEndpointSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is required");
  }
  return secret;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    const endpointSecret = getEndpointSecret();
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
