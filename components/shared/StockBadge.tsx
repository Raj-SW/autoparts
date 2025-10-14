import { Badge } from '@/components/ui/badge';
import { formatStockStatus } from '@/lib/utils/formatters';

interface StockBadgeProps {
  stock: number;
  lowStockThreshold?: number;
  showQuantity?: boolean;
}

/**
 * Reusable stock status badge component
 */
export function StockBadge({ stock, lowStockThreshold = 10, showQuantity = true }: StockBadgeProps) {
  const { label, variant, color } = formatStockStatus(stock, lowStockThreshold);

  return (
    <Badge variant={variant} className={color}>
      {showQuantity && stock > 0 ? `${stock} in stock` : label}
    </Badge>
  );
}

