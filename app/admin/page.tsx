"use client";

import { useAuth, withAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { BreadcrumbWrapper } from "@/components/BreadcrumbWrapper";

interface DashboardStats {
  statistics: {
    users: { total: number; newToday: number; activeUsers: number };
    parts: { total: number; lowStock: number };
    orders: {
      total: number;
      pending: number;
      today: number;
      thisMonth: number;
      growth: string;
    };
    revenue: { total: number; today: number; thisMonth: number };
    quotes: { pending: number };
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  topSellingParts: Array<{
    id: string;
    name: string;
    partNumber: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
}

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiClient.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                A.M.O Distribution
              </Link>
              <Badge variant="default" className="bg-red-500">
                Admin Panel
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                Welcome, {user?.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <Icons.logout className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadcrumbWrapper />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Icons.spinner className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common admin tasks and management functions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                  <Link href="/admin/parts">
                    <Button className="justify-start" variant="outline">
                      <Icons.package className="mr-2 h-4 w-4" />
                      Manage Parts
                    </Button>
                  </Link>
                  <Link href="/admin/partners">
                    <Button className="justify-start" variant="outline">
                      <Icons.users className="mr-2 h-4 w-4" />
                      Partners
                    </Button>
                  </Link>
                  <Link href="/admin/users">
                    <Button className="justify-start" variant="outline">
                      <Icons.users className="mr-2 h-4 w-4" />
                      Manage Users
                    </Button>
                  </Link>
                  <Button className="justify-start" variant="outline">
                    <Icons.fileText className="mr-2 h-4 w-4" />
                    View Orders
                  </Button>
                  <Link href="/admin/quotes">
                    <Button className="justify-start" variant="outline">
                      <Icons.bell className="mr-2 h-4 w-4" />
                      Quotes ({stats?.statistics.quotes.pending || 0})
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Users Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Icons.users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.statistics.users.total || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +{stats?.statistics.users.newToday || 0} new today
                  </p>
                </CardContent>
              </Card>

              {/* Parts Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Parts Inventory
                  </CardTitle>
                  <Icons.package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.statistics.parts.total || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.statistics.parts.lowStock || 0} low stock
                  </p>
                </CardContent>
              </Card>

              {/* Orders Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders</CardTitle>
                  <Icons.fileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.statistics.orders.total || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.statistics.orders.pending || 0} pending
                  </p>
                </CardContent>
              </Card>

              {/* Revenue Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <Icons.dollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${(stats?.statistics.revenue.total || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    $
                    {(
                      stats?.statistics.revenue.thisMonth || 0
                    ).toLocaleString()}{" "}
                    this month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders and Top Parts */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {order.orderNumber}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.customerName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              ${order.total}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No orders yet
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top Selling Parts */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Parts</CardTitle>
                  <CardDescription>
                    Most popular parts by quantity sold
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats?.topSellingParts &&
                  stats.topSellingParts.length > 0 ? (
                    <div className="space-y-4">
                      {stats.topSellingParts.map((part) => (
                        <div
                          key={part.id}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm font-medium">{part.name}</p>
                            <p className="text-xs text-gray-500">
                              {part.partNumber}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {part.totalQuantity} sold
                            </p>
                            <p className="text-xs text-gray-500">
                              ${part.totalRevenue.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No sales data yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default withAuth(AdminDashboard, "admin");
