"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  Award,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import Link from "next/link";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

interface Part {
  _id: string;
  partNumber: string;
  name: string;
  description: string;
  category: string;
  vehicleMake: string;
  vehicleModel: string;
  price: number;
  stock: number;
  condition: string;
  images: string[];
  specifications: Record<string, any>;
  warranty: string;
  weight: number;
}

export default function PartDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, isInCart, getItem } = useCart();
  const { user } = useAuth();

  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchPart(params.id as string);
    }
  }, [params.id]);

  const fetchPart = async (id: string) => {
    setLoading(true);
    try {
      const response = await apiClient(`/api/parts/${id}`);
      const data = await response.json();

      if (response.ok) {
        setPart(data);
      } else {
        throw new Error(data.error || "Failed to fetch part");
      }
    } catch (error) {
      console.error("Fetch part error:", error);
      toast.error("Failed to load part details. Please try again.");
      setPart(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!part) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: part._id,
        partNumber: part.partNumber,
        name: part.name,
        price: part.price,
        stock: part.stock,
        image: part.images[0],
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: part?.name,
          text: `Check out this ${part?.name} for ${part?.vehicleMake} ${part?.vehicleModel}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-96 bg-gray-200 rounded"></div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 w-20 bg-gray-200 rounded"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!part) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Part Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The part you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/catalog">Back to Catalog</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const cartItem = getItem(part._id);
  const maxQuantity = Math.min(part.stock, 10); // Limit to 10 or stock available

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <span className="text-gray-400">/</span>
          <Link
            href="/catalog"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Catalog
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-sm text-gray-900">{part.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={part.images[selectedImage] || "/placeholder.jpg"}
                alt={part.name}
                className="w-full h-96 object-cover rounded-lg bg-white border"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="absolute top-4 right-4"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {part.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {part.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                      selectedImage === index
                        ? "border-[#D72638]"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.jpg"}
                      alt={`${part.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Part Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {part.name}
                </h1>
                <Button variant="ghost" size="sm">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-gray-600">Part Number: {part.partNumber}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{part.condition}</Badge>
                <Badge variant={part.stock > 0 ? "default" : "destructive"}>
                  {part.stock > 0 ? `${part.stock} in stock` : "Out of Stock"}
                </Badge>
              </div>
            </div>

            <div className="text-3xl font-bold text-[#D72638]">
              {formatPrice(part.price)}
            </div>

            <p className="text-gray-700 leading-relaxed">{part.description}</p>

            {/* Vehicle Compatibility */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vehicle Compatibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Make:</span>
                    <p className="font-semibold">{part.vehicleMake}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Model:</span>
                    <p className="font-semibold">{part.vehicleModel}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Category:</span>
                    <p className="font-semibold">{part.category}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Weight:</span>
                    <p className="font-semibold">{part.weight} kg</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add to Cart */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Quantity:
                      </label>
                      <select
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="border rounded-md px-3 py-2 min-w-20"
                        disabled={part.stock === 0}
                      >
                        {[...Array(maxQuantity)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Total:</p>
                      <p className="text-xl font-bold text-[#D72638]">
                        {formatPrice(part.price * quantity)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddToCart}
                      disabled={part.stock === 0}
                      className="flex-1"
                      size="lg"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {isInCart(part._id) ? "Update Cart" : "Add to Cart"}
                    </Button>

                    {!user && (
                      <Button variant="outline" size="lg" asChild>
                        <Link href="/login">Login to Buy</Link>
                      </Button>
                    )}
                  </div>

                  {cartItem && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        You already have {cartItem.quantity} of this item in
                        your cart.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <Shield className="h-8 w-8 text-[#D72638] mx-auto mb-2" />
                <p className="text-sm font-medium">Genuine Parts</p>
                <p className="text-xs text-gray-600">OEM Quality</p>
              </div>
              <div className="text-center">
                <Truck className="h-8 w-8 text-[#D72638] mx-auto mb-2" />
                <p className="text-sm font-medium">Fast Delivery</p>
                <p className="text-xs text-gray-600">Same Day</p>
              </div>
              <div className="text-center">
                <Award className="h-8 w-8 text-[#D72638] mx-auto mb-2" />
                <p className="text-sm font-medium">Warranty</p>
                <p className="text-xs text-gray-600">{part.warranty}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(part.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compatibility" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Compatibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">
                        {part.vehicleMake} {part.vehicleModel}
                      </h4>
                      <p className="text-gray-600">
                        This part is specifically designed for{" "}
                        {part.vehicleMake} {part.vehicleModel} vehicles. Please
                        verify your vehicle's specifications before ordering.
                      </p>
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Not sure if this part fits your vehicle? Contact our
                        support team with your VIN number for confirmation.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping & Returns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">
                        Shipping Information
                      </h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Same-day delivery within Port Louis area</li>
                        <li>• Island-wide delivery within 24-48 hours</li>
                        <li>• Free shipping on orders over $100</li>
                        <li>• Express delivery available</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Returns & Warranty</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• {part.warranty} warranty included</li>
                        <li>• 30-day return policy for unused items</li>
                        <li>• Original packaging required for returns</li>
                        <li>• Inspection may be required for returns</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}
