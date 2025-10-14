'use client';

import { memo, useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

/**
 * Urgency banner with countdown timer
 */
export const UrgencyBanner = memo(function UrgencyBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set deadline to end of day
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      
      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#D72638] py-2 text-center text-white">
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-2 px-4 text-xs font-semibold md:gap-4 md:text-sm">
        <Zap className="h-3 w-3 md:h-4 md:w-4" />
        <span className="flex-shrink-0">
          🔥 LIMITED TIME: Free same-day delivery on orders over Rs 5,000!
        </span>
        <span className="rounded bg-white px-2 py-1 font-mono text-[#D72638]">
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
});

