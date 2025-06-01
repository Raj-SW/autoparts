"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react"

const inventoryData = [
  {
    name: "BMW Brake Pads",
    stock: 15,
    trend: "up",
    demand: "high",
    price: "Rs 2,500",
    lastSold: "2 min ago",
    predictedSellout: "6 hours",
  },
  {
    name: "Mercedes Oil Filter",
    stock: 8,
    trend: "down",
    demand: "medium",
    price: "Rs 950",
    lastSold: "15 min ago",
    predictedSellout: "2 days",
  },
  {
    name: "Hilux Shock Absorbers",
    stock: 3,
    trend: "down",
    demand: "critical",
    price: "Rs 3,200",
    lastSold: "5 min ago",
    predictedSellout: "3 hours",
  },
  {
    name: "Audi Air Filter",
    stock: 12,
    trend: "up",
    demand: "low",
    price: "Rs 1,200",
    lastSold: "1 hour ago",
    predictedSellout: "1 week",
  },
]

export default function LiveInventory() {
  const [inventory, setInventory] = useState(inventoryData)

  useEffect(() => {
    // Simulate real-time inventory updates
    const timer = setInterval(() => {
      setInventory((prev) =>
        prev.map((item) => ({
          ...item,
          stock: Math.max(0, item.stock + (Math.random() > 0.7 ? -1 : 0)),
        })),
      )
    }, 10000)

    return () => clearInterval(timer)
  }, [])

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock <= 3) return { color: "text-red-600", icon: AlertTriangle, status: "Low Stock" }
    if (stock <= 8) return { color: "text-orange-600", icon: Clock, status: "Medium Stock" }
    return { color: "text-green-600", icon: CheckCircle, status: "In Stock" }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
            📊 Live AI Inventory Tracker
          </h2>
          <p className="text-xl text-gray-600">
            Real-time stock levels with AI-powered demand prediction. See what's selling fast!
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">AI Predictions</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {inventory.map((item, index) => {
            const stockStatus = getStockStatus(item.stock)
            const StockIcon = stockStatus.icon

            return (
              <Card
                key={index}
                className={`hover:shadow-lg transition-all border-2 ${
                  item.stock <= 3 ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    {item.trend === "up" ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getDemandColor(item.demand)}>{item.demand.toUpperCase()} DEMAND</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#D72638]">{item.price}</span>
                    <div className={`flex items-center space-x-1 ${stockStatus.color}`}>
                      <StockIcon className="w-4 h-4" />
                      <span className="font-semibold text-sm">{item.stock} left</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last sold:</span>
                      <span className="font-semibold">{item.lastSold}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">AI predicts sellout:</span>
                      <span className="font-semibold text-orange-600">{item.predictedSellout}</span>
                    </div>
                  </div>

                  {item.stock <= 3 && (
                    <div className="bg-red-100 border border-red-300 rounded p-2 text-center">
                      <span className="text-red-800 font-bold text-sm">⚠️ URGENT: Only {item.stock} left!</span>
                    </div>
                  )}

                  <Button
                    className={`w-full font-bold ${
                      item.stock <= 3 ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-[#D72638] hover:bg-[#B91C2C]"
                    }`}
                    onClick={() =>
                      window.open(
                        `https://wa.me/23057123456?text=🚨 I want to order ${item.name} - ${item.price} (${item.stock} left!)`,
                        "_blank",
                      )
                    }
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {item.stock <= 3 ? "🔥 GRAB NOW!" : "Quick Order"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-blue-800 mb-2">🤖 AI Inventory Insights</h3>
            <p className="text-blue-700 mb-4">
              Our AI analyzes buying patterns, seasonal trends, and market demand to predict stock levels and optimize
              pricing.
            </p>
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              onClick={() =>
                window.open(
                  "https://wa.me/23057123456?text=🤖 I want to know more about your AI inventory predictions!",
                  "_blank",
                )
              }
            >
              📊 Learn More About AI Predictions
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
