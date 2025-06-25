"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Star,
  CheckCircle,
  Quote,
  Phone,
  AlertTriangle,
  Timer,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import TrustSignals from "./components/TrustSignals";
import UrgencyTimer from "./components/UrgencyTimer";
import PriceComparison from "./components/PriceComparison";
import SmartFeatures from "./components/SmartFeatures";

const testimonials = [
  {
    name: "Raj Patel",
    location: "Port Louis",
    business: "Patel Auto Garage",
    text: "A.M.O saved my business! Got BMW parts in 2 hours when my customer was waiting. Their photo search feature is incredible - just snap and get instant quotes! 🚗",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
    verified: true,
    savings: "Rs 15,000",
  },
  {
    name: "Sarah Lim",
    location: "Quatre Bornes",
    business: "Private Customer",
    text: "My Hilux broke down Friday evening. A.M.O delivered Saturday morning! Their price comparison showed I saved 30% vs dealer. Incredible service! 👍",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
    verified: true,
    savings: "Rs 8,500",
  },
  {
    name: "Ahmed Hassan",
    location: "Rose Hill",
    business: "Hassan Motors",
    text: "3 years partnership with A.M.O. They understand my business needs. Wholesale prices help me stay competitive. True professionals! 💯",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
    verified: true,
    savings: "Rs 45,000",
  },
  {
    name: "Marie Dubois",
    location: "Curepipe",
    business: "Private Customer",
    text: "WhatsApp ordering is revolutionary! Got Mercedes parts quote in 15 minutes, delivered same day. A.M.O is changing the game! 🙏",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
    verified: true,
    savings: "Rs 12,000",
  },
];

