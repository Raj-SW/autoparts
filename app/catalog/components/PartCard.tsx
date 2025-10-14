'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { StockBadge } from '@/components/shared/StockBadge';
import { formatCompatibility } from '@/lib/utils/formatters';
import type { Part } from '@/types';

interface PartCardProps {
  part: Part;
  viewMode?: 'grid' | 'list';
  onAddToCart: (part: Part) => void;
  isInCart: boolean;
}

/**
 * Optimized part card component with memoization
 */
export const PartCard = memo(function PartCard({
  part,
  viewMode = 'grid',
  onAddToCart,
  isInCart,
}: PartCardProps) {
  const isOutOfStock = part.stock === 0;
  const imageUrl = part.images[0]?.url || '/placeholder.jpg';
  const compatibility = formatCompatibility(part.compatibility);

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <ImageWithFallback
              src={imageUrl}
              alt={part.name}
              width={96}
              height={96}
              className="h-24 w-24 rounded object-cover"
            />
            
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{part.name}</h3>
                <PriceDisplay price={part.price} currency={part.currency} size="md" />
              </div>
              
              <p className="text-sm text-muted-foreground">#{part.partNumber}</p>
              <p className="line-clamp-2 text-sm text-muted-foreground">{part.description}</p>
              
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span>
                  {part.brand} {compatibility}
                </span>
                <span>•</span>
                <span>{part.category}</span>
                <span>•</span>
                <Badge variant="outline" className="text-xs">
                  {part.specifications?.condition || 'New'}
                </Badge>
                <span>•</span>
                <StockBadge stock={part.stock} lowStockThreshold={part.lowStockThreshold} />
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onAddToCart(part)}
                  disabled={isOutOfStock || isInCart}
                >
                  <ShoppingCart className="mr-1 h-3 w-3" />
                  {isInCart ? 'In Cart' : 'Add to Cart'}
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/catalog/${part._id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden transition-all hover:border-primary hover:shadow-lg">
      <div className="relative">
        <ImageWithFallback
          src={imageUrl}
          alt={part.name}
          width={400}
          height={300}
          className="h-48 w-full object-cover"
        />
        <div className="absolute right-2 top-2 flex gap-2">
          <StockBadge stock={part.stock} lowStockThreshold={part.lowStockThreshold} showQuantity={false} />
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="line-clamp-2 text-sm font-semibold leading-tight">{part.name}</h3>
          </div>
          
          <p className="text-xs text-muted-foreground">#{part.partNumber}</p>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{part.brand}</span>
            <span>•</span>
            <span>{part.category}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <PriceDisplay price={part.price} currency={part.currency} size="md" showDiscount={false} />
            <Badge variant="outline" className="text-xs">
              {part.specifications?.condition || 'New'}
            </Badge>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => onAddToCart(part)}
              disabled={isOutOfStock || isInCart}
              className="flex-1"
            >
              <ShoppingCart className="mr-1 h-3 w-3" />
              {isInCart ? 'In Cart' : 'Add'}
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/catalog/${part._id}`}>View</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.part._id === nextProps.part._id &&
    prevProps.part.stock === nextProps.part.stock &&
    prevProps.isInCart === nextProps.isInCart &&
    prevProps.viewMode === nextProps.viewMode
  );
});

