'use client';

import { memo, useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Quote, Star } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/constants';

/**
 * Testimonials carousel component with auto-rotation
 */
export const TestimonialsCarousel = memo(function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const currentTestimonial = TESTIMONIALS[currentIndex];

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
            💬 Real Stories from Real Customers
          </h2>
          <p className="text-base text-gray-600 md:text-lg lg:text-xl">
            See why 500+ Mauritians trust us with their cars
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400 md:h-6 md:w-6" />
              ))}
            </div>
            <span className="text-base font-semibold md:text-lg">4.9/5 Average Rating</span>
          </div>
        </div>

        <div className="mx-auto max-w-4xl">
          <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-xl">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col space-y-4 md:flex-row md:items-start md:space-x-6 md:space-y-0">
                <Quote className="h-10 w-10 flex-shrink-0 text-[#D72638] md:h-12 md:w-12" />
                
                <div className="flex-1">
                  <p className="mb-4 text-base italic leading-relaxed text-gray-700 md:mb-6 md:text-lg lg:text-xl">
                    "{currentTestimonial.text}"
                  </p>
                  
                  <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <Image
                        src="/placeholder.svg?height=60&width=60"
                        alt={currentTestimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full border-2 border-[#D72638]"
                      />
                      <div>
                        <div className="mb-1 flex items-center space-x-2">
                          <p className="font-bold text-gray-900">{currentTestimonial.name}</p>
                          {currentTestimonial.verified && (
                            <Badge className="bg-green-100 text-xs text-green-800">✅ Verified</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{currentTestimonial.location}</p>
                        <p className="text-xs text-gray-500">{currentTestimonial.business}</p>
                      </div>
                    </div>
                    
                    <div className="rounded-lg bg-green-100 px-3 py-2 text-center">
                      <p className="text-xs font-medium text-green-700">Saved</p>
                      <p className="text-base font-bold text-green-800 md:text-lg">
                        {currentTestimonial.savings}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Indicator dots */}
          <div className="mt-4 flex justify-center space-x-2 md:mt-6">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-8 bg-[#D72638]' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

