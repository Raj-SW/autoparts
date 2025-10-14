'use client';

import { memo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Phone, Star, Timer, CheckCircle } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

/**
 * Hero section component for homepage
 */
export const HeroSection = memo(function HeroSection() {
  const handleWhatsAppClick = () => {
    window.open(
      `https://wa.me/${CONTACT_INFO.WHATSAPP}?text=🚗 URGENT: I need spare parts quote NOW! My car: `,
      '_blank'
    );
  };

  const handlePhoneClick = () => {
    window.open(`tel:${CONTACT_INFO.PHONE}`, '_self');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 py-12 md:py-20 lg:py-24">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-red-50 opacity-30" />
      
      <div className="container relative mx-auto px-4">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Content */}
          <div className="space-y-4 md:space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="animate-pulse bg-[#D72638] text-white hover:bg-[#B91C2C]">
                🇲🇺 #1 in Mauritius
              </Badge>
              <Badge className="bg-green-600 text-white">
                ✅ Trusted by 500+ Customers
              </Badge>
              <Badge className="bg-blue-600 text-white">
                ⚡ 1-Hour Quotes
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl xl:text-6xl">
              <span className="text-[#D72638]">Stop Waiting Weeks</span> for Car Parts!
              <br />
              <span className="text-xl text-gray-700 md:text-2xl lg:text-3xl xl:text-4xl">
                Get Genuine Parts in 1 Hour ⚡
              </span>
            </h1>

            {/* Warning Banner */}
            <div className="rounded border-l-4 border-yellow-500 bg-yellow-100 p-3 md:p-4">
              <p className="text-sm font-semibold text-yellow-800 md:text-base lg:text-lg">
                ⚠️ Don't let your car sit broken for days! Other suppliers take 1-2 weeks. We deliver TODAY.
              </p>
            </div>

            {/* Description */}
            <p className="text-base text-gray-600 md:text-lg lg:text-xl">
              <strong>Mauritius' FASTEST spare parts service.</strong> BMW, Audi, Mercedes & 4x4 parts with
              <span className="font-bold text-[#D72638]"> guaranteed fitment</span> or your money back!
            </p>

            {/* Features Box */}
            <div className="rounded-lg border-2 border-[#D72638] bg-white p-4 shadow-lg md:p-6">
              <h3 className="mb-3 text-base font-bold text-gray-900 md:text-lg">
                🎯 Why 500+ Mauritians Choose Us:
              </h3>
              <div className="grid gap-2 text-sm sm:grid-cols-2 md:gap-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>1-hour quotes (not days)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>Same-day delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>30% cheaper than dealers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>100% genuine parts</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button
                size="lg"
                className="animate-pulse bg-[#D72638] px-6 py-4 text-base font-semibold text-white shadow-lg hover:bg-[#B91C2C] md:px-8 md:text-lg"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                🔥 GET INSTANT QUOTE (FREE)
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#D72638] px-6 py-4 text-base text-[#D72638] hover:bg-[#D72638] hover:text-white md:px-8 md:text-lg"
                onClick={handlePhoneClick}
              >
                <Phone className="mr-2 h-5 w-5" />
                📞 Call NOW: 5712-3456
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs md:gap-6 md:text-sm">
              <div className="flex items-center space-x-2">
                <Timer className="h-4 w-4 text-[#D72638] md:h-5 md:w-5" />
                <span className="font-semibold">Average response: 12 minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 md:h-5 md:w-5" />
                <span className="font-semibold">4.9/5 rating (500+ reviews)</span>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative rounded-2xl bg-white p-4 shadow-2xl md:p-8">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Premium car parts and accessories"
                width={500}
                height={400}
                className="h-auto w-full rounded-lg"
                priority
              />
              <div className="absolute -right-2 -top-2 animate-bounce rounded-full bg-[#D72638] px-3 py-1 text-xs font-semibold text-white md:-right-4 md:-top-4 md:px-4 md:py-2 md:text-sm">
                ⚡ 1 Hour Delivery
              </div>
              <div className="absolute -bottom-2 -left-2 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white md:-bottom-4 md:-left-4 md:px-4 md:py-2 md:text-sm">
                💰 30% Cheaper
              </div>
            </div>

            {/* Floating testimonial */}
            <div className="absolute -bottom-4 right-2 max-w-[200px] rounded-lg bg-white p-3 shadow-lg md:-bottom-6 md:right-4 md:max-w-xs md:p-4">
              <div className="mb-2 flex items-center space-x-2">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Customer"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="text-xs font-semibold md:text-sm">Raj P.</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-2 w-2 fill-yellow-400 text-yellow-400 md:h-3 md:w-3" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600">"Got my BMW parts in 2 hours! Amazing service!"</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

