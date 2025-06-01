"use client"

import { Button } from "@/components/ui/button"
import { Phone, MessageCircle, MapPin, Clock, Mail, Car } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#D72638] rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-montserrat">A.M.O Distribution</h3>
                <p className="text-gray-400 text-sm">Quality Spare Parts</p>
              </div>
            </div>
            <p className="text-gray-400">
              Your trusted partner for genuine spare parts in Mauritius since 2010. Specializing in German cars and 4x4
              vehicles.
            </p>
            <div className="flex space-x-3">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => window.open("https://wa.me/23057123456?text=Hi! I need help with spare parts", "_blank")}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                WhatsApp
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                onClick={() => window.open("tel:+23057123456", "_self")}
              >
                <Phone className="w-4 h-4 mr-1" />
                Call
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-montserrat">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/catalog" className="block text-gray-400 hover:text-white transition-colors">
                Parts Catalog
              </Link>
              <Link href="/quote" className="block text-gray-400 hover:text-white transition-colors">
                Request Quote
              </Link>
              <Link href="/partner" className="block text-gray-400 hover:text-white transition-colors">
                Become Partner
              </Link>
              <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-montserrat">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#D72638]" />
                <span>+230 5712-3456</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <span>WhatsApp: +230 5712-3456</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#D72638]" />
                <span>amodistribution.mu@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Location & Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-montserrat">Visit Our Store</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#D72638] mt-1" />
                <div>
                  <p>123 Royal Road</p>
                  <p>Port Louis, Mauritius</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-[#D72638] mt-1" />
                <div>
                  <p>Monday - Saturday</p>
                  <p className="text-sm text-gray-400">9:00 AM - 5:00 PM</p>
                  <p className="text-sm text-red-400">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left">
              © 2024 A.M.O Distribution Ltd. All rights reserved. | Proudly serving Mauritius since 2010
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>🇲🇺 Made in Mauritius</span>
              <span>•</span>
              <span>Trusted by 500+ customers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
