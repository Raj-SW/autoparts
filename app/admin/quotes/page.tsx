"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Quote {
  id: string;
  quoteNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  vehicle: {
    make: string;
    model: string;
    year: number;
    engine?: string;
  };
  items: {
    name: string;
    description?: string;
    quantity: number;
    notes?: string;
  }[];
  urgency: string;
  status: string;
  createdAt: string;
  message?: string;
  preferredContact: string;
  quotedPrice?: number;
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await fetch("/api/quotes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setQuotes(data.quotes || []);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (quoteId: string) => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}/pdf`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Quote-${quoteId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error("Failed to download PDF");
        alert("Failed to download PDF. Please try again.");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Error downloading PDF. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "quoted":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="p-8">Loading quotes...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quote Management
        </h1>
        <p className="text-gray-600">
          Manage customer quote requests and send responses
        </p>
      </div>

      <div className="grid gap-6">
        {quotes.map((quote) => (
          <Card key={quote.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{quote.quoteNumber}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getUrgencyColor(quote.urgency)}>
                      {quote.urgency.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(quote.status)}>
                      {quote.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(quote.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-semibold mb-2">Customer Details</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Name:</strong> {quote.customer.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {quote.customer.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {quote.customer.phone}
                    </p>
                    <p>
                      <strong>Preferred Contact:</strong>{" "}
                      {quote.preferredContact}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Vehicle Details</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Vehicle:</strong> {quote.vehicle.year}{" "}
                      {quote.vehicle.make} {quote.vehicle.model}
                    </p>
                    {quote.vehicle.engine && (
                      <p>
                        <strong>Engine:</strong> {quote.vehicle.engine}
                      </p>
                    )}
                    {quote.quotedPrice && (
                      <p>
                        <strong>Quoted Price:</strong> Rs{" "}
                        {quote.quotedPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Requested Items */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2">
                  Requested Parts ({quote.items?.length || 0} items)
                </h4>
                <div className="space-y-2">
                  {quote.items?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-3 rounded border-l-4 border-l-blue-500"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          {item.description && (
                            <p className="text-xs text-gray-600 mt-1">
                              {item.description}
                            </p>
                          )}
                          {item.notes && (
                            <p className="text-xs text-gray-500 mt-1 italic">
                              Note: {item.notes}
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-700 ml-2">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                  )) || (
                    <p className="text-sm text-gray-500 italic">
                      No items specified
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Message */}
              {quote.message && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Additional Message</h4>
                  <div className="bg-blue-50 p-3 rounded border-l-4 border-l-blue-500">
                    <p className="text-sm text-gray-700">{quote.message}</p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-3 flex-wrap">
                <Button variant="default" size="sm">
                  {quote.status === "pending" ? "Send Quote" : "Update Quote"}
                </Button>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadPDF(quote.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                >
                  📄 Download PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      `https://wa.me/${quote.customer.phone.replace(
                        /[^\d]/g,
                        ""
                      )}`,
                      "_blank"
                    )
                  }
                  className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                >
                  💬 WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {quotes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No quotes found</div>
          <p className="text-sm text-gray-400 mt-2">
            New quote requests will appear here
          </p>
        </div>
      )}
    </div>
  );
}
