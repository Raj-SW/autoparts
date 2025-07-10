import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthUser } from "@/middleware/auth";
import Stripe from "stripe";
import { z } from "zod";

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

// Payment intent schema
const paymentIntentSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  currency: z.string().default("usd"),
  orderId: z.string().optional(),
  customerEmail: z.string().email("Invalid email address"),
  customerName: z.string().min(1, "Customer name is required"),
  metadata: z.record(z.string()).optional(),
});

export const POST = withAuth(async (request: NextRequest, user: AuthUser) => {
  try {
    const body = await request.json();

    // Validate request data
    let validatedData;
    try {
      validatedData = await paymentIntentSchema.parseAsync(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation failed", issues: error.errors },
          { status: 400 }
        );
      }
      throw error;
    }

    // Create payment intent
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(validatedData.amount * 100), // Convert to cents
      currency: validatedData.currency,
      customer_email: validatedData.customerEmail,
      metadata: {
        userId: user.userId,
        customerName: validatedData.customerName,
        orderId: validatedData.orderId || "",
        ...validatedData.metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Payment intent creation error:", error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
});
