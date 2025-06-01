"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageCircle, FileText, Clock, CheckCircle } from "lucide-react"
import { useState } from "react"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"

export default function QuotePage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    make: "",
    model: "",
    year: "",
    engine: "",
    parts: "",
    urgency: "",
    location: "",
    comments: "",
    delivery: false,
    installation: false,
    warranty: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 font-montserrat">Quote Request Submitted!</h1>
              <p className="text-xl text-gray-600 mb-8">
                Thank you! We've received your quote request and will get back to you within 1 hour during business
                hours.
              </p>
              <div className="space-y-4">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() =>
                    window.open(
                      "https://wa.me/23057123456?text=Hi! I just submitted a quote request form. Can you help me with the status?",
                      "_blank",
                    )
                  }
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Follow up on WhatsApp
                </Button>
                <div className="text-sm text-gray-600">
                  <p>Or call us directly: +230 5712-3456</p>
                  <p>Email: amodistribution.mu@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-montserrat">Request a Quote</h1>
            <p className="text-xl text-gray-600 mb-8">
              Fill out the form below and we'll get back to you with the best price within 1 hour
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-[#D72638]" />
                <span>1 Hour Response</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Best Prices Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick WhatsApp Option */}
      <section className="py-8 bg-green-50 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <MessageCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-800 font-montserrat">Need a Quote Faster?</h3>
                      <p className="text-green-700">Get instant response via WhatsApp - usually within 15 minutes!</p>
                    </div>
                  </div>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() =>
                      window.open(
                        "https://wa.me/23057123456?text=Hi! I need a quick quote for spare parts:%0A%0ACar Make & Model: %0AYear: %0APart needed: %0ALocation: ",
                        "_blank",
                      )
                    }
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-montserrat">
                  <FileText className="w-6 h-6 text-[#D72638]" />
                  <span>Detailed Quote Request</span>
                </CardTitle>
                <CardDescription>Please provide as much detail as possible for an accurate quote</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="+230 5xxx-xxxx"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Vehicle Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold font-montserrat">Vehicle Information</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="make">Car Make *</Label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D72638]"
                          value={formData.make}
                          onChange={(e) => handleSelectChange("make", e.target.value)}
                          required
                        >
                          <option value="">Select make</option>
                          <option value="bmw">BMW</option>
                          <option value="mercedes">Mercedes-Benz</option>
                          <option value="audi">Audi</option>
                          <option value="toyota">Toyota</option>
                          <option value="ford">Ford</option>
                          <option value="nissan">Nissan</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="model">Model *</Label>
                        <Input
                          id="model"
                          placeholder="e.g., 3 Series, Hilux, Ranger"
                          required
                          value={formData.model}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">Year *</Label>
                        <Input
                          id="year"
                          placeholder="e.g., 2018"
                          required
                          value={formData.year}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="engine">Engine Size / Type (if known)</Label>
                      <Input
                        id="engine"
                        placeholder="e.g., 2.0L Diesel, 3.0L Petrol"
                        value={formData.engine}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Parts Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold font-montserrat">Parts Required</h3>
                    <div className="space-y-2">
                      <Label htmlFor="parts">Describe the parts you need *</Label>
                      <Textarea
                        id="parts"
                        placeholder="Please describe the parts you need, including any part numbers if available..."
                        className="min-h-[120px]"
                        required
                        value={formData.parts}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="urgency">How urgent is this request?</Label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D72638]"
                        value={formData.urgency}
                        onChange={(e) => handleSelectChange("urgency", e.target.value)}
                      >
                        <option value="">Select urgency</option>
                        <option value="urgent">Urgent - Need today</option>
                        <option value="soon">Soon - Within 2-3 days</option>
                        <option value="normal">Normal - Within a week</option>
                        <option value="planning">Just planning ahead</option>
                      </select>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Your Location in Mauritius *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Port Louis, Quatre Bornes, Curepipe"
                      required
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Additional Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold font-montserrat">Additional Options</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="delivery"
                          checked={formData.delivery}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-[#D72638] border-gray-300 rounded focus:ring-[#D72638]"
                        />
                        <Label htmlFor="delivery">I need delivery service</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="installation"
                          checked={formData.installation}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-[#D72638] border-gray-300 rounded focus:ring-[#D72638]"
                        />
                        <Label htmlFor="installation">I need installation/fitting service</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="warranty"
                          checked={formData.warranty}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-[#D72638] border-gray-300 rounded focus:ring-[#D72638]"
                        />
                        <Label htmlFor="warranty">I want extended warranty information</Label>
                      </div>
                    </div>
                  </div>

                  {/* Additional Comments */}
                  <div className="space-y-2">
                    <Label htmlFor="comments">Additional Comments</Label>
                    <Textarea
                      id="comments"
                      placeholder="Any additional information that might help us provide a better quote..."
                      className="min-h-[80px]"
                      value={formData.comments}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full bg-[#D72638] hover:bg-[#B91C2C] text-lg py-4">
                      <FileText className="w-5 h-5 mr-2" />
                      Submit Quote Request
                    </Button>
                    <p className="text-sm text-gray-600 text-center mt-3">
                      We'll respond within 1 hour during business hours (Mon-Sat, 9am-5pm)
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
