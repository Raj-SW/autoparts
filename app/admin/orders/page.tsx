"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  Search,
  Eye,
  Edit,
  Truck,
  Calendar,
  DollarSign,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  User,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { withAuth } from "@/contexts/AuthContext";
import { BreadcrumbWrapper } from "@/components/BreadcrumbWrapper";

interface OrderItem {
  partId?: string;
  partNumber?: string;
  name?: string;
  price?: number;
  quantity?: number;
  total?: number;
  image?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingNumber?: string;
  shipping?: {
    method: string;
    status: string;
    address?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      address?: string;
      city?: string;
      postalCode?: string;
      country?: string;
    };
  };
  payment?: {
    method?: string;
    status?: string;
  };
  customerNotes?: string;
  adminNotes?: string;
  userId: string;
}

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
  avgOrderValue: number;
}

function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: "",
    trackingNumber: "",
    adminNotes: "",
    estimatedDelivery: "",
  });

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [currentPage, statusFilter, paymentFilter, dateFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "10");
      if (statusFilter && statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const data = await apiClient.getOrders(Object.fromEntries(params));
      setOrders(data.orders || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error("Orders fetch error:", error);
      toast.error("Failed to load orders");
      // Demo data fallback
      setOrders([
        {
          _id: "1",
          orderNumber: "AMO-DEMO001",
          status: "processing",
          subtotal: 124.99,
          shippingCost: 20.0,
          tax: 15.0,
          total: 159.99,
          items: [
            {
              partId: "1",
              partNumber: "BRK001",
              name: "Brake Pads - Front Set",
              price: 89.99,
              quantity: 1,
              total: 89.99,
            },
            {
              partId: "2",
              partNumber: "ENG002",
              name: "Oil Filter",
              price: 17.5,
              quantity: 2,
              total: 35.0,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          estimatedDelivery: new Date(
            Date.now() + 5 * 24 * 60 * 60 * 1000
          ).toISOString(),
          shipping: {
            method: "Standard Delivery",
            status: "pending",
            address: {
              firstName: "John",
              lastName: "Doe",
              email: "john@example.com",
              phone: "+230 5712 3456",
              address: "123 Royal Road, Curepipe",
              city: "Curepipe",
              postalCode: "74103",
              country: "Mauritius",
            },
          },
          payment: {
            method: "card",
            status: "paid",
          },
          customerNotes: "Please handle with care",
          userId: "user123",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // This would come from a dedicated stats endpoint
      const demoStats = {
        total: 156,
        pending: 12,
        processing: 28,
        shipped: 45,
        delivered: 67,
        cancelled: 4,
        totalRevenue: 45678.9,
        avgOrderValue: 292.81,
      };
      setStats(demoStats);
    } catch (error) {
      console.error("Stats fetch error:", error);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleUpdateOrder = (order: Order) => {
    setSelectedOrder(order);
    setUpdateData({
      status: order.status,
      trackingNumber: order.trackingNumber || "",
      adminNotes: order.adminNotes || "",
      estimatedDelivery: order.estimatedDelivery
        ? new Date(order.estimatedDelivery).toISOString().split("T")[0]
        : "",
    });
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedOrder) return;

    try {
      const updatePayload: any = {};

      if (updateData.status !== selectedOrder.status) {
        updatePayload.status = updateData.status;
      }

      if (updateData.trackingNumber !== (selectedOrder.trackingNumber || "")) {
        updatePayload.trackingNumber = updateData.trackingNumber;
      }

      if (updateData.adminNotes !== (selectedOrder.adminNotes || "")) {
        updatePayload.adminNotes = updateData.adminNotes;
      }

      if (updateData.estimatedDelivery) {
        updatePayload.estimatedDelivery = updateData.estimatedDelivery;
      }

      await apiClient.updateOrder(selectedOrder._id, updatePayload);
      toast.success("Order updated successfully");
      setIsUpdateDialogOpen(false);
      fetchOrders();
    } catch (error) {
      console.error("Order update error:", error);
      toast.error("Failed to update order");
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
      year: "numeric",
      month: "short",
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
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
        return <RefreshCw className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <Package className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "refunded":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.shipping?.address?.firstName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order.shipping?.address?.lastName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order.shipping?.address?.email || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order.items || []).some(
        (item) =>
          (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.partNumber || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );

    const matchesPayment =
      paymentFilter === "all" || order.payment?.status === paymentFilter;

    return matchesSearch && matchesPayment;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbWrapper />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Management
          </h1>
          <p className="text-gray-600">
            Manage customer orders and track fulfillment
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.processing}
              </div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shipped</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.shipped}
              </div>
              <p className="text-xs text-muted-foreground">In transit</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatPrice(stats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Avg: {formatPrice(stats.avgOrderValue)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search Orders</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Order number, customer, parts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Order Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="payment">Payment Status</Label>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All payments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Date Range</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="last7days">Last 7 Days</SelectItem>
                    <SelectItem value="last30days">Last 30 Days</SelectItem>
                    <SelectItem value="thismonth">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Orders ({filteredOrders.length})</span>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-600">
                  No orders match your current filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>
                          <div className="font-medium">{order.orderNumber}</div>
                          {order.trackingNumber && (
                            <div className="text-sm text-gray-500">
                              Tracking: {order.trackingNumber}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {order.shipping?.address?.firstName || "N/A"}{" "}
                            {order.shipping?.address?.lastName || ""}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.shipping?.address?.email || "No email"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {(order.items || []).length} item
                            {(order.items || []).length !== 1 ? "s" : ""}
                          </div>
                          <div className="text-xs text-gray-500">
                            {(order.items || [])
                              .slice(0, 2)
                              .map((item) => item.name || "Unknown")
                              .join(", ")}
                            {(order.items || []).length > 2 && "..."}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(
                              order.status
                            )} flex items-center gap-1 w-fit`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getPaymentStatusColor(
                              order.payment?.status || "unknown"
                            )} w-fit`}
                          >
                            {(order.payment?.status || "unknown")
                              .charAt(0)
                              .toUpperCase() +
                              (order.payment?.status || "unknown").slice(1)}
                          </Badge>
                          <div className="text-xs text-gray-500 mt-1">
                            {order.payment?.method === "card"
                              ? "Card"
                              : "Cash on Delivery"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {formatPrice(order.total)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(order.createdAt)}
                          </div>
                          {order.estimatedDelivery && (
                            <div className="text-xs text-gray-500">
                              Est: {formatDate(order.estimatedDelivery)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateOrder(order)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Order Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details - {selectedOrder?.orderNumber}
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Status & Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge
                        className={`${getStatusColor(
                          selectedOrder.status
                        )} flex items-center gap-1 w-fit`}
                      >
                        {getStatusIcon(selectedOrder.status)}
                        {selectedOrder.status.charAt(0).toUpperCase() +
                          selectedOrder.status.slice(1)}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Payment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge
                        className={`${getPaymentStatusColor(
                          selectedOrder.payment?.status || "unknown"
                        )} w-fit`}
                      >
                        {(selectedOrder.payment?.status || "unknown")
                          .charAt(0)
                          .toUpperCase() +
                          (selectedOrder.payment?.status || "unknown").slice(1)}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {selectedOrder.payment?.method === "card"
                          ? "Credit Card"
                          : "Cash on Delivery"}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#D72638]">
                        {formatPrice(selectedOrder.total)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Contact Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>
                              {selectedOrder.shipping?.address?.firstName ||
                                "N/A"}{" "}
                              {selectedOrder.shipping?.address?.lastName || ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>
                              {selectedOrder.shipping?.address?.email ||
                                "No email"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>
                              {selectedOrder.shipping?.address?.phone ||
                                "No phone"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Shipping Address</h4>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <div>
                              {selectedOrder.shipping?.address?.address ||
                                "No address"}
                            </div>
                            <div>
                              {selectedOrder.shipping?.address?.city ||
                                "No city"}
                            </div>
                            {selectedOrder.shipping?.address?.postalCode && (
                              <div>
                                {selectedOrder.shipping.address.postalCode}
                              </div>
                            )}
                            <div>
                              {selectedOrder.shipping?.address?.country ||
                                "No country"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(selectedOrder.items || []).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-3 border-b last:border-b-0"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold">
                              {item.name || "Unknown Item"}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Part #: {item.partNumber || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity || 0}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {formatPrice(item.total || 0)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatPrice(item.price || 0)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 pt-4 border-t">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>{formatPrice(selectedOrder.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Shipping:</span>
                          <span>{formatPrice(selectedOrder.shippingCost)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax:</span>
                          <span>{formatPrice(selectedOrder.tax)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                          <span>Total:</span>
                          <span className="text-[#D72638]">
                            {formatPrice(selectedOrder.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Timeline & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Order Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>
                            Ordered: {formatDate(selectedOrder.createdAt)}
                          </span>
                        </div>
                        {selectedOrder.estimatedDelivery && (
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-gray-400" />
                            <span>
                              Est. Delivery:{" "}
                              {formatDate(selectedOrder.estimatedDelivery)}
                            </span>
                          </div>
                        )}
                        {selectedOrder.trackingNumber && (
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span>
                              Tracking: {selectedOrder.trackingNumber}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        {selectedOrder.customerNotes && (
                          <div>
                            <span className="font-medium">Customer Notes:</span>
                            <p className="text-gray-600 mt-1">
                              {selectedOrder.customerNotes}
                            </p>
                          </div>
                        )}
                        {selectedOrder.adminNotes && (
                          <div>
                            <span className="font-medium">Admin Notes:</span>
                            <p className="text-gray-600 mt-1">
                              {selectedOrder.adminNotes}
                            </p>
                          </div>
                        )}
                        {!selectedOrder.customerNotes &&
                          !selectedOrder.adminNotes && (
                            <p className="text-gray-500 italic">
                              No notes available
                            </p>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Update Order Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Update Order - {selectedOrder?.orderNumber}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Order Status</Label>
                <Select
                  value={updateData.status}
                  onValueChange={(value) =>
                    setUpdateData({ ...updateData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tracking">Tracking Number</Label>
                <Input
                  id="tracking"
                  placeholder="Enter tracking number"
                  value={updateData.trackingNumber}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      trackingNumber: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="estimated">Estimated Delivery</Label>
                <Input
                  id="estimated"
                  type="date"
                  value={updateData.estimatedDelivery}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      estimatedDelivery: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="notes">Admin Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add internal notes..."
                  value={updateData.adminNotes}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, adminNotes: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUpdateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateSubmit}>Update Order</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default withAuth(AdminOrdersPage, "admin");
