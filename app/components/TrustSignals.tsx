"use client"
import { Shield, Award, Users, Clock, Star, CheckCircle } from "lucide-react"

export default function TrustSignals() {
  return (
    <section className="py-8 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="font-semibold">14 Years in Business</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">500+ Happy Customers</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-purple-600" />
            <span className="font-semibold">100% Genuine Parts</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="font-semibold">Same Day Delivery</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <span className="font-semibold">4.9/5 Rating</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-semibold">Money Back Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  )
}
