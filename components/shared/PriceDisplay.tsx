import { formatPrice } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  currency?: string;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showDiscount?: boolean;
}

/**
 * Reusable price display component with optional original price and discount
 */
export function PriceDisplay({
  price,
  currency = 'MUR',
  originalPrice,
  size = 'md',
  className,
  showDiscount = true,
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const originalSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('font-bold text-primary', sizeClasses[size])}>
        {formatPrice(price, currency)}
      </span>
      {originalPrice && originalPrice > price && (
        <>
          <span className={cn('text-muted-foreground line-through', originalSizeClasses[size])}>
            {formatPrice(originalPrice, currency)}
          </span>
          {showDiscount && (
            <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-700">
              Save {discount}%
            </span>
          )}
        </>
      )}
    </div>
  );
}

