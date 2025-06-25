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

function DashboardPage() {
  const { user, logout } = useAuth();

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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Orders</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Pending Quotes</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Account Status</span>
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default withAuth(DashboardPage);
