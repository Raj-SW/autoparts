"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Mic, Search, Eye, Zap, Sparkles, ChevronDown, ChevronUp, MessageCircle } from "lucide-react"

export default function SmartFeatures() {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!isExpanded) {
    return (
      <section className="py-8 bg-gradient-to-r from-purple-50 to-blue-50 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">🚀 Discover Our Premium Tools</h3>
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-gray-600 mb-4">
              Advanced features to make finding parts even easier (completely optional!)
            </p>
            <Button onClick={() => setIsExpanded(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
              <ChevronDown className="w-4 h-4 mr-2" />
              Explore Premium Features
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronUp className="w-4 h-4 mr-1" />
              Hide Premium Features
            </Button>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
            🚀 Premium Tools (Optional Bonus Features)
          </h2>
          <p className="text-xl text-gray-600">
            Advanced technology to make your experience even better - use them if you want!
          </p>
          <Badge className="bg-purple-100 text-purple-800 mt-2">100% Optional - Traditional methods still work!</Badge>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Photo Search */}
            <Card className="bg-white border-2 border-green-200 hover:shadow-lg transition-all">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">📸 Photo Search</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600 text-sm">
                  Take a photo of your part and get instant identification. No more guessing!
                </p>
                <div className="bg-green-50 p-2 rounded text-xs">
                  <span className="text-green-800 font-semibold">99% accuracy rate</span>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() =>
                    window.open("https://wa.me/23057123456?text=📸 I want to try the photo search feature!", "_blank")
                  }
                >
                  Try Photo Search
                </Button>
              </CardContent>
            </Card>

            {/* Voice Search */}
            <Card className="bg-white border-2 border-blue-200 hover:shadow-lg transition-all">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">🎤 Voice Search</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600 text-sm">Just speak what you need. Works in English, French, and Creole!</p>
                <div className="bg-blue-50 p-2 rounded text-xs">
                  <span className="text-blue-800 font-semibold">3 languages supported</span>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.open("https://wa.me/23057123456?text=🎤 I want to try voice search!", "_blank")}
                >
                  Try Voice Search
                </Button>
              </CardContent>
            </Card>

            {/* Smart Search */}
            <Card className="bg-white border-2 border-purple-200 hover:shadow-lg transition-all">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg">🔍 Smart Search</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600 text-sm">
                  Intelligent search that understands what you mean, even with typos!
                </p>
                <div className="bg-purple-50 p-2 rounded text-xs">
                  <span className="text-purple-800 font-semibold">Instant suggestions</span>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() =>
                    window.open("https://wa.me/23057123456?text=🔍 I want to try the smart search!", "_blank")
                  }
                >
                  Try Smart Search
                </Button>
              </CardContent>
            </Card>

            {/* 3D Preview */}
            <Card className="bg-white border-2 border-orange-200 hover:shadow-lg transition-all">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-lg">👁️ 3D Preview</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600 text-sm">
                  See exactly how parts look and fit before you buy. Revolutionary technology!
                </p>
                <div className="bg-orange-50 p-2 rounded text-xs">
                  <span className="text-orange-800 font-semibold">World's first in Mauritius</span>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  onClick={() =>
                    window.open("https://wa.me/23057123456?text=👁️ I want to see the 3D preview feature!", "_blank")
                  }
                >
                  Try 3D Preview
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Section */}
          <div className="mt-12 text-center">
            <Card className="bg-white border-2 border-gray-200 max-w-4xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  💡 Why Use Premium Features? (Completely Optional!)
                </h3>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Faster part identification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">No typing required</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">99% accuracy guarantee</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">See before you buy</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-red-600" />
                      <span className="text-sm">Works on any phone</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-teal-600" />
                      <span className="text-sm">Available 24/7</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Don't worry!</strong> You can still call, WhatsApp, or email us the traditional way. These
                    premium features are just bonus tools to make your life easier if you choose to use them.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <Button
                    className="bg-[#D72638] hover:bg-[#B91C2C]"
                    onClick={() =>
                      window.open("https://wa.me/23057123456?text=🚀 I want to try your premium features!", "_blank")
                    }
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Try Premium Features
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(
                        "https://wa.me/23057123456?text=I prefer the traditional way - can you help me find parts?",
                        "_blank",
                      )
                    }
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Use Traditional Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
