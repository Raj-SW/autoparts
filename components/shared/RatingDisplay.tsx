import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingDisplayProps {
  rating: number;
  maxRating?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Reusable rating display component with stars
 */
export function RatingDisplay({
  rating,
  maxRating = 5,
  showValue = true,
  size = 'md',
  className,
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={cn('fill-yellow-400 text-yellow-400', sizeClasses[size])} />
        ))}
        {hasHalfStar && (
          <StarHalf className={cn('fill-yellow-400 text-yellow-400', sizeClasses[size])} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={cn('text-gray-300', sizeClasses[size])} />
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground">
          {rating.toFixed(1)}/{maxRating}
        </span>
      )}
    </div>
  );
}

