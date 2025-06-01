"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Search, MessageCircle, Car, Truck, Star, Filter, ExternalLink } from "lucide-react"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"

const partsByBrand = {
  bmw: [
    { name: "Brake Pads (Front)", price: "Rs 2,500", compatibility: "3 Series, 5 Series, X3, X5", stock: "In Stock" },
    { name: "Oil Filter", price: "Rs 850", compatibility: "All BMW Models", stock: "In Stock" },
    { name: "Air Filter", price: "Rs 1,200", compatibility: "3 Series, 5 Series", stock: "In Stock" },
    { name: "Brake Discs (Pair)", price: "Rs 4,800", compatibility: "X3, X5, X6", stock: "Limited" },
    { name: "Spark Plugs (Set)", price: "Rs 1,600", compatibility: "All Petrol Models", stock: "In Stock" },
    { name: "Cabin Filter", price: "Rs 950", compatibility: "3 Series, 5 Series, X3", stock: "In Stock" },
  ],
  mercedes: [
    { name: "Brake Pads (Front)", price: "Rs 2,800", compatibility: "C-Class, E-Class", stock: "In Stock" },
    { name: "Oil Filter", price: "Rs 900", compatibility: "All Mercedes Models", stock: "In Stock" },
    { name: "Air Filter", price: "Rs 1,350", compatibility: "C-Class, E-Class, GLC", stock: "In Stock" },
    { name: "Brake Discs (Pair)", price: "Rs 5,200", compatibility: "GLC, GLE, GLS", stock: "In Stock" },
    { name: "Timing Belt", price: "Rs 2,400", compatibility: "C-Class, E-Class", stock: "Limited" },
    { name: "Water Pump", price: "Rs 3,800", compatibility: "All Models", stock: "In Stock" },
  ],
  audi: [
    { name: "Brake Pads (Front)", price: "Rs 2,600", compatibility: "A3, A4, Q3, Q5", stock: "In Stock" },
    { name: "Oil Filter", price: "Rs 880", compatibility: "All Audi Models", stock: "In Stock" },
    { name: "Air Filter", price: "Rs 1,250", compatibility: "A3, A4, A6", stock: "In Stock" },
    { name: "Clutch Kit", price: "Rs 8,500", compatibility: "A3, A4 Manual", stock: "Limited" },
    { name: "Fuel Filter", price: "Rs 1,100", compatibility: "All Diesel Models", stock: "In Stock" },
    { name: "Suspension Strut", price: "Rs 4,200", compatibility: "Q3, Q5", stock: "In Stock" },
  ],
  hilux: [
    { name: "Shock Absorbers", price: "Rs 3,200", compatibility: "Hilux 2015+", stock: "In Stock" },
    { name: "Brake Pads (Front)", price: "Rs 1,800", compatibility: "All Hilux Models", stock: "In Stock" },
    { name: "Oil Filter", price: "Rs 650", compatibility: "Hilux, Fortuner", stock: "In Stock" },
    { name: "Clutch Kit", price: "Rs 8,500", compatibility: "Manual Transmission", stock: "In Stock" },
    { name: "Timing Belt", price: "Rs 1,800", compatibility: "2.5L & 3.0L Engines", stock: "Limited" },
    { name: "Air Filter", price: "Rs 850", compatibility: "All Hilux Models", stock: "In Stock" },
  ],
  ranger: [
    { name: "Shock Absorbers", price: "Rs 3,400", compatibility: "Ranger 2012+", stock: "In Stock" },
    { name: "Brake Pads (Front)", price: "Rs 1,900", compatibility: "All Ranger Models", stock: "In Stock" },
    { name: "Oil Filter", price: "Rs 680", compatibility: "2.2L & 3.2L Engines", stock: "In Stock" },
    { name: "Clutch Kit", price: "Rs 9,200", compatibility: "Manual Transmission", stock: "Limited" },
    { name: "Fuel Filter", price: "Rs 950", compatibility: "All Diesel Models", stock: "In Stock" },
    { name: "Radiator", price: "Rs 4,500", compatibility: "Ranger 2012+", stock: "In Stock" },
  ],
  navara: [
    { name: "Shock Absorbers", price: "Rs 3,100", compatibility: "Navara D40, NP300", stock: "In Stock" },
    { name: "Brake Pads (Front)", price: "Rs 1,750", compatibility: "All Navara Models", stock: "In Stock" },
    { name: "Oil Filter", price: "Rs 620", compatibility: "2.5L Diesel Engine", stock: "In Stock" },
    { name: "Clutch Kit", price: "Rs 8,800", compatibility: "Manual Transmission", stock: "In Stock" },
    { name: "Air Filter", price: "Rs 800", compatibility: "All Navara Models", stock: "In Stock" },
    { name: "Timing Chain Kit", price: "Rs 3,500", compatibility: "2.5L Engine", stock: "Limited" },
  ],
}

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-montserrat">Parts Catalog</h1>
            <p className="text-xl text-gray-600 mb-8">
              Browse our comprehensive collection of genuine spare parts for German cars and 4x4 vehicles
            </p>

            {/* Catalog Download Options */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#D72638] hover:bg-[#B91C2C]"
                onClick={() => window.open("/catalog-2024.pdf", "_blank")}
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF Catalog
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#D72638] text-[#D72638] hover:bg-[#D72638] hover:text-white"
                onClick={() => window.open("https://flipbook.example.com/amo-catalog", "_blank")}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Interactive Flipbook
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input placeholder="Search for parts..." className="pl-10" />
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter by Stock</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Parts by Brand */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="bmw" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
              <TabsTrigger value="bmw" className="flex items-center space-x-2">
                <Car className="w-4 h-4" />
                <span>BMW</span>
              </TabsTrigger>
              <TabsTrigger value="mercedes" className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>Mercedes</span>
              </TabsTrigger>
              <TabsTrigger value="audi" className="flex items-center space-x-2">
                <Car className="w-4 h-4" />
                <span>Audi</span>
              </TabsTrigger>
              <TabsTrigger value="hilux" className="flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span>Hilux</span>
              </TabsTrigger>
              <TabsTrigger value="ranger" className="flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span>Ranger</span>
              </TabsTrigger>
              <TabsTrigger value="navara" className="flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span>Navara</span>
              </TabsTrigger>
            </TabsList>

            {Object.entries(partsByBrand).map(([brand, parts]) => (
              <TabsContent key={brand} value={brand}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {parts.map((part, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-montserrat">{part.name}</CardTitle>
                          <Badge
                            variant={part.stock === "In Stock" ? "default" : "secondary"}
                            className={part.stock === "In Stock" ? "bg-green-100 text-green-800" : ""}
                          >
                            {part.stock}
                          </Badge>
                        </div>
                        <CardDescription>{part.compatibility}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-[#D72638]">{part.price}</span>
                        </div>
                        <Button
                          className="w-full bg-[#D72638] hover:bg-[#B91C2C]"
                          onClick={() =>
                            window.open(
                              `https://wa.me/23057123456?text=Hi! I need a quote for ${part.name} for ${brand.toUpperCase()}`,
                              "_blank",
                            )
                          }
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Order on WhatsApp
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Part Not Listed Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-montserrat">Can't Find Your Part?</h2>
            <p className="text-xl text-gray-600 mb-8">
              We have access to thousands more parts. Send us your requirements and we'll source it for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#D72638] hover:bg-[#B91C2C]"
                onClick={() =>
                  window.open(
                    "https://wa.me/23057123456?text=Hi! I'm looking for a part that's not in your catalog:%0A%0ACar: %0AYear: %0APart needed: %0AAdditional details: ",
                    "_blank",
                  )
                }
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Request Custom Part
              </Button>
              <Button size="lg" variant="outline" className="border-[#D72638] text-[#D72638]">
                <FileText className="w-5 h-5 mr-2" />
                Email Part Request
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
