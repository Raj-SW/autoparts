"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, MessageCircle, MapPin, Clock, Mail, NavigationIcon, Send, CheckCircle } from "lucide-react"
import { useState } from "react"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
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
              <h1 className="text-4xl font-bold text-gray-900 mb-4 font-montserrat">Message Sent Successfully!</h1>
              <p className="text-xl text-gray-600 mb-8">
                Thank you for contacting us! We'll get back to you within 24 hours during business hours.
              </p>
              <div className="space-y-4">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() =>
                    window.open(
                      "https://wa.me/23057123456?text=Hi! I just sent a message through your contact form. Can you help me?",
                      "_blank",
                    )
                  }
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Follow up on WhatsApp
                </Button>
                <div className="text-sm text-gray-600">
                  <p>Need immediate assistance? Call us: +230 5712-3456</p>
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-montserrat">Contact Us</h1>
            <p className="text-xl text-gray-600 mb-8">
              Get in touch with A.M.O Distribution - we're here to help with all your spare parts needs
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-[#D72638]" />
                <span>Mon-Sat: 9am-5pm</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span>WhatsApp Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Options */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-green-50 border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-800 mb-2 font-montserrat">WhatsApp (Fastest)</h3>
                <p className="text-green-700 mb-4">Get instant response for quotes and inquiries</p>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={() =>
                    window.open("https://wa.me/23057123456?text=Hi! I need help with spare parts", "_blank")
                  }
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat on WhatsApp
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-blue-800 mb-2 font-montserrat">Call Us</h3>
                <p className="text-blue-700 mb-4">Speak directly with our parts experts</p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                  onClick={() => window.open("tel:+23057123456", "_self")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +230 5712-3456
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Mail className="w-12 h-12 text-[#D72638] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#D72638] mb-2 font-montserrat">Email Us</h3>
                <p className="text-red-700 mb-4">Send detailed inquiries and documents</p>
                <Button
                  className="bg-[#D72638] hover:bg-[#B91C2C] text-white w-full"
                  onClick={() => window.open("mailto:amodistribution.mu@gmail.com", "_self")}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 font-montserrat">Get in Touch</h2>
                <p className="text-xl text-gray-600 mb-8">
                  Visit our store, call us, or send a message. We're always ready to help you find the right parts.
                </p>
              </div>

              {/* Store Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 font-montserrat">
                    <MapPin className="w-6 h-6 text-[#D72638]" />
                    <span>Visit Our Store</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">A.M.O Distribution Ltd</h4>
                    <p className="text-gray-600">
                      123 Royal Road
                      <br />
                      Port Louis, Mauritius
                      <br />
                      (Near Immigration Square)
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-[#D72638] text-[#D72638] hover:bg-[#D72638] hover:text-white"
                    onClick={() => window.open("https://maps.google.com/?q=Port+Louis+Mauritius+Royal+Road", "_blank")}
                  >
                    <NavigationIcon className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 font-montserrat">
                    <Clock className="w-6 h-6 text-[#D72638]" />
                    <span>Business Hours</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="font-semibold">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-semibold">9:00 AM - 1:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday</span>
                      <span className="text-red-600">Closed</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      <strong>WhatsApp available 24/7</strong> - We'll respond during business hours
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-montserrat">Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-[#D72638]" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-gray-600">+230 5712-3456</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">WhatsApp</p>
                      <p className="text-gray-600">+230 5712-3456</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-[#D72638]" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-600">amodistribution.mu@gmail.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 font-montserrat">
                    <Send className="w-6 h-6 text-[#D72638]" />
                    <span>Send us a Message</span>
                  </CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you within 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" placeholder="Your first name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" placeholder="Your last name" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="your.email@example.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+230 5xxx-xxxx" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input id="subject" placeholder="What is your message about?" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us how we can help you..."
                        className="min-h-[120px]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="carInfo">Car Information (Optional)</Label>
                      <Input id="carInfo" placeholder="e.g., BMW 3 Series 2018, Toyota Hilux 2020" />
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-[#D72638] hover:bg-[#B91C2C]">
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>

                    <p className="text-sm text-gray-600 text-center">
                      For urgent inquiries, please call us or use WhatsApp for faster response
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Optional) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-montserrat">Find Us on the Map</h2>
            <p className="text-xl text-gray-600">Located in the heart of Port Louis for easy access</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Interactive map would be embedded here</p>
                <Button
                  variant="outline"
                  onClick={() => window.open("https://maps.google.com/?q=Port+Louis+Mauritius+Royal+Road", "_blank")}
                >
                  <NavigationIcon className="w-4 h-4 mr-2" />
                  Open in Google Maps
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
