"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Smartphone, Zap, Play, Camera, Sparkles } from "lucide-react"

export default function ARViewer() {
  const [showARDemo, setShowARDemo] = useState(false)

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
            👁️ Revolutionary AR Part Preview
          </h2>
          <p className="text-xl text-gray-600">
            World's first AR technology for spare parts! See exactly how parts fit before you buy.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">3D Visualization</span>
            </div>
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Mobile Compatible</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-pink-600" />
              <span className="text-sm text-gray-600">Industry First</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* AR Demo */}
            <div className="relative">
              <Card className="bg-white shadow-xl border-2 border-purple-300 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                <CardContent className="p-8">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {!showARDemo ? (
                      <div className="text-center">
                        <Eye className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                        <h3 className="text-xl font-bold text-purple-800 mb-2">AR Part Preview</h3>
                        <p className="text-purple-600 mb-4">See parts in 3D before you buy</p>
                        <Button
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() => setShowARDemo(true)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start AR Demo
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-purple-600">Loading AR Experience...</p>
                        <div className="mt-4 space-y-2">
                          <div className="bg-white bg-opacity-50 p-2 rounded">
                            <span className="text-sm text-purple-800">🔍 Scanning environment...</span>
                          </div>
                          <div className="bg-white bg-opacity-50 p-2 rounded">
                            <span className="text-sm text-purple-800">📱 Initializing AR camera...</span>
                          </div>
                          <div className="bg-white bg-opacity-50 p-2 rounded">
                            <span className="text-sm text-purple-800">🎯 Placing 3D model...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Floating AR Features */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-semibold animate-bounce">
                🌟 World First
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-semibold">
                👁️ AR Powered
              </div>
            </div>

            {/* AR Features */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-purple-600" />🚀 Revolutionary AR Features:
              </h3>

              <div className="space-y-4">
                <Card className="bg-white border-2 border-purple-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Eye className="w-6 h-6 text-purple-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-purple-800">3D Part Visualization</h4>
                        <p className="text-gray-600">See exact part dimensions and details in 3D space</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-2 border-blue-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Zap className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-blue-800">Perfect Fit Verification</h4>
                        <p className="text-gray-600">AR confirms compatibility with your specific car model</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-2 border-green-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Camera className="w-6 h-6 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-800">Installation Preview</h4>
                        <p className="text-gray-600">See exactly where and how the part fits in your car</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-2 border-orange-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Smartphone className="w-6 h-6 text-orange-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-orange-800">Mobile AR Experience</h4>
                        <p className="text-gray-600">Works on any smartphone - no special equipment needed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg border-2 border-purple-300">
                <h4 className="font-bold text-purple-800 mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />🎯 Why AR Changes Everything:
                </h4>
                <ul className="space-y-2 text-purple-700">
                  <li>✅ 100% confidence in part compatibility</li>
                  <li>✅ No more wrong part orders</li>
                  <li>✅ See quality before you buy</li>
                  <li>✅ Understand installation process</li>
                  <li>✅ Share AR view with your mechanic</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold"
                  onClick={() =>
                    window.open(
                      "https://wa.me/23057123456?text=👁️ I want to try the AR part preview! This sounds amazing!",
                      "_blank",
                    )
                  }
                >
                  <Eye className="w-5 h-5 mr-2" />🚀 Try AR Now (FREE)
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-bold"
                  onClick={() => setShowARDemo(!showARDemo)}
                >
                  <Play className="w-5 h-5 mr-2" />📱 Watch AR Demo
                </Button>
              </div>
            </div>
          </div>

          {/* AR Success Stories */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">🎉 AR Success Stories</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white border-2 border-purple-200">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Raj from Port Louis</h4>
                  <p className="text-gray-600 text-sm">
                    "AR showed me exactly how the brake pads fit. No guesswork! Ordered with 100% confidence."
                  </p>
                  <div className="mt-3 text-green-600 font-semibold">Saved Rs 2,000</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Sarah from Curepipe</h4>
                  <p className="text-gray-600 text-sm">
                    "Shared AR view with my mechanic via WhatsApp. He confirmed perfect fit before ordering!"
                  </p>
                  <div className="mt-3 text-green-600 font-semibold">Avoided wrong part</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Ahmed from Rose Hill</h4>
                  <p className="text-gray-600 text-sm">
                    "AR preview helped me understand the installation. Did it myself and saved on labor costs!"
                  </p>
                  <div className="mt-3 text-green-600 font-semibold">Saved Rs 1,500</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
