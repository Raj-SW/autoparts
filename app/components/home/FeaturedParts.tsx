'use client';

import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { CONTACT_INFO } from '@/lib/constants';

interface FeaturedPart {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice: number;
  compatibility: string;
  stockStatus: string;
  deliveryTime: string;
  badge: string;
  badgeColor: string;
}

const FEATURED_PARTS: FeaturedPart[] = [
  {
    id: '1',
    brand: 'BMW',
    name: 'Brake Pads (Front)',
    price: 2500,
    originalPrice: 3200,
    compatibility: '3 Series, 5 Series, X3',
    stockStatus: 'In Stock',
    deliveryTime: '2hr delivery',
    badge: 'HOT SELLER',
    badgeColor: 'bg-red-600',
  },
  {
    id: '2',
    brand: 'Mercedes',
    name: 'Oil Filter',
    price: 950,
    originalPrice: 1200,
    compatibility: 'C-Class, E-Class, GLC',
    stockStatus: 'In Stock',
    deliveryTime: '1hr delivery',
    badge: 'BEST VALUE',
    badgeColor: 'bg-green-600',
  },
  {
    id: '3',
    brand: 'Toyota',
    name: 'Shock Absorbers',
    price: 3200,
    originalPrice: 4000,
    compatibility: 'Hilux, Fortuner',
    stockStatus: 'Only 2 left',
    deliveryTime: '3hr delivery',
    badge: 'LIMITED',
    badgeColor: 'bg-orange-600',
  },
  {
    id: '4',
    brand: 'Audi',
    name: 'Air Filter',
    price: 1200,
    originalPrice: 1500,
    compatibility: 'A3, A4, Q3, Q5',
    stockStatus: 'In Stock',
    deliveryTime: '2hr delivery',
    badge: 'PREMIUM',
    badgeColor: 'bg-purple-600',
  },
];

/**
 * Featured parts section component
 */
export const FeaturedParts = memo(function FeaturedParts() {
  const handleOrderClick = (part: FeaturedPart) => {
    window.open(
      `https://wa.me/${CONTACT_INFO.WHATSAPP}?text=🚗 I need ${part.brand} ${part.name} - Rs ${part.price} deal!`,
      '_blank'
    );
  };

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
            🔥 Most Requested Parts (Flying Off Shelves!)
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg lg:text-xl">
            <strong>These parts sell out fast!</strong> Order now before stock runs out.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {FEATURED_PARTS.map((part) => (
            <Card
              key={part.id}
              className="relative overflow-hidden border-2 border-transparent transition-all hover:border-[#D72638] hover:shadow-lg"
            >
              <div className={`absolute right-2 top-2 rounded-full ${part.badgeColor} px-2 py-1 text-xs font-bold text-white`}>
                {part.badge}
              </div>
              
              <CardContent className="space-y-2 p-4 md:space-y-3 md:p-6">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {part.brand}
                  </Badge>
                  <PriceDisplay
                    price={part.price}
                    originalPrice={part.originalPrice}
                    size="sm"
                    showDiscount={false}
                  />
                </div>

                <h3 className="text-base font-semibold md:text-lg">{part.name}</h3>

                <p className="text-xs text-gray-600 md:text-sm">✅ Compatible: {part.compatibility}</p>

                <div className="flex items-center justify-between text-xs">
                  <span className={part.stockStatus.includes('Only') ? 'font-semibold text-orange-600' : 'font-semibold text-green-600'}>
                    📦 {part.stockStatus}
                  </span>
                  <span className="font-semibold text-orange-600">⚡ {part.deliveryTime}</span>
                </div>

                <div className="rounded bg-yellow-50 p-2 text-center text-xs">
                  <span className="font-semibold text-yellow-800">
                    💰 Save Rs {part.originalPrice - part.price} vs dealer!
                  </span>
                </div>

                <Button
                  className={`w-full bg-[#D72638] text-xs font-bold hover:bg-[#B91C2C] md:text-sm ${
                    part.stockStatus.includes('Only') ? 'animate-pulse' : ''
                  }`}
                  onClick={() => handleOrderClick(part)}
                >
                  {part.stockStatus.includes('Only') ? '🔥 GRAB LAST 2 ' : '🛒 ORDER NOW '}
                  (Save Rs {part.originalPrice - part.price})
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
});

