"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/use-toast";

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
  quotationNotes?: string;
  validUntil?: string;
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    status: "",
    quotedPrice: "",
    adminNotes: "",
    validUntil: "",
  });
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

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

  const openUpdateModal = (quote: Quote) => {
    setSelectedQuote(quote);
    setUpdateForm({
      status: quote.status,
      quotedPrice: quote.quotedPrice?.toString() || "",
      adminNotes: quote.quotationNotes || "",
      validUntil: quote.validUntil
        ? new Date(quote.validUntil).toISOString().split("T")[0]
        : "",
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateQuote = async () => {
    if (!selectedQuote) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/quotes/${selectedQuote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          status: updateForm.status,
          quotedPrice: updateForm.quotedPrice
            ? parseFloat(updateForm.quotedPrice)
            : undefined,
          quotationNotes: updateForm.adminNotes,
          validUntil: updateForm.validUntil,
        }),
      });

      if (response.ok) {
        toast({
          title: "Quote Updated",
          description: "Quote has been updated successfully.",
        });
        setIsUpdateModalOpen(false);
        fetchQuotes(); // Refresh the list
      } else {
        throw new Error("Failed to update quote");
      }
    } catch (error) {
      console.error("Error updating quote:", error);
      toast({
        title: "Error",
        description: "Failed to update quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
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
        toast({
          title: "Error",
          description: "Failed to download PDF. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "Error",
        description: "Error downloading PDF. Please try again.",
        variant: "destructive",
      });
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
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

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
            <Icons.fileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Icons.clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quotes.filter((q) => q.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quoted</CardTitle>
            <Icons.dollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quotes.filter((q) => q.status === "quoted").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <Icons.checkCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quotes.filter((q) => q.status === "accepted").length}
            </div>
          </CardContent>
        </Card>
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

              {/* Admin Notes */}
              {quote.quotationNotes && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Admin Notes</h4>
                  <div className="bg-yellow-50 p-3 rounded border-l-4 border-l-yellow-500">
                    <p className="text-sm text-gray-700">
                      {quote.quotationNotes}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-3 flex-wrap">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => openUpdateModal(quote)}
                >
                  <Icons.edit className="mr-2 h-4 w-4" />
                  {quote.status === "pending" ? "Send Quote" : "Update Quote"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadPDF(quote.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                >
                  <Icons.download className="mr-2 h-4 w-4" />
                  Download PDF
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
                  <Icons.messageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(`mailto:${quote.customer.email}`, "_blank")
                  }
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                >
                  <Icons.mail className="mr-2 h-4 w-4" />
                  Email
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

      {/* Update Quote Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Quote</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={updateForm.status}
                onValueChange={(value) =>
                  setUpdateForm({ ...updateForm, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quotedPrice">Quoted Price (Rs)</Label>
              <Input
                id="quotedPrice"
                type="number"
                placeholder="Enter quoted price"
                value={updateForm.quotedPrice}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, quotedPrice: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adminNotes">Admin Notes</Label>
              <Textarea
                id="adminNotes"
                placeholder="Add internal notes..."
                value={updateForm.adminNotes}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, adminNotes: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="validUntil">Valid Until</Label>
              <Input
                id="validUntil"
                type="date"
                value={updateForm.validUntil}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, validUntil: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateQuote} disabled={updating}>
              {updating ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Quote"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
