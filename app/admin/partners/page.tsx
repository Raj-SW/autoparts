"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
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
  Users,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Filter,
  Search,
  Download,
  Trash2,
} from "lucide-react";
import { BreadcrumbWrapper } from "@/components/BreadcrumbWrapper";

interface Partner {
  _id: string;
  userId: string;
  businessName: string;
  businessType: string;
  yearsOperation: string;
  location: string;
  address: string;
  contactName: string;
  position: string;
  phone: string;
  email: string;
  specialization: string[];
  monthlyVolume: string;
  currentSuppliers?: string;
  additionalInfo?: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  partnerLevel?: "bronze" | "silver" | "gold";
  discountRate?: number;
  creditLimit?: number;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  termsAccepted: boolean;
  marketingConsent: boolean;
  createdAt: string;
  updatedAt: string;
  applicationNumber: string;
}

interface Statistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  underReview: number;
}

export default function AdminPartnersPage() {
  const { user } = useAuth();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [businessTypeFilter, setBusinessTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Update form
  const [updateData, setUpdateData] = useState({
    status: "",
    partnerLevel: "",
    discountRate: "",
    creditLimit: "",
    adminNotes: "",
  });

  const loadPartners = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });

      if (statusFilter && statusFilter !== "all")
        params.append("status", statusFilter);
      if (businessTypeFilter && businessTypeFilter !== "all")
        params.append("businessType", businessTypeFilter);
      if (searchTerm) params.append("search", searchTerm);

      const response = await apiClient.getPartnerApplications(
        Object.fromEntries(params)
      );

      setPartners(response.partners || []);
      setStatistics(response.statistics);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error: any) {
      console.error("Failed to load partners:", error);
      toast.error("Failed to load partner applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      loadPartners();
    }
  }, [user, currentPage, statusFilter, businessTypeFilter, searchTerm]);

  const handleUpdatePartner = async () => {
    if (!selectedPartner) return;

    try {
      const updatePayload = {
        status: updateData.status || selectedPartner.status,
        ...(updateData.partnerLevel && {
          partnerLevel: updateData.partnerLevel,
        }),
        ...(updateData.discountRate && {
          discountRate: parseFloat(updateData.discountRate),
        }),
        ...(updateData.creditLimit && {
          creditLimit: parseFloat(updateData.creditLimit),
        }),
        ...(updateData.adminNotes && { adminNotes: updateData.adminNotes }),
      };

      await apiClient.updatePartnerApplicationStatus(
        selectedPartner._id,
        updatePayload
      );

      toast.success("Partner application updated successfully");
      setIsUpdateDialogOpen(false);
      setSelectedPartner(null);
      setUpdateData({
        status: "",
        partnerLevel: "",
        discountRate: "",
        creditLimit: "",
        adminNotes: "",
      });

      loadPartners();
    } catch (error: any) {
      console.error("Failed to update partner:", error);
      toast.error(error.message || "Failed to update partner application");
    }
  };

  const handleDeletePartner = async (partnerId: string) => {
    if (!confirm("Are you sure you want to delete this partner application?")) {
      return;
    }

    try {
      await apiClient.deletePartnerApplication(partnerId);
      toast.success("Partner application deleted successfully");
      loadPartners();
    } catch (error: any) {
      console.error("Failed to delete partner:", error);
      toast.error(error.message || "Failed to delete partner application");
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: {
        variant: "secondary" as const,
        icon: Clock,
        color: "text-gray-600",
      },
      approved: {
        variant: "default" as const,
        icon: CheckCircle,
        color: "text-green-600",
      },
      rejected: {
        variant: "destructive" as const,
        icon: XCircle,
        color: "text-red-600",
      },
      under_review: {
        variant: "outline" as const,
        icon: Eye,
        color: "text-yellow-600",
      },
    }[status] || {
      variant: "secondary" as const,
      icon: Clock,
      color: "text-gray-600",
    };

    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="w-3 h-3" />
        <span>{status.replace("_", " ").toUpperCase()}</span>
      </Badge>
    );
  };

  const getBusinessTypeLabel = (type: string) => {
    const labels = {
      garage: "Auto Garage",
      workshop: "Workshop",
      dealer: "Car Dealer",
      mechanic: "Independent Mechanic",
      other: "Other",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getVolumeLabel = (volume: string) => {
    const labels = {
      "under-10k": "Under Rs 10,000",
      "10k-25k": "Rs 10,000 - Rs 25,000",
      "25k-50k": "Rs 25,000 - Rs 50,000",
      "50k-100k": "Rs 50,000 - Rs 100,000",
      "over-100k": "Over Rs 100,000",
    };
    return labels[volume as keyof typeof labels] || volume;
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
            Partner Applications
          </h1>
          <p className="text-gray-600">
            Manage and review partnership applications
          </p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statistics.total}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {statistics.pending}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Under Review
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {statistics.underReview}
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Approved
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {statistics.approved}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Rejected
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {statistics.rejected}
                    </p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-400" />
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by business name, contact name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={businessTypeFilter}
                  onValueChange={setBusinessTypeFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="garage">Auto Garage</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="dealer">Car Dealer</SelectItem>
                    <SelectItem value="mechanic">
                      Independent Mechanic
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partners Table */}
        <Card>
          <CardHeader>
            <CardTitle>Partner Applications</CardTitle>
            <CardDescription>
              Review and manage partnership applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : partners.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No partner applications found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application #</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partners.map((partner) => (
                      <TableRow key={partner._id}>
                        <TableCell className="font-mono text-sm">
                          {partner.applicationNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {partner.businessName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {partner.location}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{partner.contactName}</p>
                            <p className="text-sm text-gray-600">
                              {partner.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getBusinessTypeLabel(partner.businessType)}
                        </TableCell>
                        <TableCell>{getStatusBadge(partner.status)}</TableCell>
                        <TableCell>
                          {new Date(partner.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPartner(partner);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPartner(partner);
                                setUpdateData({
                                  status: partner.status,
                                  partnerLevel: partner.partnerLevel || "",
                                  discountRate:
                                    partner.discountRate?.toString() || "",
                                  creditLimit:
                                    partner.creditLimit?.toString() || "",
                                  adminNotes: partner.adminNotes || "",
                                });
                                setIsUpdateDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            {partner.status !== "approved" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeletePartner(partner._id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
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
              <div className="flex justify-center mt-6 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 py-2 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Partner Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Partner Application Details</DialogTitle>
              <DialogDescription>
                {selectedPartner?.applicationNumber} -{" "}
                {selectedPartner?.businessName}
              </DialogDescription>
            </DialogHeader>

            {selectedPartner && (
              <div className="space-y-6">
                {/* Business Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Business Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Business Name
                      </Label>
                      <p className="text-sm">{selectedPartner.businessName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Business Type
                      </Label>
                      <p className="text-sm">
                        {getBusinessTypeLabel(selectedPartner.businessType)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Years in Operation
                      </Label>
                      <p className="text-sm">
                        {selectedPartner.yearsOperation}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Location
                      </Label>
                      <p className="text-sm">{selectedPartner.location}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Address
                      </Label>
                      <p className="text-sm">{selectedPartner.address}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Contact Person
                      </Label>
                      <p className="text-sm">{selectedPartner.contactName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Position
                      </Label>
                      <p className="text-sm">{selectedPartner.position}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Phone
                      </Label>
                      <p className="text-sm">{selectedPartner.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Email
                      </Label>
                      <p className="text-sm">{selectedPartner.email}</p>
                    </div>
                  </div>
                </div>

                {/* Business Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Business Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Vehicle Specialization
                      </Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedPartner.specialization.map((vehicle) => (
                          <Badge key={vehicle} variant="outline">
                            {vehicle}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Monthly Volume
                      </Label>
                      <p className="text-sm">
                        {getVolumeLabel(selectedPartner.monthlyVolume)}
                      </p>
                    </div>
                    {selectedPartner.currentSuppliers && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Current Suppliers
                        </Label>
                        <p className="text-sm">
                          {selectedPartner.currentSuppliers}
                        </p>
                      </div>
                    )}
                    {selectedPartner.additionalInfo && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Additional Information
                        </Label>
                        <p className="text-sm">
                          {selectedPartner.additionalInfo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Partnership Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Status & Partnership Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Status
                      </Label>
                      <div className="mt-1">
                        {getStatusBadge(selectedPartner.status)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Application Date
                      </Label>
                      <p className="text-sm">
                        {new Date(
                          selectedPartner.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedPartner.partnerLevel && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Partner Level
                        </Label>
                        <p className="text-sm capitalize">
                          {selectedPartner.partnerLevel}
                        </p>
                      </div>
                    )}
                    {selectedPartner.discountRate && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Discount Rate
                        </Label>
                        <p className="text-sm">
                          {selectedPartner.discountRate}%
                        </p>
                      </div>
                    )}
                    {selectedPartner.creditLimit && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Credit Limit
                        </Label>
                        <p className="text-sm">
                          Rs {selectedPartner.creditLimit.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedPartner.adminNotes && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Admin Notes</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm">{selectedPartner.adminNotes}</p>
                    </div>
                  </div>
                )}

                {/* Terms */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Terms & Agreements
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle
                        className={`w-4 h-4 ${
                          selectedPartner.termsAccepted
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                      <span className="text-sm">
                        Partnership terms and conditions accepted
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle
                        className={`w-4 h-4 ${
                          selectedPartner.marketingConsent
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                      <span className="text-sm">
                        Marketing communications consent
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Update Partner Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Partner Application</DialogTitle>
              <DialogDescription>
                Update the status and partnership details for{" "}
                {selectedPartner?.businessName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={updateData.status}
                  onValueChange={(value) =>
                    setUpdateData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {updateData.status === "approved" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="partnerLevel">Partner Level</Label>
                    <Select
                      value={updateData.partnerLevel}
                      onValueChange={(value) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          partnerLevel: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select partner level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bronze">Bronze</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                        <SelectItem value="gold">Gold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discountRate">Discount Rate (%)</Label>
                      <Input
                        id="discountRate"
                        type="number"
                        min="0"
                        max="50"
                        value={updateData.discountRate}
                        onChange={(e) =>
                          setUpdateData((prev) => ({
                            ...prev,
                            discountRate: e.target.value,
                          }))
                        }
                        placeholder="e.g., 20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="creditLimit">Credit Limit (Rs)</Label>
                      <Input
                        id="creditLimit"
                        type="number"
                        min="0"
                        value={updateData.creditLimit}
                        onChange={(e) =>
                          setUpdateData((prev) => ({
                            ...prev,
                            creditLimit: e.target.value,
                          }))
                        }
                        placeholder="e.g., 50000"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Textarea
                  id="adminNotes"
                  value={updateData.adminNotes}
                  onChange={(e) =>
                    setUpdateData((prev) => ({
                      ...prev,
                      adminNotes: e.target.value,
                    }))
                  }
                  placeholder="Add notes about this application..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsUpdateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdatePartner}>
                  Update Application
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
