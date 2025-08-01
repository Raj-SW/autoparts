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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  Upload,
  Download,
  Image,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { IPart } from "@/models/Part";

// Use the centralized Part model with string dates for compatibility
interface Part extends Omit<IPart, "_id" | "createdAt" | "updatedAt"> {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface PartFormData {
  partNumber: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  brand: string;
  manufacturer?: string;
  price: number;
  salePrice?: number;
  costPrice: number;
  stock: number;
  lowStockThreshold?: number;
  sku: string;
  location?: string;
  compatibility: {
    make: string[];
    model: string[];
    year: number[];
  };
  specifications: {
    condition: "new" | "used" | "refurbished";
    weight?: number;
    warranty?: string;
  };
  images: {
    url: string;
    publicId: string;
    width?: number;
    height?: number;
  }[];
  tags: string[];
}

export default function AdminPartsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [formData, setFormData] = useState<PartFormData>({
    partNumber: "",
    name: "",
    description: "",
    category: "",
    subcategory: "",
    brand: "",
    manufacturer: "",
    price: 0,
    salePrice: undefined,
    costPrice: 0,
    stock: 0,
    lowStockThreshold: 10,
    sku: "",
    location: "",
    compatibility: {
      make: [],
      model: [],
      year: [],
    },
    specifications: {
      condition: "new",
      weight: undefined,
      warranty: "",
    },
    images: [],
    tags: [],
  });

