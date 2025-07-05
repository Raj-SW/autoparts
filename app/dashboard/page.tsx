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

interface UserDashboardStats {
  statistics: {
    orders: {
      total: number;
      pending: number;
      today: number;
      thisMonth: number;
    };
    quotes: {
      total: number;
      pending: number;
    };
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  recentQuotes: Array<{
    id: string;
    quoteNumber: string;
    status: string;
    vehicle: {
      make: string;
      model: string;
      year: number;
    };
    createdAt: string;
  }>;
}

interface PartnerApplication {
  _id: string;
  applicationNumber: string;
  businessName: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  partnerLevel?: "bronze" | "silver" | "gold";
  discountRate?: number;
  creditLimit?: number;
  createdAt: string;
}

function DashboardPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<UserDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [partnerApplication, setPartnerApplication] =
    useState<PartnerApplication | null>(null);
  const [partnerLoading, setPartnerLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiClient.getUserDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch user dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPartnerApplication = async () => {
      try {
        const response = await apiClient.getPartnerApplications();
        if (response.partners && response.partners.length > 0) {
          setPartnerApplication(response.partners[0]); // User should only have one application
        }
      } catch (error) {
        console.error("Failed to fetch partner application:", error);
      } finally {
        setPartnerLoading(false);
      }
    };

    if (user) {
      fetchStats();
      fetchPartnerApplication();
    }
  }, [user]);

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
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Customer Portal
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Welcome Card */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icons.user className="h-5 w-5" />
                <span>Welcome to your Dashboard</span>
              </CardTitle>
              <CardDescription>
                Manage your account, view orders, and request quotes for auto
                parts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Link href="/catalog">
                  <Button className="w-full justify-start" variant="outline">
                    <Icons.search className="mr-2 h-4 w-4" />
                    Browse Parts
                  </Button>
                </Link>
                <Link href="/quote">
                  <Button className="w-full justify-start" variant="outline">
                    <Icons.fileText className="mr-2 h-4 w-4" />
                    Request Quote
                  </Button>
                </Link>
                <Link href="/orders">
                  <Button className="w-full justify-start" variant="outline">
                    <Icons.package className="mr-2 h-4 w-4" />
                    My Orders
                  </Button>
                </Link>
                <Link href="/partner">
                  <Button className="w-full justify-start" variant="outline">
                    <Icons.users className="mr-2 h-4 w-4" />
                    Partnership
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button className="w-full justify-start" variant="outline">
                    <Icons.settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icons.user className="h-5 w-5" />
                <span>Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Name</div>
                <div className="text-lg">{user?.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Email</div>
                <div className="text-sm">{user?.email}</div>
                <div className="flex items-center mt-1">
                  {user?.isEmailVerified ? (
                    <Badge variant="success" className="text-xs">
                      <Icons.check className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      Not Verified
                    </Badge>
                  )}
                </div>
              </div>
              {user?.phoneNumber && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Phone</div>
                  <div className="text-sm">{user.phoneNumber}</div>
                </div>
              )}
              <Link href="/profile">
                <Button variant="outline" size="sm" className="w-full">
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icons.clock className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-500 text-center py-8">
                  No recent activity to show.
                  <br />
                  Start by browsing our parts catalog!
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icons.trendingUp className="h-5 w-5" />
                <span>Quick Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total Orders</span>
                    <span className="font-semibold">
                      {stats?.statistics.orders.total || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Pending Orders
                    </span>
                    <span className="font-semibold">
                      {stats?.statistics.orders.pending || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Pending Quotes
                    </span>
                    <span className="font-semibold">
                      {stats?.statistics.quotes.pending || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Account Status
                    </span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Partnership Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icons.users className="h-5 w-5" />
                <span>Partnership</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {partnerLoading ? (
                <div className="space-y-4">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ) : partnerApplication ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Application #</span>
                    <span className="font-mono text-xs">
                      {partnerApplication.applicationNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Business</span>
                    <span className="font-semibold text-sm">
                      {partnerApplication.businessName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Status</span>
                    <Badge
                      variant={
                        partnerApplication.status === "approved"
                          ? "default"
                          : partnerApplication.status === "rejected"
                          ? "destructive"
                          : partnerApplication.status === "under_review"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {partnerApplication.status
                        .replace("_", " ")
                        .toUpperCase()}
                    </Badge>
                  </div>
                  {partnerApplication.status === "approved" && (
                    <>
                      {partnerApplication.partnerLevel && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Level</span>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {partnerApplication.partnerLevel}
                          </Badge>
                        </div>
                      )}
                      {partnerApplication.discountRate && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            Discount
                          </span>
                          <span className="font-semibold text-green-600">
                            {partnerApplication.discountRate}%
                          </span>
                        </div>
                      )}
                      {partnerApplication.creditLimit && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            Credit Limit
                          </span>
                          <span className="font-semibold">
                            Rs {partnerApplication.creditLimit.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="text-center pt-2">
                    <Link href="/partner">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Icons.users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    No Partnership Application
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">
                    Apply to become a partner and enjoy wholesale benefits.
                  </p>
                  <Link href="/partner">
                    <Button size="sm" className="w-full">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icons.package className="h-5 w-5" />
                <span>Recent Orders</span>
              </CardTitle>
              <CardDescription>
                Your latest orders and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : stats?.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${order.total.toFixed(2)}
                        </p>
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "default"
                              : order.status === "pending"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <Link href="/orders">
                      <Button variant="outline" size="sm">
                        View All Orders
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icons.package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No orders yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    When you place your first order, it will appear here.
                  </p>
                  <Link href="/catalog">
                    <Button>
                      <Icons.search className="mr-2 h-4 w-4" />
                      Browse Parts
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default withAuth(DashboardPage);
