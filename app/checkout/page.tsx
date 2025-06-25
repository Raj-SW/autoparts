"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Truck,
  Shield,
  ArrowLeft,
  Package,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Link from "next/link";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentForm {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Mauritius",
  });

  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
  });

  const shippingOptions = [
    {
      id: "standard",
      name: "Standard Delivery",
      description: "3-5 business days",
      price: 5.0,
    },
    {
      id: "express",
      name: "Express Delivery",
      description: "1-2 business days",
      price: 15.0,
    },
    {
      id: "sameday",
      name: "Same Day Delivery",
      description: "Within Port Louis area only",
      price: 25.0,
    },
  ];

  const selectedShipping = shippingOptions.find(
    (option) => option.id === shippingMethod
  );
  const shippingCost = selectedShipping?.price || 0;
  const tax = totalPrice * 0.15; // 15% VAT
  const grandTotal = totalPrice + shippingCost + tax;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate shipping form
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
    ];
    const missingFields = requiredFields.filter(
      (field) => !shippingForm[field as keyof ShippingForm]
    );

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    if (paymentMethod === "card") {
      // Validate payment form
      const requiredFields = ["cardNumber", "expiryDate", "cvv", "cardHolder"];
      const missingFields = requiredFields.filter(
        (field) => !paymentForm[field as keyof PaymentForm]
      );

      if (missingFields.length > 0) {
        toast.error("Please fill in all payment details");
        return;
      }
    }

    setProcessing(true);

    try {
      // Prepare order data
      const orderData = {
        items: items.map((item) => ({
          partId: item.id,
          quantity: item.quantity,
        })),
        shipping: {
          method: shippingMethod,
          cost: shippingCost,
          estimatedDays:
            selectedShipping?.id === "sameday"
              ? 1
              : selectedShipping?.id === "express"
              ? 2
              : 5,
          address: shippingForm,
        },
        payment: {
          method: paymentMethod,
          cardDetails: paymentMethod === "card" ? paymentForm : undefined,
        },
        taxRate: 0.15,
      };

      // Create order via API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        // Order created successfully
        clearCart();
        toast.success("Order placed successfully!");

        // Store order details for success page
        localStorage.setItem("lastOrder", JSON.stringify(result.order));

        router.push("/checkout/success");
      } else {
        throw new Error(result.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Payment failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Login Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please log in to proceed with checkout.
            </p>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some items to your cart before checkout.
            </p>
            <Button asChild>
              <Link href="/catalog">Browse Catalog</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center ${
                currentStep >= 1 ? "text-[#D72638]" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  currentStep >= 1
                    ? "border-[#D72638] bg-[#D72638] text-white"
                    : "border-gray-300"
                }`}
              >
                {currentStep > 1 ? <CheckCircle className="h-4 w-4" /> : "1"}
              </div>
              <span className="ml-2 hidden sm:block">Shipping</span>
            </div>

            <div className="w-12 h-px bg-gray-300"></div>

            <div
              className={`flex items-center ${
                currentStep >= 2 ? "text-[#D72638]" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  currentStep >= 2
                    ? "border-[#D72638] bg-[#D72638] text-white"
                    : "border-gray-300"
                }`}
              >
                2
              </div>
              <span className="ml-2 hidden sm:block">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 1 && (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={shippingForm.firstName}
                          onChange={(e) =>
                            setShippingForm({
                              ...shippingForm,
                              firstName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={shippingForm.lastName}
                          onChange={(e) =>
                            setShippingForm({
                              ...shippingForm,
                              lastName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingForm.email}
                        onChange={(e) =>
                          setShippingForm({
                            ...shippingForm,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingForm.phone}
                        onChange={(e) =>
                          setShippingForm({
                            ...shippingForm,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={shippingForm.address}
                        onChange={(e) =>
                          setShippingForm({
                            ...shippingForm,
                            address: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={shippingForm.city}
                          onChange={(e) =>
                            setShippingForm({
                              ...shippingForm,
                              city: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={shippingForm.postalCode}
                          onChange={(e) =>
                            setShippingForm({
                              ...shippingForm,
                              postalCode: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={shippingForm.country}
                        onChange={(e) =>
                          setShippingForm({
                            ...shippingForm,
                            country: e.target.value,
                          })
                        }
                        disabled
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={shippingMethod}
                      onValueChange={setShippingMethod}
                    >
                      {shippingOptions.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-2 p-3 border rounded-lg"
                        >
                          <RadioGroupItem value={option.id} id={option.id} />
                          <div className="flex-1">
                            <label
                              htmlFor={option.id}
                              className="font-medium cursor-pointer"
                            >
                              {option.name}
                            </label>
                            <p className="text-sm text-gray-600">
                              {option.description}
                            </p>
                          </div>
                          <div className="font-semibold">
                            {formatPrice(option.price)}
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Button type="submit" className="w-full" size="lg">
                  Continue to Payment
                </Button>
              </form>
            )}

            {currentStep === 2 && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="card" id="card" />
                        <CreditCard className="h-5 w-5" />
                        <label
                          htmlFor="card"
                          className="font-medium cursor-pointer"
                        >
                          Credit/Debit Card
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="cod" id="cod" />
                        <Package className="h-5 w-5" />
                        <label
                          htmlFor="cod"
                          className="font-medium cursor-pointer"
                        >
                          Cash on Delivery
                        </label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {paymentMethod === "card" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="cardHolder">Cardholder Name *</Label>
                        <Input
                          id="cardHolder"
                          value={paymentForm.cardHolder}
                          onChange={(e) =>
                            setPaymentForm({
                              ...paymentForm,
                              cardHolder: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentForm.cardNumber}
                          onChange={(e) =>
                            setPaymentForm({
                              ...paymentForm,
                              cardNumber: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={paymentForm.expiryDate}
                            onChange={(e) =>
                              setPaymentForm({
                                ...paymentForm,
                                expiryDate: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={paymentForm.cvv}
                            onChange={(e) =>
                              setPaymentForm({
                                ...paymentForm,
                                cvv: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {paymentMethod === "cod" && (
                  <Alert>
                    <Package className="h-4 w-4" />
                    <AlertDescription>
                      You'll pay cash when your order is delivered. Additional
                      delivery charges may apply.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Terms and Conditions */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) =>
                          setAgreeToTerms(checked as boolean)
                        }
                      />
                      <label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-[#D72638] hover:underline"
                        >
                          Terms and Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-[#D72638] hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    Back to Shipping
                  </Button>
                  <Button
                    type="submit"
                    disabled={processing || !agreeToTerms}
                    className="flex-1"
                    size="lg"
                  >
                    {processing
                      ? "Processing..."
                      : `Pay ${formatPrice(grandTotal)}`}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded bg-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          #{item.partNumber}
                        </p>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>{formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (15%):</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-[#D72638]">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Trust Signals */}
                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Secure SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span>Fast & reliable delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4 text-purple-600" />
                    <span>30-day return policy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