  // Check admin access
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
      toast.error("Admin access required");
    }
  }, [user, router]);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchParts();
    }
  }, [user, currentPage, categoryFilter, brandFilter, stockFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchParts = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getParts({
        page: currentPage,
        limit: 20,
        ...(categoryFilter &&
          categoryFilter !== "all" && { category: categoryFilter }),
        ...(brandFilter && brandFilter !== "all" && { brand: brandFilter }),
        ...(stockFilter &&
          stockFilter !== "all" && { stockLevel: stockFilter }),
      });

      setParts(data.parts || []);
      setTotalPages(Math.ceil((data.totalCount || 0) / 20));
    } catch (error) {
      console.error("Parts fetch error:", error);
      toast.error("Failed to load parts");
      setParts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPart) {
        await apiClient.updatePart(editingPart._id, formData);
      } else {
        await apiClient.createPart(formData);
      }

      toast.success(
        editingPart ? "Part updated successfully" : "Part created successfully"
      );
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setEditingPart(null);
      resetForm();
      fetchParts();
    } catch (error) {
      console.error("Part save error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save part"
      );
    }
  };

  const handleDelete = async (partId: string) => {
    try {
      if (!partId) {
        toast.error("Invalid part ID - cannot delete");
        return;
      }

      await apiClient.deletePart(partId);
      toast.success("Part deleted successfully");
      fetchParts();
    } catch (error) {
      console.error("Part delete error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete part"
      );
    }
  };

  const resetForm = () => {
    setFormData({
      partNumber: "",
      name: "",
      description: "",
      category: "",
      subcategory: "",
      brand: "",
      manufacturer: "",
      price: 0,
      salePrice: undefined,
      costPrice: 0,
      stock: 0,
      lowStockThreshold: 10,
      sku: "",
      location: "",
      compatibility: {
        make: [],
        model: [],
        year: [],
      },
      specifications: {
        condition: "new",
        weight: undefined,
        warranty: "",
      },
      images: [],
      tags: [],
    });
  };

  const openEditDialog = (part: Part) => {
    setEditingPart(part);
    setFormData({
      partNumber: part.partNumber,
      name: part.name,
      description: part.description,
      category: part.category,
      subcategory: (part as any).subcategory || "",
      brand: part.brand,
      manufacturer: (part as any).manufacturer || "",
      price: part.price,
      salePrice: part.salePrice,
      costPrice: part.costPrice,
      stock: part.stock,
      lowStockThreshold: (part as any).lowStockThreshold || 10,
      sku: part.sku,
      location: (part as any).location || "",
      compatibility: part.compatibility,
      specifications: part.specifications,
      images: part.images || [],
      tags: part.tags,
    });
    setIsEditDialogOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (stock < 10)
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    return { label: "In Stock", color: "bg-green-100 text-green-800" };
  };

  const filteredParts =
    parts?.filter(
      (part) =>
        part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.brand.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              You need admin privileges to access this page.
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Parts Management
            </h1>
            <p className="text-gray-600">Manage your spare parts inventory</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Part
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Part</DialogTitle>
                  <DialogDescription>
                    Create a new spare part entry in your inventory.
                  </DialogDescription>
                </DialogHeader>
                <PartForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search parts, SKU, brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Brakes">Brakes</SelectItem>
                  <SelectItem value="Engine">Engine</SelectItem>
                  <SelectItem value="Suspension">Suspension</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Body">Body</SelectItem>
                  <SelectItem value="Interior">Interior</SelectItem>
                </SelectContent>
              </Select>

              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  <SelectItem value="Brembo">Brembo</SelectItem>
                  <SelectItem value="Bosch">Bosch</SelectItem>
                  <SelectItem value="Monroe">Monroe</SelectItem>
                  <SelectItem value="NGK">NGK</SelectItem>
                  <SelectItem value="Fram">Fram</SelectItem>
                  <SelectItem value="OEM">OEM</SelectItem>
                </SelectContent>
              </Select>

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock Levels</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Parts Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Parts Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Part Info & Images</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParts.map((part) => {
                      const stockStatus = getStockStatus(part.stock);
                      return (
                        <TableRow
                          key={
                            part._id || part.partNumber || `part-${part.name}`
                          }
                        >
                          <TableCell>
                            <div>
                              <div className="font-semibold flex items-center gap-2">
                                {part.name}
                                {part.images && part.images.length > 0 && (
                                  <span
                                    title={`${part.images.length} image(s)`}
                                  >
                                    <Image className="h-4 w-4 text-blue-500" />
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600">
                                #{part.partNumber} • SKU: {part.sku}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{part.category}</Badge>
                          </TableCell>
                          <TableCell>{part.brand}</TableCell>
                          <TableCell>
                            <div>
                              {part.salePrice ? (
                                <>
                                  <div className="font-semibold">
                                    {formatPrice(part.salePrice)}
                                  </div>
                                  <div className="text-sm line-through text-gray-500">
                                    {formatPrice(part.price)}
                                  </div>
                                </>
                              ) : (
                                <div className="font-semibold">
                                  {formatPrice(part.price)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold">{part.stock}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={stockStatus.color}>
                              {stockStatus.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(`/catalog/${part._id}`)
                                  }
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openEditDialog(part)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Part
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "
                                        {part.name}"? This action cannot be
                                        undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(part._id)}
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {filteredParts.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {searchTerm ||
                      (categoryFilter && categoryFilter !== "all") ||
                      (brandFilter && brandFilter !== "all") ||
                      (stockFilter && stockFilter !== "all")
                        ? "No parts match your filters."
                        : "No parts found. Add your first part to get started."}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Part</DialogTitle>
              <DialogDescription>
                Update the details for this spare part.
              </DialogDescription>
            </DialogHeader>
            <PartForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingPart(null);
                resetForm();
              }}
              isEditing={true}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </div>
  );
}

// Part Form Component
function PartForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEditing = false,
}: {
  formData: PartFormData;
  setFormData: React.Dispatch<React.SetStateAction<PartFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing?: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="partNumber">Part Number *</Label>
            <Input
              id="partNumber"
              value={formData.partNumber}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, partNumber: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, sku: e.target.value }))
              }
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Brakes">Brakes</SelectItem>
                <SelectItem value="Engine">Engine</SelectItem>
                <SelectItem value="Suspension">Suspension</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Body">Body</SelectItem>
                <SelectItem value="Interior">Interior</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="brand">Brand *</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, brand: e.target.value }))
              }
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="subcategory">Subcategory</Label>
            <Input
              id="subcategory"
              value={formData.subcategory || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  subcategory: e.target.value,
                }))
              }
              placeholder="e.g., Disc Brakes, Spark Plugs"
            />
          </div>

          <div>
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input
              id="manufacturer"
              value={formData.manufacturer || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  manufacturer: e.target.value,
                }))
              }
              placeholder="e.g., OEM manufacturer name"
            />
          </div>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pricing & Inventory</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="costPrice">Cost Price *</Label>
            <Input
              id="costPrice"
              type="number"
              step="0.01"
              value={formData.costPrice}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  costPrice: parseFloat(e.target.value) || 0,
                }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Selling Price *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: parseFloat(e.target.value) || 0,
                }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="salePrice">Sale Price</Label>
            <Input
              id="salePrice"
              type="number"
              step="0.01"
              value={formData.salePrice || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  salePrice: e.target.value
                    ? parseFloat(e.target.value)
                    : undefined,
                }))
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="stock">Stock Quantity *</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stock: parseInt(e.target.value) || 0,
                }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
            <Input
              id="lowStockThreshold"
              type="number"
              value={formData.lowStockThreshold || 10}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  lowStockThreshold: parseInt(e.target.value) || 10,
                }))
              }
              placeholder="10"
            />
          </div>

          <div>
            <Label htmlFor="location">Storage Location</Label>
            <Input
              id="location"
              value={formData.location || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="e.g., Warehouse A, Shelf B2"
            />
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Specifications</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="condition">Condition *</Label>
            <Select
              value={formData.specifications.condition}
              onValueChange={(value: "new" | "used" | "refurbished") =>
                setFormData((prev) => ({
                  ...prev,
                  specifications: { ...prev.specifications, condition: value },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
                <SelectItem value="refurbished">Refurbished</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={formData.specifications.weight || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specifications: {
                    ...prev.specifications,
                    weight: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  },
                }))
              }
            />
          </div>

          <div>
            <Label htmlFor="warranty">Warranty</Label>
            <Input
              id="warranty"
              value={formData.specifications.warranty || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specifications: {
                    ...prev.specifications,
                    warranty: e.target.value,
                  },
                }))
              }
              placeholder="e.g., 2 years"
            />
          </div>
        </div>
      </div>

      {/* Vehicle Compatibility */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Vehicle Compatibility</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="make">Make</Label>
            <Input
              id="make"
              value={formData.compatibility.make.join(", ")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  compatibility: {
                    ...prev.compatibility,
                    make: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s),
                  },
                }))
              }
              placeholder="e.g., Toyota, Honda, Ford"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple makes with commas
            </p>
          </div>

          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={formData.compatibility.model.join(", ")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  compatibility: {
                    ...prev.compatibility,
                    model: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s),
                  },
                }))
              }
              placeholder="e.g., Camry, Accord, F-150"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple models with commas
            </p>
          </div>

          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              value={formData.compatibility.year.join(", ")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  compatibility: {
                    ...prev.compatibility,
                    year: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s)
                      .map((s) => parseInt(s))
                      .filter((n) => !isNaN(n)),
                  },
                }))
              }
              placeholder="e.g., 2015, 2016, 2017"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple years with commas
            </p>
          </div>
        </div>
      </div>

      {/* Tags and Keywords */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tags & Keywords</h3>

        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={formData.tags.join(", ")}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                tags: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s),
              }))
            }
            placeholder="e.g., brake pad, ceramic, performance"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate multiple tags with commas
          </p>
        </div>
      </div>

      {/* Images */}
      <CloudinaryImageUpload formData={formData} setFormData={setFormData} />

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? "Update Part" : "Create Part"}
        </Button>
      </div>
    </form>
  );
}

