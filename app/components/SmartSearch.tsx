"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Camera, Mic, Bot, Sparkles, Zap } from "lucide-react"

export default function SmartSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

  const handleVoiceSearch = () => {
    setIsListening(true)
    // Simulate voice recognition
    setTimeout(() => {
      setSearchQuery("BMW brake pads 2020")
      setIsListening(false)
      handleSearch("BMW brake pads 2020")
    }, 2000)
  }

  const handlePhotoSearch = () => {
    // Simulate photo upload and AI recognition
    setSearchQuery("Analyzing photo...")
    setTimeout(() => {
      setSearchQuery("Mercedes oil filter W204")
      handleSearch("Mercedes oil filter W204")
    }, 3000)
  }

  const handleSearch = (query: string) => {
    // Simulate AI search results
    const mockResults = [
      {
        name: "BMW Brake Pads (Front)",
        price: "Rs 2,500",
        compatibility: "3 Series, 5 Series, X3",
        confidence: "99%",
        inStock: true,
      },
      {
        name: "BMW Brake Discs (Pair)",
        price: "Rs 4,800",
        compatibility: "3 Series, 5 Series",
        confidence: "95%",
        inStock: true,
      },
    ]
    setSearchResults(mockResults)
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat flex items-center justify-center">
              <Bot className="w-8 h-8 mr-3 text-purple-600" />🔍 AI-Powered Smart Search
            </h2>
            <p className="text-xl text-gray-600">
              Find your parts in seconds using photo, voice, or text. Our AI understands what you need!
            </p>
          </div>

          <Card className="bg-white shadow-xl border-2 border-purple-200">
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Type your car model and part needed... (e.g., BMW 3 Series brake pads)"
                    className="pl-10 pr-4 py-4 text-lg border-2 border-purple-200 focus:border-purple-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                  />
                </div>

                {/* AI Search Options */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white p-6 h-auto flex-col space-y-2"
                    onClick={handlePhotoSearch}
                  >
                    <Camera className="w-8 h-8" />
                    <span className="font-bold">📸 Photo Search</span>
                    <span className="text-sm opacity-90">Take a photo, get instant ID</span>
                  </Button>

                  <Button
                    className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-6 h-auto flex-col space-y-2 ${
                      isListening ? "animate-pulse" : ""
                    }`}
                    onClick={handleVoiceSearch}
                  >
                    <Mic className="w-8 h-8" />
                    <span className="font-bold">🎤 Voice Search</span>
                    <span className="text-sm opacity-90">{isListening ? "Listening..." : "Speak your needs"}</span>
                  </Button>

                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-6 h-auto flex-col space-y-2"
                    onClick={() =>
                      window.open(
                        "https://wa.me/23057123456?text=🤖 Hi AI Assistant! Help me find parts for my car",
                        "_blank",
                      )
                    }
                  >
                    <Bot className="w-8 h-8" />
                    <span className="font-bold">🤖 AI Assistant</span>
                    <span className="text-sm opacity-90">Chat with our AI</span>
                  </Button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                      AI Search Results
                    </h3>
                    {searchResults.map((result, index) => (
                      <Card key={index} className="border border-purple-200 hover:shadow-lg transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-lg">{result.name}</h4>
                              <p className="text-gray-600">{result.compatibility}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-green-600 font-semibold">✅ {result.confidence} AI Match</span>
                                <span className="text-blue-600 font-semibold">📦 In Stock</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-[#D72638]">{result.price}</div>
                              <Button
                                className="mt-2 bg-[#D72638] hover:bg-[#B91C2C]"
                                onClick={() =>
                                  window.open(
                                    `https://wa.me/23057123456?text=🤖 AI found this part: ${result.name} - ${result.price}`,
                                    "_blank",
                                  )
                                }
                              >
                                <Zap className="w-4 h-4 mr-1" />
                                Quick Order
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Quick Search Suggestions */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">🔥 Popular AI Searches:</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "BMW brake pads",
                      "Mercedes oil filter",
                      "Hilux shock absorbers",
                      "Audi air filter",
                      "Ford Ranger clutch",
                    ].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        className="text-sm"
                        onClick={() => {
                          setSearchQuery(suggestion)
                          handleSearch(suggestion)
                        }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
