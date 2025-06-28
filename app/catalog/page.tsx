"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, Grid, List, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/CartContext";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import Link from "next/link";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { IPart } from "@/models/Part";

// For backward compatibility in components that expect certain fields
interface Part extends Omit<IPart, "_id" | "images"> {
  _id: string;
  images: string[]; // Simplified for display purposes
}

interface SearchFilters {
  search: string;
  vehicleMake: string;
  category: string;
  condition: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
}

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const { addItem, isInCart } = useCart();

  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");

  const [filters, setFilters] = useState<SearchFilters>({
    search: searchParams.get("search") || "",
    vehicleMake: "",
    category: "",
    condition: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
  });

  const vehicleMakes = [
    "BMW",
    "Audi",
    "Mercedes-Benz",
    "Toyota",
    "Ford",
    "Nissan",
    "Land Rover",
    "Volkswagen",
  ];
  const categories = [
    "Engine",
    "Brake",
    "Suspension",
    "Electrical",
    "Body",
    "Transmission",
    "Cooling",
    "Exhaust",
  ];
  const conditions = ["New", "OEM", "Aftermarket", "Refurbished"];

  useEffect(() => {
    searchParts();
  }, [filters, currentPage, sortBy]);

  const searchParts = async () => {
    setLoading(true);
    try {
      const params: any = {};

      if (filters.search) params.search = filters.search;
      if (filters.vehicleMake) params.vehicleMake = filters.vehicleMake;
      if (filters.category) params.category = filters.category;
      if (filters.condition) params.condition = filters.condition;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.inStock) params.inStock = "true";

      params.page = currentPage.toString();
      params.limit = "12";
      params.sortBy = sortBy;

      const data = await apiClient.getParts(params);

      setParts(data.parts || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search parts. Please try again.");
      setParts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (part: Part) => {
    addItem({
      id: part._id,
      partNumber: part.partNumber,
      name: part.name,
      price: part.price,
      stock: part.stock,
      image: part.images[0],
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      vehicleMake: "",
      category: "",
      condition: "",
      minPrice: "",
      maxPrice: "",
      inStock: false,
    });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / 12);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Parts Catalog
              </h1>
              <p className="text-gray-600 mt-1">
                Genuine spare parts for premium vehicles
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search by part number, name, or description..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button onClick={searchParts}>Search</Button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Filters</span>
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                      Clear All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Vehicle Make
                      </label>
                      <Select
                        value={filters.vehicleMake}
                        onValueChange={(value) =>
                          setFilters({ ...filters, vehicleMake: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Makes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Makes</SelectItem>
                          {vehicleMakes.map((make) => (
                            <SelectItem key={make} value={make}>
                              {make}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Category
                      </label>
                      <Select
                        value={filters.category}
                        onValueChange={(value) =>
                          setFilters({ ...filters, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Condition
                      </label>
                      <Select
                        value={filters.condition}
                        onValueChange={(value) =>
                          setFilters({ ...filters, condition: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Conditions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Conditions</SelectItem>
                          {conditions.map((condition) => (
                            <SelectItem key={condition} value={condition}>
                              {condition}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Min Price
                      </label>
                      <Input
                        type="number"
                        placeholder="$0"
                        value={filters.minPrice}
                        onChange={(e) =>
                          setFilters({ ...filters, minPrice: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Max Price
                      </label>
                      <Input
                        type="number"
                        placeholder="No limit"
                        value={filters.maxPrice}
                        onChange={(e) =>
                          setFilters({ ...filters, maxPrice: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-gray-600">
              {loading ? "Searching..." : `${totalCount} parts found`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="-price">Price (High to Low)</SelectItem>
                  <SelectItem value="vehicleMake">Vehicle Make</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Parts Grid/List */}
        {loading ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : parts.length > 0 ? (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {parts.map((part) => (
                <Card
                  key={part._id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {viewMode === "grid" ? (
                    <>
                      <div className="relative">
                        <img
                          src={part.images[0].url}
                          alt={part.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Badge
                            variant={part.stock > 0 ? "default" : "destructive"}
                          >
                            {part.stock > 0 ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                              {part.name}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-600">
                            #{part.partNumber}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>{part.brand}</span>
                            <span>•</span>
                            <span>{part.category}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-[#D72638]">
                              {formatPrice(part.price)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {part.specifications?.condition || "New"}
                            </Badge>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(part)}
                              disabled={part.stock === 0 || isInCart(part._id)}
                              className="flex-1"
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              {isInCart(part._id) ? "In Cart" : "Add to Cart"}
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/catalog/${part._id}`}>View</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={part.images[0] || "/placeholder.jpg"}
                          alt={part.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold">{part.name}</h3>
                            <span className="text-lg font-bold text-[#D72638]">
                              {formatPrice(part.price)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            #{part.partNumber}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {part.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span>
                              {part.brand} {part.compatibility?.make?.[0] || ""}
                            </span>
                            <span>•</span>
                            <span>{part.category}</span>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {part.specifications?.condition || "New"}
                            </Badge>
                            <span>•</span>
                            <Badge
                              variant={
                                part.stock > 0 ? "default" : "destructive"
                              }
                              className="text-xs"
                            >
                              {part.stock > 0
                                ? `${part.stock} in stock`
                                : "Out of Stock"}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(part)}
                              disabled={part.stock === 0 || isInCart(part._id)}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              {isInCart(part._id) ? "In Cart" : "Add to Cart"}
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/catalog/${part._id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
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
          </>
        ) : (
          <div className="text-center py-16">
            <div className="mb-4">
              <Search className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No parts found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse by category
            </p>
            <Button onClick={resetFilters}>Clear Filters</Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