// Cloudinary Image Upload Component
function CloudinaryImageUpload({
  formData,
  setFormData,
}: {
  formData: PartFormData;
  setFormData: React.Dispatch<React.SetStateAction<PartFormData>>;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});

  const uploadToCloudinary = async (
    file: File
  ): Promise<{
    url: string;
    publicId: string;
    width?: number;
    height?: number;
  }> => {
    const formData = new FormData();
    formData.append("file", file);

    // Get the authentication token from localStorage
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Authentication token not found. Please log in again.");
    }

    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload image");
    }

    const result = await response.json();
    return {
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
    };
  };

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file, index) => {
      try {
        const fileKey = `${file.name}-${index}`;
        setUploadProgress((prev) => ({ ...prev, [fileKey]: 0 }));

        // Simulate progress (since we don't have real progress from fetch)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => ({
            ...prev,
            [fileKey]: Math.min((prev[fileKey] || 0) + 10, 90),
          }));
        }, 200);

        const result = await uploadToCloudinary(file);

        clearInterval(progressInterval);
        setUploadProgress((prev) => ({ ...prev, [fileKey]: 100 }));

        return result;
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error(
          `Failed to upload ${file.name}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        return null;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(
        (result): result is NonNullable<typeof result> => result !== null
      );

      if (successfulUploads.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...successfulUploads],
        }));
        toast.success(
          `Successfully uploaded ${successfulUploads.length} image(s)`
        );
      }
    } catch (error) {
      console.error("Batch upload failed:", error);
      toast.error("Some uploads failed");
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const handleUrlAdd = (url: string) => {
    if (!url.trim()) return;

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { url: url.trim(), publicId: "" }],
    }));
  };

  const handleImageDelete = async (index: number) => {
    const image = formData.images[index];

    // If it's a Cloudinary image (has publicId), delete from Cloudinary
    if (image.publicId) {
      try {
        // Get the authentication token from localStorage
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("Authentication token not found. Please log in again.");
          return;
        }

        const response = await fetch(`/api/upload?publicId=${image.publicId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("Failed to delete from Cloudinary:", error);
          toast.error("Failed to delete image from cloud storage");
          return;
        }
      } catch (error) {
        console.error("Delete request failed:", error);
        toast.error("Failed to delete image");
        return;
      }
    }

    // Remove from form data
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    toast.success("Image deleted successfully");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Product Images</h3>

      {/* Display existing images */}
      {formData.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {formData.images.map((image, index) => (
            <div key={image.url || `image-${index}`} className="relative group">
              <img
                src={image.url}
                alt={`Product ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.jpg";
                }}
              />
              <button
                type="button"
                onClick={() => handleImageDelete(index)}
                disabled={uploading}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                <X className="h-3 w-3" />
              </button>
              {image.publicId && (
                <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                  Cloud
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileKey, progress]) => (
            <div key={fileKey} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{fileKey.split("-")[0]}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File upload */}
      <div>
        <Label htmlFor="imageFile">Upload Image Files</Label>
        <Input
          id="imageFile"
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files) {
              handleFileUpload(e.target.files);
              e.target.value = ""; // Clear the input
            }
          }}
          className="cursor-pointer disabled:opacity-50"
        />
        <p className="text-xs text-gray-500 mt-1">
          Select multiple image files to upload to Cloudinary. Max 10MB per
          file.
        </p>
      </div>

      {/* Add image URL */}
      <div>
        <Label htmlFor="imageUrl">Add Image URL</Label>
        <div className="flex gap-2">
          <Input
            id="imageUrl"
            placeholder="https://example.com/image.jpg"
            disabled={uploading}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const input = e.target as HTMLInputElement;
                handleUrlAdd(input.value);
                input.value = "";
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={(e) => {
              const input = (e.target as HTMLElement)
                .previousElementSibling as HTMLInputElement;
              handleUrlAdd(input.value);
              input.value = "";
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Add external image URLs or press Enter to add.
        </p>
      </div>

      {uploading && (
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Uploading images...</span>
        </div>
      )}
    </div>
  );
}
