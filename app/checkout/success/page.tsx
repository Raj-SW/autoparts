"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Package,
  Truck,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

export default function CheckoutSuccessPage() {
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Get order details from localStorage (set during checkout)
    const lastOrder = localStorage.getItem("lastOrder");
    if (lastOrder) {
      try {
        const order = JSON.parse(lastOrder);
        setOrderDetails(order);
        // Clear the stored order details
        localStorage.removeItem("lastOrder");
      } catch (error) {
        console.error("Error parsing order details:", error);
      }
    }
  }, []);

  // Fallback order number if no order details available
  const orderNumber =
    orderDetails?.orderNumber ||
    "AMO-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been successfully
              placed.
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-mono font-semibold">{orderNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge>Processing</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="font-semibold">
                  {orderDetails?.estimatedDelivery
                    ? formatDate(orderDetails.estimatedDelivery)
                    : "3-5 business days"}
                </span>
              </div>
              {orderDetails?.total && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-[#D72638]">
                    {formatPrice(orderDetails.total)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What happens next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#D72638] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Order Confirmation</h4>
                    <p className="text-sm text-gray-600">
                      You'll receive an email confirmation with your order
                      details within 5 minutes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Order Processing</h4>
                    <p className="text-sm text-gray-600">
                      Our team will prepare your parts and verify availability
                      within 24 hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Shipping & Delivery</h4>
                    <p className="text-sm text-gray-600">
                      Your parts will be shipped and delivered according to your
                      selected delivery method.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you have any questions about your order, our customer support
                team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(
                      "https://wa.me/23057123456?text=Hi! I need help with my order " +
                        orderNumber,
                      "_blank"
                    )
                  }
                  className="flex-1"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp Support
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1" size="lg">
              <Link href="/dashboard">
                View My Orders
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1" size="lg">
              <Link href="/catalog">Continue Shopping</Link>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">
                  Delivery Information
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  For same-day delivery within Port Louis, orders must be placed
                  before 2 PM. Island-wide delivery typically takes 3-5 business
                  days. You'll receive tracking information once your order
                  ships.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
