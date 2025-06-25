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

interface Part {
  _id: string;
  partNumber: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  salePrice?: number;
  costPrice: number;
  stock: number;
  sku: string;
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
  images: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface PartFormData {
  partNumber: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  salePrice?: number;
  costPrice: number;
  stock: number;
  sku: string;
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
  tags: string[];
}

export default function AdminPartsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
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
    brand: "",
    price: 0,
    salePrice: undefined,
    costPrice: 0,
    stock: 0,
    sku: "",
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
  }, [user, currentPage, categoryFilter, brandFilter, stockFilter]);

  const fetchParts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "20");
      if (categoryFilter) params.append("category", categoryFilter);
      if (brandFilter) params.append("brand", brandFilter);
      if (stockFilter) params.append("stockLevel", stockFilter);

      const response = await apiClient(`/api/parts?${params}`);
      const data = await response.json();

      if (response.ok) {
        setParts(data.parts);
        setTotalPages(Math.ceil(data.total / 20));
      } else {
        throw new Error(data.error || "Failed to fetch parts");
      }
    } catch (error) {
      console.error("Parts fetch error:", error);
      toast.error("Failed to load parts");

      // Demo data fallback
      setParts([
        {
          _id: "1",
          partNumber: "BRK001",
          name: "Brake Pads - Front Set",
          description:
            "High-performance ceramic brake pads for superior stopping power",
          category: "Brakes",
          brand: "Brembo",
          price: 89.99,
          salePrice: 79.99,
          costPrice: 45.0,
          stock: 25,
          sku: "BRK-BREMBO-001",
          compatibility: {
            make: ["Toyota", "Honda"],
            model: ["Camry", "Civic"],
            year: [2015, 2016, 2017, 2018, 2019, 2020],
          },
          specifications: {
            condition: "new",
            weight: 2.5,
            warranty: "2 years",
          },
          images: [],
          tags: ["brake", "ceramic", "performance"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingPart ? `/api/parts/${editingPart._id}` : "/api/parts";
      const method = editingPart ? "PUT" : "POST";

      const response = await apiClient(url, {
        method,
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          editingPart
            ? "Part updated successfully"
            : "Part created successfully"
        );
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        setEditingPart(null);
        resetForm();
        fetchParts();
      } else {
        throw new Error(result.error || "Failed to save part");
      }
    } catch (error) {
      console.error("Part save error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save part"
      );
    }
  };

  const handleDelete = async (partId: string) => {
    try {
      const response = await apiClient(`/api/parts/${partId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Part deleted successfully");
        fetchParts();
      } else {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete part");
      }
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
      brand: "",
      price: 0,
      salePrice: undefined,
      costPrice: 0,
      stock: 0,
      sku: "",
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
      brand: part.brand,
      price: part.price,
      salePrice: part.salePrice,
      costPrice: part.costPrice,
      stock: part.stock,
      sku: part.sku,
      compatibility: part.compatibility,
      specifications: part.specifications,
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

  const filteredParts = parts.filter(
    (part) =>
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Button asChild>
              <span onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </span>
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
                  <SelectItem value="">All Categories</SelectItem>
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
                  <SelectItem value="">All Brands</SelectItem>
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
                  <SelectItem value="">All Stock Levels</SelectItem>
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
                      <TableHead>Part Info</TableHead>
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
                        <TableRow key={part._id}>
                          <TableCell>
                            <div>
                              <div className="font-semibold">{part.name}</div>
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
                      categoryFilter ||
                      brandFilter ||
                      stockFilter
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
