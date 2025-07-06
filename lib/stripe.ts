import { loadStripe, Stripe } from "@stripe/stripe-js";

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// Payment processing utilities
export const createPaymentIntent = async (data: {
  amount: number;
  currency?: string;
  customerEmail: string;
  customerName: string;
  orderId?: string;
  metadata?: Record<string, string>;
}) => {
  const response = await fetch("/api/payment/create-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create payment intent");
  }

  return response.json();
};

export const processPayment = async (
  stripe: Stripe,
  elements: any,
  clientSecret: string,
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
    address?: {
      line1: string;
      city: string;
      state?: string;
      postal_code?: string;
      country: string;
    };
  }
) => {
  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    clientSecret,
    confirmParams: {
      payment_method_data: {
        billing_details: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
        },
      },
    },
    redirect: "if_required",
  });

  if (error) {
    throw new Error(error.message || "Payment failed");
  }

  return paymentIntent;
}; 