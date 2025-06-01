"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingDown, Shield, Award, Zap, CheckCircle } from "lucide-react"

const priceData = [
  {
    part: "BMW Brake Pads (Front)",
    amoPrice: "Rs 2,500",
    dealerPrice: "Rs 3,500",
    competitor1: "Rs 3,200",
    competitor2: "Rs 2,800",
    savings: "Rs 1,000",
    savingsPercent: "29%",
    quality: "OEM Original",
    warranty: "2 Years",
  },
  {
    part: "Mercedes Oil Filter",
    amoPrice: "Rs 950",
    dealerPrice: "Rs 1,400",
    competitor1: "Rs 1,200",
    competitor2: "Rs 1,100",
    savings: "Rs 450",
    savingsPercent: "32%",
    quality: "OEM Original",
    warranty: "1 Year",
  },
  {
    part: "Hilux Shock Absorbers",
    amoPrice: "Rs 3,200",
    dealerPrice: "Rs 4,500",
    competitor1: "Rs 4,200",
    competitor2: "Rs 3,800",
    savings: "Rs 1,300",
    savingsPercent: "29%",
    quality: "OEM Original",
    warranty: "3 Years",
  },
]

export default function PriceComparison() {
  const [selectedPart, setSelectedPart] = useState(0)

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
            💰 Real-Time Price Comparison
          </h2>
          <p className="text-xl text-gray-600">
            We monitor 20+ competitors in real-time to guarantee you the best prices in Mauritius!
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <Badge className="bg-green-100 text-green-800">📊 Continuously Monitored</Badge>
            <Badge className="bg-blue-100 text-blue-800">📊 Real-Time Updates</Badge>
            <Badge className="bg-purple-100 text-purple-800">💎 Best Price Guarantee</Badge>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Part Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {priceData.map((item, index) => (
              <Button
                key={index}
                variant={selectedPart === index ? "default" : "outline"}
                className={selectedPart === index ? "bg-[#D72638] hover:bg-[#B91C2C]" : ""}
                onClick={() => setSelectedPart(index)}
              >
                {item.part}
              </Button>
            ))}
          </div>

          {/* Price Comparison Table */}
          <Card className="bg-white shadow-xl border-2 border-green-300">
            <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
              <CardTitle className="text-center text-xl">
                🎯 {priceData[selectedPart].part} - Price Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Supplier</th>
                      <th className="px-6 py-4 text-center font-semibold">Price</th>
                      <th className="px-6 py-4 text-center font-semibold">Quality</th>
                      <th className="px-6 py-4 text-center font-semibold">Warranty</th>
                      <th className="px-6 py-4 text-center font-semibold">Delivery</th>
                      <th className="px-6 py-4 text-center font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* A.M.O Row */}
                    <tr className="bg-green-50 border-2 border-green-300">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-[#D72638] rounded-full flex items-center justify-center">
                            <Award className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-[#D72638]">A.M.O Distribution</div>
                            <div className="text-sm text-green-600 font-semibold">🏆 BEST CHOICE</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-2xl font-bold text-[#D72638]">{priceData[selectedPart].amoPrice}</div>
                        <Badge className="bg-green-100 text-green-800 mt-1">LOWEST PRICE</Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="font-semibold">{priceData[selectedPart].quality}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold">{priceData[selectedPart].warranty}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge className="bg-blue-100 text-blue-800">Same Day</Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button
                          className="bg-[#D72638] hover:bg-[#B91C2C] font-bold"
                          onClick={() =>
                            window.open(
                              `https://wa.me/23057123456?text=🎯 I want the best price for ${priceData[selectedPart].part} - ${priceData[selectedPart].amoPrice}`,
                              "_blank",
                            )
                          }
                        >
                          <Zap className="w-4 h-4 mr-1" />
                          Order Now
                        </Button>
                      </td>
                    </tr>

                    {/* Dealer Row */}
                    <tr className="border-b">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-700">Official Dealer</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-xl font-bold text-gray-600 line-through">
                          {priceData[selectedPart].dealerPrice}
                        </div>
                        <div className="text-sm text-red-600">+{priceData[selectedPart].savingsPercent} more</div>
                      </td>
                      <td className="px-6 py-4 text-center">OEM Original</td>
                      <td className="px-6 py-4 text-center">1 Year</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="secondary">3-5 Days</Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button variant="outline" disabled>
                          Overpriced
                        </Button>
                      </td>
                    </tr>

                    {/* Competitor 1 */}
                    <tr className="border-b">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-700">Competitor A</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-xl font-bold text-gray-600 line-through">
                          {priceData[selectedPart].competitor1}
                        </div>
                        <div className="text-sm text-red-600">+22% more</div>
                      </td>
                      <td className="px-6 py-4 text-center">Aftermarket</td>
                      <td className="px-6 py-4 text-center">6 Months</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="secondary">2-3 Days</Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button variant="outline" disabled>
                          Lower Quality
                        </Button>
                      </td>
                    </tr>

                    {/* Competitor 2 */}
                    <tr className="border-b">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-700">Competitor B</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-xl font-bold text-gray-600 line-through">
                          {priceData[selectedPart].competitor2}
                        </div>
                        <div className="text-sm text-red-600">+12% more</div>
                      </td>
                      <td className="px-6 py-4 text-center">Mixed Quality</td>
                      <td className="px-6 py-4 text-center">3 Months</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="secondary">1-2 Days</Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button variant="outline" disabled>
                          Still Expensive
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Savings Summary */}
          <div className="mt-8 text-center">
            <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-300 max-w-2xl mx-auto">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <TrendingDown className="w-8 h-8 text-green-600" />
                  <div>
                    <div className="text-3xl font-bold text-green-800">Save {priceData[selectedPart].savings}</div>
                    <div className="text-lg text-green-700">
                      ({priceData[selectedPart].savingsPercent} less than dealer!)
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-600" />
                    <div className="text-sm font-semibold">Best Price</div>
                  </div>
                  <div>
                    <Shield className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                    <div className="text-sm font-semibold">OEM Quality</div>
                  </div>
                  <div>
                    <Zap className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                    <div className="text-sm font-semibold">Same Day</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Monitoring */}
          <div className="mt-8 text-center">
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 max-w-3xl mx-auto">
              <h3 className="text-lg font-bold text-purple-800 mb-2 flex items-center justify-center">
                📊 Advanced Price Monitoring System
              </h3>
              <p className="text-purple-700 mb-4">
                Our system checks competitor prices every 30 minutes and automatically adjusts our prices to ensure you
                always get the best deal. If you find a lower price elsewhere, we will beat it by 5%!
              </p>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() =>
                  window.open(
                    "https://wa.me/23057123456?text=I found a lower price elsewhere. Can you beat this price?",
                    "_blank",
                  )
                }
              >
                💰 Price Match Challenge
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
