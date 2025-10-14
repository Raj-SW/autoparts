'use client';

import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

interface FlashDeal {
  id: string;
  title: string;
  originalPrice: string;
  salePrice: string;
  savings: string;
  timeLeft: string;
  stock: string;
  demandLevel: string;
}

const FLASH_DEALS: FlashDeal[] = [
  {
    id: '1',
    title: 'Flash Sale: BMW Brake Pads',
    originalPrice: 'Rs 3,200',
    salePrice: 'Rs 2,500',
    savings: 'Rs 700',
    timeLeft: '2 hours',
    stock: 'Only 3 left',
    demandLevel: 'High',
  },
  {
    id: '2',
    title: 'Limited: Hilux Shock Absorbers',
    originalPrice: 'Rs 4,000',
    salePrice: 'Rs 3,200',
    savings: 'Rs 800',
    timeLeft: '6 hours',
    stock: 'Only 2 left',
    demandLevel: 'Critical',
  },
];

/**
 * Flash deals section with urgency messaging
 */
export const FlashDealsSection = memo(function FlashDealsSection() {
  const handleDealClick = (deal: FlashDeal) => {
    window.open(
      `https://wa.me/${CONTACT_INFO.WHATSAPP}?text=🔥 I want the flash deal: ${deal.title}`,
      '_blank'
    );
  };

  return (
    <section className="border-y-2 border-red-200 bg-red-50 py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="mb-4 text-center md:mb-6">
          <h2 className="flex items-center justify-center space-x-2 text-xl font-bold text-red-800 md:text-2xl">
            <AlertTriangle className="h-5 w-5 md:h-6 md:w-6" />
            <span>🔥 FLASH DEALS - LIMITED TIME!</span>
            <AlertTriangle className="h-5 w-5 md:h-6 md:w-6" />
          </h2>
        </div>
        
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2 md:gap-6">
          {FLASH_DEALS.map((deal) => (
            <Card key={deal.id} className="relative overflow-hidden border-2 border-red-300 bg-white">
              <div className="absolute right-0 top-0 bg-red-600 px-2 py-1 text-xs font-bold text-white md:px-3 md:text-sm">
                SAVE {deal.savings}
              </div>
              
              <CardContent className="p-4 md:p-6">
                <h3 className="mb-2 text-base font-bold md:text-lg">{deal.title}</h3>
                
                <div className="mb-3 flex items-center space-x-3">
                  <span className="text-xl font-bold text-[#D72638] md:text-2xl">{deal.salePrice}</span>
                  <span className="text-base text-gray-500 line-through md:text-lg">
                    {deal.originalPrice}
                  </span>
                </div>
                
                <div className="mb-3 flex items-center justify-between text-xs md:mb-4 md:text-sm">
                  <span className="font-semibold text-red-600">⏰ {deal.timeLeft} left</span>
                  <span className="font-semibold text-orange-600">📦 {deal.stock}</span>
                </div>
                
                <Button
                  className="w-full bg-red-600 text-sm font-bold text-white hover:bg-red-700 md:text-base"
                  onClick={() => handleDealClick(deal)}
                >
                  🛒 GRAB THIS DEAL NOW!
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
});

