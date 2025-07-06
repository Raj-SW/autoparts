"use client";

import React, { useState, useEffect } from "react";
import { useAuth, withAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Icons } from "@/components/ui/icons";
import { BreadcrumbWrapper } from "@/components/BreadcrumbWrapper";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin";
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  adminNotes?: string;
}

interface UserStatistics {
  total: number;
  customers: number;
  admins: number;
  verified: number;
  unverified: number;
  newToday: number;
  activeLastWeek: number;
}

interface UserDetails extends User {
  statistics: {
    orderCount: number;
    quoteCount: number;
    hasPartnerApplication: boolean;
    partnerStatus: string | null;
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
    createdAt: string;
  }>;
}

function AdminUsersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);

  // Filters
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });

      if (roleFilter && roleFilter !== "all") params.append("role", roleFilter);
      if (statusFilter && statusFilter !== "all")
        params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);

      const response = await apiClient.getUsers(Object.fromEntries(params));

      setUsers(response.users || []);
      setStatistics(response.statistics);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error: any) {
      console.error("Failed to load users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      loadUsers();
    }
  }, [user, currentPage, roleFilter, statusFilter, searchTerm]);

  const loadUserDetails = async (userId: string) => {
    try {
      setUserDetailsLoading(true);
      const response = await apiClient.getUser(userId);
      setSelectedUser(response);
    } catch (error: any) {
      console.error("Failed to load user details:", error);
      toast({
        title: "Error",
        description: "Failed to load user details",
        variant: "destructive",
      });
    } finally {
      setUserDetailsLoading(false);
    }
  };

  const handleViewUser = async (targetUser: User) => {
    await loadUserDetails(targetUser.id);
    setIsViewDialogOpen(true);
  };

  const handleToggleAdminRole = async (targetUser: User) => {
    try {
      const newRole = targetUser.role === "admin" ? "customer" : "admin";

      await apiClient.updateUser(targetUser.id, {
        role: newRole,
      });

      toast({
        title: "Success",
        description: `User ${
          newRole === "admin" ? "promoted to admin" : "demoted to customer"
        } successfully`,
      });

      loadUsers();
    } catch (error: any) {
      console.error("Failed to update user role:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (targetUser: User) => {
    if (!targetUser.isActive) {
      return <Badge variant="destructive">Inactive</Badge>;
    }
    if (!targetUser.emailVerified) {
      return <Badge variant="secondary">Unverified</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive">Admin</Badge>;
      case "customer":
        return <Badge variant="default">Customer</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <BreadcrumbWrapper />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">
            View user accounts and manage admin roles
          </p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statistics.total}
                    </p>
                  </div>
                  <Icons.users className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Customers
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {statistics.customers}
                    </p>
                  </div>
                  <Icons.user className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Admins</p>
                    <p className="text-2xl font-bold text-red-600">
                      {statistics.admins}
                    </p>
                  </div>
                  <Icons.settings className="w-8 h-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Verified
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {statistics.verified}
                    </p>
                  </div>
                  <Icons.checkCircle className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Unverified
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {statistics.unverified}
                    </p>
                  </div>
                  <Icons.clock className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      New Today
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {statistics.newToday}
                    </p>
                  </div>
                  <Icons.plus className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active 7d
                    </p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {statistics.activeLastWeek}
                    </p>
                  </div>
                  <Icons.trendingUp className="w-8 h-8 text-indigo-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              View user accounts and manage admin roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Icons.spinner className="h-8 w-8 animate-spin" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <Icons.users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Role Management</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((tableUser) => (
                      <TableRow key={tableUser.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{tableUser.name}</p>
                            <p className="text-sm text-gray-600">
                              {tableUser.email}
                            </p>
                            {tableUser.phone && (
                              <p className="text-sm text-gray-500">
                                {tableUser.phone}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(tableUser.role)}</TableCell>
                        <TableCell>{getStatusBadge(tableUser)}</TableCell>
                        <TableCell>
                          {new Date(tableUser.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {tableUser.lastLoginAt
                            ? new Date(
                                tableUser.lastLoginAt
                              ).toLocaleDateString()
                            : "Never"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewUser(tableUser)}
                            >
                              <Icons.eye className="h-4 w-4" />
                            </Button>
                            {tableUser.id !== user?.id && ( // Prevent self-modification
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className={
                                      tableUser.role === "admin"
                                        ? "text-red-600 hover:text-red-700"
                                        : "text-blue-600 hover:text-blue-700"
                                    }
                                  >
                                    {tableUser.role === "admin" ? (
                                      <Icons.user className="h-4 w-4" />
                                    ) : (
                                      <Icons.settings className="h-4 w-4" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      {tableUser.role === "admin"
                                        ? "Remove Admin Role"
                                        : "Promote to Admin"}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {tableUser.role === "admin"
                                        ? `Are you sure you want to remove admin privileges from ${tableUser.name}? They will become a regular customer.`
                                        : `Are you sure you want to promote ${tableUser.name} to admin? They will have full administrative access.`}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleToggleAdminRole(tableUser)
                                      }
                                    >
                                      {tableUser.role === "admin"
                                        ? "Remove Admin"
                                        : "Promote to Admin"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View User Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {userDetailsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Icons.spinner className="h-8 w-8 animate-spin" />
              </div>
            ) : selectedUser ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Name
                    </Label>
                    <p className="text-lg">{selectedUser.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Email
                    </Label>
                    <p className="text-lg">{selectedUser.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Phone
                    </Label>
                    <p className="text-lg">
                      {selectedUser.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Role
                    </Label>
                    <div className="mt-1">
                      {getRoleBadge(selectedUser.role)}
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedUser.statistics.orderCount}
                      </p>
                      <p className="text-sm text-gray-600">Orders</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {selectedUser.statistics.quoteCount}
                      </p>
                      <p className="text-sm text-gray-600">Quotes</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {selectedUser.statistics.hasPartnerApplication
                          ? "Yes"
                          : "No"}
                      </p>
                      <p className="text-sm text-gray-600">Partner</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Recent Orders</h4>
                    {selectedUser.recentOrders.length > 0 ? (
                      <div className="space-y-2">
                        {selectedUser.recentOrders.map((order) => (
                          <div
                            key={order.id}
                            className="flex justify-between items-center p-2 bg-gray-50 rounded"
                          >
                            <span className="text-sm">{order.orderNumber}</span>
                            <span className="text-sm text-gray-600">
                              ${order.total}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No orders yet</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Recent Quotes</h4>
                    {selectedUser.recentQuotes.length > 0 ? (
                      <div className="space-y-2">
                        {selectedUser.recentQuotes.map((quote) => (
                          <div
                            key={quote.id}
                            className="flex justify-between items-center p-2 bg-gray-50 rounded"
                          >
                            <span className="text-sm">{quote.quoteNumber}</span>
                            <Badge variant="outline">{quote.status}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No quotes yet</p>
                    )}
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedUser.adminNotes && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Admin Notes
                    </Label>
                    <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm">{selectedUser.adminNotes}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default withAuth(AdminUsersPage, "admin");
