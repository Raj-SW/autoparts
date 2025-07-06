"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Package,
  Search,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { BreadcrumbWrapper } from "@/components/BreadcrumbWrapper";

interface TrackingInfo {
  orderNumber: string;
  status: string;
  createdAt: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingNumber?: string;
  shipping: {
    method: string;
    status: string;
  };
  payment: {
    method: string;
    status: string;
  };
  items: Array<{
    name: string;
    partNumber: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  timeline: Array<{
    status: string;
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
    estimated?: boolean;
  }>;
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderNumber.trim()) {
      toast.error("Please enter an order number");
      return;
    }

    setLoading(true);
    setError(null);
    setTrackingInfo(null);

    try {
      const response = await fetch(`/api/orders/track/${orderNumber.trim()}`);
      const data = await response.json();

      if (response.ok) {
        setTrackingInfo(data);
      } else {
        setError(data.error || "Order not found");
      }
    } catch (error) {
      console.error("Tracking error:", error);
      setError("Failed to track order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTimelineIcon = (status: string, completed: boolean) => {
    if (!completed) {
      return <Clock className="h-5 w-5 text-gray-400" />;
    }

    switch (status) {
      case "placed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "paid":
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case "processing":
        return <Package className="h-5 w-5 text-purple-600" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-orange-600" />;
      case "delivered":
        return <MapPin className="h-5 w-5 text-green-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <BreadcrumbWrapper />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-600">
            Enter your order number to track the status and delivery progress
          </p>
        </div>

        {/* Order Number Input */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Order Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div>
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  placeholder="Enter your order number (e.g., AMO-ABC123)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  You can find your order number in the confirmation email or
                  receipt
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Tracking Order...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Track Order
                  </>
                )}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {trackingInfo && (
          <div className="space-y-6">
            {/* Order Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">
                      Order #{trackingInfo.orderNumber}
                    </CardTitle>
                    <p className="text-gray-600">
                      Placed on {formatDate(trackingInfo.createdAt)}
                    </p>
                  </div>
                  <Badge
                    className={`${getStatusColor(
                      trackingInfo.status
                    )} text-sm px-3 py-1 w-fit`}
                  >
                    {trackingInfo.status.charAt(0).toUpperCase() +
                      trackingInfo.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Shipping Method</p>
                      <p className="text-sm text-gray-600">
                        {trackingInfo.shipping.method}
                      </p>
                    </div>
                  </div>

                  {trackingInfo.trackingNumber && (
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Tracking Number</p>
                        <p className="text-sm text-gray-600 font-mono">
                          {trackingInfo.trackingNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">
                        {trackingInfo.actualDelivery
                          ? "Delivered"
                          : "Expected Delivery"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {trackingInfo.actualDelivery
                          ? formatDate(trackingInfo.actualDelivery)
                          : trackingInfo.estimatedDelivery
                          ? formatDate(trackingInfo.estimatedDelivery)
                          : "TBD"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingInfo.timeline.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 p-2 rounded-full ${
                          step.completed ? "bg-green-100" : "bg-gray-100"
                        }`}
                      >
                        {getTimelineIcon(step.status, step.completed)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={`font-semibold ${
                              step.completed ? "text-gray-900" : "text-gray-500"
                            }`}
                          >
                            {step.title}
                          </h3>
                          {step.estimated && (
                            <Badge variant="outline" className="text-xs">
                              Estimated
                            </Badge>
                          )}
                        </div>
                        <p
                          className={`text-sm ${
                            step.completed ? "text-gray-600" : "text-gray-400"
                          }`}
                        >
                          {step.description}
                        </p>
                        {step.timestamp && (
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(step.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingInfo.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b last:border-b-0"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          Part #: {item.partNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-[#D72638]">
                      {formatPrice(trackingInfo.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  If you have any questions about your order or need assistance,
                  our customer support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `https://wa.me/23057123456?text=Hi! I need help with my order ${trackingInfo.orderNumber}`,
                        "_blank"
                      )
                    }
                  >
                    WhatsApp Support
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/contact">Contact Us</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
