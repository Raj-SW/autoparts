"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, MessageCircle, Zap, Brain, Sparkles, Send, Mic, Camera } from "lucide-react"

export default function AIAssistant() {
  const [chatMessages, setChatMessages] = useState([
    {
      type: "ai",
      message:
        "👋 Hi! I'm your AI spare parts assistant. I can help you find parts using photos, voice, or text. What do you need?",
      time: "Just now",
    },
  ])
  const [userInput, setUserInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = () => {
    if (!userInput.trim()) return

    // Add user message
    const newUserMessage = {
      type: "user",
      message: userInput,
      time: "Just now",
    }

    setChatMessages((prev) => [...prev, newUserMessage])
    setUserInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: "ai",
        message:
          "🤖 I understand you need help with spare parts! Let me analyze your request and find the best options for you. Would you like to share a photo of the part or tell me your car model?",
        time: "Just now",
      }
      setChatMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
            🤖 Meet Your AI Spare Parts Assistant
          </h2>
          <p className="text-xl text-gray-600">
            Available 24/7 on WhatsApp and our website. Understands 3 languages and never sleeps!
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Online Now</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-600">AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">Multi-Language</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* AI Chat Demo */}
            <Card className="bg-white shadow-xl border-2 border-blue-300">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="w-6 h-6" />
                  <span>AI Assistant Demo</span>
                  <div className="ml-auto flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Online</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Chat Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Camera className="w-4 h-4 mr-1" />
                      Photo
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Mic className="w-4 h-4 mr-1" />
                      Voice
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Capabilities */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-purple-600" />🧠 AI Superpowers:
              </h3>

              <div className="space-y-4">
                <Card className="bg-white border-2 border-green-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Camera className="w-6 h-6 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-800">📸 Photo Recognition</h4>
                        <p className="text-gray-600">
                          Send a photo, get instant part identification with 99.2% accuracy
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-2 border-blue-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Mic className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-blue-800">🎤 Voice Understanding</h4>
                        <p className="text-gray-600">Speak in English, French, or Creole - AI understands all</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-2 border-purple-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Brain className="w-6 h-6 text-purple-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-purple-800">🧠 Smart Recommendations</h4>
                        <p className="text-gray-600">AI suggests compatible parts and maintenance schedules</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-2 border-orange-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Zap className="w-6 h-6 text-orange-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-orange-800">⚡ Instant Quotes</h4>
                        <p className="text-gray-600">
                          Generate detailed PDF quotes in 60 seconds with pricing and delivery
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-2 border-red-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <MessageCircle className="w-6 h-6 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-red-800">💬 24/7 Availability</h4>
                        <p className="text-gray-600">Never sleeps, always ready to help with your spare parts needs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-lg border-2 border-blue-300">
                <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                  <Bot className="w-5 h-5 mr-2" />🎯 Why Our AI is Different:
                </h4>
                <ul className="space-y-2 text-blue-700">
                  <li>✅ Trained on 50,000+ car parts database</li>
                  <li>✅ Learns from every interaction</li>
                  <li>✅ Connects to live inventory system</li>
                  <li>✅ Understands Mauritian car market</li>
                  <li>✅ Integrates with WhatsApp seamlessly</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold"
                  onClick={() =>
                    window.open(
                      "https://wa.me/23057123456?text=🤖 Hi AI Assistant! I want to experience your superpowers. Help me find spare parts!",
                      "_blank",
                    )
                  }
                >
                  <MessageCircle className="w-5 h-5 mr-2" />💬 Chat with AI Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-bold"
                  onClick={() => {
                    const demoMessage = {
                      type: "user",
                      message: "I need brake pads for my BMW 3 Series 2018",
                      time: "Just now",
                    }
                    setChatMessages((prev) => [...prev, demoMessage])
                    setIsTyping(true)
                    setTimeout(() => {
                      const aiResponse = {
                        type: "ai",
                        message:
                          "🎯 Perfect! I found BMW brake pads for 3 Series 2018. Front pads: Rs 2,500 (OEM quality), Rear pads: Rs 2,200. Both in stock with same-day delivery. Would you like me to generate a quote PDF?",
                        time: "Just now",
                      }
                      setChatMessages((prev) => [...prev, aiResponse])
                      setIsTyping(false)
                    }, 2000)
                  }}
                >
                  <Bot className="w-5 h-5 mr-2" />🚀 Try Demo
                </Button>
              </div>
            </div>
          </div>

          {/* AI Statistics */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">📊 AI Performance Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white p-6 rounded-lg border-2 border-green-200">
                <div className="text-3xl font-bold text-green-600">99.2%</div>
                <div className="text-green-800 font-semibold">Accuracy Rate</div>
              </div>
              <div className="bg-white p-6 rounded-lg border-2 border-blue-200">
                <div className="text-3xl font-bold text-blue-600">12 Sec</div>
                <div className="text-blue-800 font-semibold">Avg Response</div>
              </div>
              <div className="bg-white p-6 rounded-lg border-2 border-purple-200">
                <div className="text-3xl font-bold text-purple-600">24/7</div>
                <div className="text-purple-800 font-semibold">Availability</div>
              </div>
              <div className="bg-white p-6 rounded-lg border-2 border-orange-200">
                <div className="text-3xl font-bold text-orange-600">3</div>
                <div className="text-orange-800 font-semibold">Languages</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