const urgentOffers = [
  {
    title: "Flash Sale: BMW Brake Pads",
    originalPrice: "Rs 3,200",
    salePrice: "Rs 2,500",
    savings: "Rs 700",
    timeLeft: "2 hours",
    stock: "Only 3 left",
    demandLevel: "High",
  },
  {
    title: "Limited: Hilux Shock Absorbers",
    originalPrice: "Rs 4,000",
    salePrice: "Rs 3,200",
    savings: "Rs 800",
    timeLeft: "6 hours",
    stock: "Only 2 left",
    demandLevel: "Critical",
  },
];

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Urgency Banner */}
      <div className="bg-[#D72638] text-white py-2 text-center text-sm font-semibold">
        <div className="container mx-auto px-4 flex items-center justify-center space-x-4">
          <Zap className="w-4 h-4" />
          <span>
            🔥 LIMITED TIME: Free same-day delivery on orders over Rs 5,000!
          </span>
          <UrgencyTimer />
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-red-50 opacity-30"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                <Badge className="bg-[#D72638] text-white hover:bg-[#B91C2C] animate-pulse">
                  🇲🇺 #1 in Mauritius
                </Badge>
                <Badge className="bg-green-600 text-white">
                  ✅ Trusted by 500+ Customers
                </Badge>
                <Badge className="bg-blue-600 text-white">
                  ⚡ 1-Hour Quotes
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight font-montserrat">
                <span className="text-[#D72638]">Stop Waiting Weeks</span> for
                Car Parts!
                <br />
                <span className="text-2xl md:text-3xl lg:text-4xl text-gray-700">
                  Get Genuine Parts in 1 Hour ⚡
                </span>
              </h1>

              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-lg font-semibold text-yellow-800">
                  ⚠️ Don't let your car sit broken for days! Other suppliers
                  take 1-2 weeks. We deliver TODAY.
                </p>
              </div>

              <p className="text-xl text-gray-600 leading-relaxed">
                <strong>Mauritius' FASTEST spare parts service.</strong> BMW,
                Audi, Mercedes & 4x4 parts with
                <span className="text-[#D72638] font-bold">
                  {" "}
                  guaranteed fitment
                </span>{" "}
                or your money back!
              </p>

              <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-[#D72638]">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  🎯 Why 500+ Mauritians Choose Us:
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>1-hour quotes (not days)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Same-day delivery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>30% cheaper than dealers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>100% genuine parts</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#D72638] hover:bg-[#B91C2C] text-white text-lg px-8 py-4 font-semibold animate-pulse shadow-lg"
                  onClick={() =>
                    window.open(
                      "https://wa.me/23057123456?text=🚗 URGENT: I need spare parts quote NOW! My car: ",
                      "_blank"
                    )
                  }
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  🔥 GET INSTANT QUOTE (FREE)
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#D72638] text-[#D72638] hover:bg-[#D72638] hover:text-white text-lg px-8 py-4"
                  onClick={() => window.open("tel:+23057123456", "_self")}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  📞 Call NOW: 5712-3456
                </Button>
              </div>

              <div className="flex items-center space-x-6 pt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Timer className="w-5 h-5 text-[#D72638]" />
                  <span className="font-semibold">
                    Average response: 12 minutes
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">
                    4.9/5 rating (500+ reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 relative">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Premium car parts and accessories"
                  width={500}
                  height={400}
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute -top-4 -right-4 bg-[#D72638] text-white px-4 py-2 rounded-full font-semibold animate-bounce">
                  ⚡ 1 Hour Delivery
                </div>
                <div className="absolute -bottom-4 -left-4 bg-green-600 text-white px-4 py-2 rounded-full font-semibold">
                  💰 30% Cheaper
                </div>
              </div>

              {/* Floating testimonial */}
              <div className="absolute -bottom-6 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
                <div className="flex items-center space-x-2 mb-2">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Customer"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-sm">Raj P.</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  "Got my BMW parts in 2 hours! Amazing service!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <TrustSignals />

      {/* Urgent Offers Section */}
      <section className="py-8 bg-red-50 border-y-2 border-red-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-red-800 font-montserrat flex items-center justify-center space-x-2">
              <AlertTriangle className="w-6 h-6" />
              <span>🔥 FLASH DEALS - LIMITED TIME!</span>
              <AlertTriangle className="w-6 h-6" />
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {urgentOffers.map((offer, index) => (
              <Card
                key={index}
                className="border-2 border-red-300 bg-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 text-sm font-bold">
                  SAVE {offer.savings}
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{offer.title}</h3>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl font-bold text-[#D72638]">
                      {offer.salePrice}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {offer.originalPrice}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-red-600 font-semibold">
                      ⏰ {offer.timeLeft} left
                    </span>
                    <span className="text-orange-600 font-semibold">
                      📦 {offer.stock}
                    </span>
                  </div>
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                    onClick={() =>
                      window.open(
                        "https://wa.me/23057123456?text=🔥 I want the flash deal: " +
                          offer.title,
                        "_blank"
                      )
                    }
                  >
                    🛒 GRAB THIS DEAL NOW!
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
                😤 Tired of These Common Problems?
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Problems */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-red-600 mb-6">
                  ❌ What Other Suppliers Do:
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-red-800">
                        Take 1-2 weeks for quotes
                      </h4>
                      <p className="text-red-700">
                        Your car sits broken while they "check availability"
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-red-800">
                        Sell fake or used parts
                      </h4>
                      <p className="text-red-700">
                        Parts fail after few months, costing you more
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-red-800">
                        Charge dealer prices
                      </h4>
                      <p className="text-red-700">
                        You pay 50% more than necessary
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-red-800">
                        No guarantee on fitment
                      </h4>
                      <p className="text-red-700">
                        Wrong parts? "Not our problem"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solutions */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-green-600 mb-6">
                  ✅ What A.M.O Does Different:
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-green-800">
                        1-hour quote guarantee
                      </h4>
                      <p className="text-green-700">
                        Get back on the road TODAY, not next week
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-green-800">
                        100% genuine parts only
                      </h4>
                      <p className="text-green-700">
                        Direct from authorized distributors with certificates
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-green-800">
                        30% below dealer prices
                      </h4>
                      <p className="text-green-700">
                        Save thousands on every repair
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-green-800">
                        Wrong part? Free exchange
                      </h4>
                      <p className="text-green-700">
                        We guarantee perfect fitment or money back
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-yellow-800 mb-3">
                  💡 Smart Choice: Join 500+ Satisfied Customers
                </h3>
                <p className="text-yellow-700 mb-4">
                  Don't waste time with unreliable suppliers. Get your parts
                  fast, genuine, and affordable.
                </p>
                <Button
                  size="lg"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold"
                  onClick={() =>
                    window.open(
                      "https://wa.me/23057123456?text=I want reliable parts service like your other 500+ customers!",
                      "_blank"
                    )
                  }
                >
                  🚀 Join the Smart Customers
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top 4 Parts Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
              🔥 Most Requested Parts (Flying Off Shelves!)
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              <strong>These parts sell out fast!</strong> Order now before stock
              runs out.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* BMW Brake Pads */}
            <Card className="hover:shadow-lg transition-shadow relative overflow-hidden border-2 border-transparent hover:border-[#D72638]">
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                HOT SELLER
              </div>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-blue-100 text-blue-800"
                  >
                    BMW
                  </Badge>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#D72638]">
                      Rs 2,500
                    </span>
                    <p className="text-xs text-gray-500 line-through">
                      Rs 3,200
                    </p>
                  </div>
                </div>
                <h3 className="font-semibold text-lg">Brake Pads (Front)</h3>
                <p className="text-sm text-gray-600">
                  ✅ Compatible: 3 Series, 5 Series, X3
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600 font-semibold">
                    📦 In Stock
                  </span>
                  <span className="text-orange-600 font-semibold">
                    ⚡ 2hr delivery
                  </span>
                </div>
                <div className="bg-yellow-50 p-2 rounded text-xs text-center">
                  <span className="text-yellow-800 font-semibold">
                    💰 Save Rs 700 vs dealer!
                  </span>
                </div>
                <Button
                  className="w-full bg-[#D72638] hover:bg-[#B91C2C] text-sm font-bold"
                  onClick={() =>
                    window.open(
                      "https://wa.me/23057123456?text=🚗 I need BMW brake pads - Rs 2,500 deal!",
                      "_blank"
                    )
                  }
                >
                  🛒 ORDER NOW (Save Rs 700)
                </Button>
              </CardContent>
            </Card>

            {/* Mercedes Oil Filter */}
            <Card className="hover:shadow-lg transition-shadow relative overflow-hidden border-2 border-transparent hover:border-[#D72638]">
              <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                BEST VALUE
              </div>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-gray-100 text-gray-800"
                  >
                    Mercedes
                  </Badge>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#D72638]">
                      Rs 950
                    </span>
                    <p className="text-xs text-gray-500 line-through">
                      Rs 1,200
                    </p>
                  </div>
                </div>
                <h3 className="font-semibold text-lg">Oil Filter</h3>
                <p className="text-sm text-gray-600">
                  ✅ Compatible: C-Class, E-Class, GLC
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600 font-semibold">
                    📦 In Stock
                  </span>
                  <span className="text-orange-600 font-semibold">
                    ⚡ 1hr delivery
                  </span>
                </div>
                <div className="bg-yellow-50 p-2 rounded text-xs text-center">
                  <span className="text-yellow-800 font-semibold">
                    💰 Save Rs 250 vs dealer!
                  </span>
                </div>
                <Button
                  className="w-full bg-[#D72638] hover:bg-[#B91C2C] text-sm font-bold"
                  onClick={() =>
                    window.open(
                      "https://wa.me/23057123456?text=🚗 I need Mercedes oil filter - Rs 950 deal!",
                      "_blank"
                    )
                  }
                >
                  🛒 ORDER NOW (Save Rs 250)
                </Button>
              </CardContent>
            </Card>

            {/* Hilux Shock Absorbers */}
            <Card className="hover:shadow-lg transition-shadow relative overflow-hidden border-2 border-transparent hover:border-[#D72638]">
              <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                LIMITED
              </div>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-red-100 text-red-800"
                  >
                    Toyota
                  </Badge>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#D72638]">
                      Rs 3,200
                    </span>
                    <p className="text-xs text-gray-500 line-through">
                      Rs 4,000
                    </p>
                  </div>
                </div>
                <h3 className="font-semibold text-lg">Shock Absorbers</h3>
                <p className="text-sm text-gray-600">
                  ✅ Compatible: Hilux, Fortuner
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-orange-600 font-semibold">
                    📦 Only 2 left
                  </span>
                  <span className="text-orange-600 font-semibold">
                    ⚡ 3hr delivery
                  </span>
                </div>
                <div className="bg-yellow-50 p-2 rounded text-xs text-center">
                  <span className="text-yellow-800 font-semibold">
                    💰 Save Rs 800 vs dealer!
                  </span>
                </div>
                <Button
                  className="w-full bg-[#D72638] hover:bg-[#B91C2C] text-sm font-bold animate-pulse"
                  onClick={() =>
                    window.open(
                      "https://wa.me/23057123456?text=🚗 URGENT: I need Hilux shock absorbers - only 2 left!",
                      "_blank"
                    )
                  }
                >
                  🔥 GRAB LAST 2 (Save Rs 800)
                </Button>
              </CardContent>
            </Card>

            {/* Audi Air Filter */}
            <Card className="hover:shadow-lg transition-shadow relative overflow-hidden border-2 border-transparent hover:border-[#D72638]">
              <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                PREMIUM
              </div>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-purple-100 text-purple-800"
                  >
                    Audi
                  </Badge>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#D72638]">
                      Rs 1,200
                    </span>
                    <p className="text-xs text-gray-500 line-through">
                      Rs 1,500
                    </p>
                  </div>
                </div>
                <h3 className="font-semibold text-lg">Air Filter</h3>
                <p className="text-sm text-gray-600">
                  ✅ Compatible: A3, A4, Q3, Q5
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600 font-semibold">
                    📦 In Stock
                  </span>
                  <span className="text-orange-600 font-semibold">
                    ⚡ 2hr delivery
                  </span>
                </div>
                <div className="bg-yellow-50 p-2 rounded text-xs text-center">
                  <span className="text-yellow-800 font-semibold">
                    💰 Save Rs 300 vs dealer!
                  </span>
                </div>
                <Button
                  className="w-full bg-[#D72638] hover:bg-[#B91C2C] text-sm font-bold"
                  onClick={() =>
                    window.open(
                      "https://wa.me/23057123456?text=🚗 I need Audi air filter - Rs 1,200 deal!",
                      "_blank"
                    )
                  }
                >
                  🛒 ORDER NOW (Save Rs 300)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Price Comparison */}
      <PriceComparison />

      {/* Smart Features (Optional) */}
      <SmartFeatures />

      {/* Enhanced Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
              💬 Real Stories from Real Customers
            </h2>
            <p className="text-xl text-gray-600">
              See why 500+ Mauritians trust us with their cars
            </p>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">
                4.9/5 Average Rating
              </span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Card className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <Quote className="w-12 h-12 text-[#D72638] flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-xl text-gray-700 mb-6 italic leading-relaxed">
                        "{testimonials[currentTestimonial].text}"
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={
                              testimonials[currentTestimonial].image ||
                              "/placeholder.svg"
                            }
                            alt={testimonials[currentTestimonial].name}
                            width={60}
                            height={60}
                            className="rounded-full border-2 border-[#D72638]"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-bold text-gray-900">
                                {testimonials[currentTestimonial].name}
                              </p>
                              {testimonials[currentTestimonial].verified && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  ✅ Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600">
                              {testimonials[currentTestimonial].location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
