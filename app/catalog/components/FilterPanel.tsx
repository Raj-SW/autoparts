'use client';

import { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CAR_MAKES, PART_CATEGORIES, PART_CONDITIONS } from '@/lib/constants';
import type { SearchFilters } from '@/types';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onReset: () => void;
  availableBrands?: string[];
}

/**
 * Optimized filter panel component
 */
export const FilterPanel = memo(function FilterPanel({
  filters,
  onFiltersChange,
  onReset,
  availableBrands = [],
}: FilterPanelProps) {
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Memoize sorted options
  const sortedMakes = useMemo(() => [...CAR_MAKES].sort((a, b) => a.localeCompare(b)), []);
  const sortedCategories = useMemo(() => [...PART_CATEGORIES].sort((a, b) => a.localeCompare(b)), []);
  const sortedConditions = useMemo(() => [...PART_CONDITIONS].sort((a, b) => a.localeCompare(b)), []);
  const sortedBrands = useMemo(() => [...availableBrands].sort((a, b) => a.localeCompare(b)), [availableBrands]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Filters</span>
          <Button variant="ghost" size="sm" onClick={onReset}>
            Clear All
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Vehicle Make */}
          <div>
            <Label htmlFor="vehicle-make" className="text-sm font-medium">
              Vehicle Make
            </Label>
            <Select
              value={filters.make || 'all-makes'}
              onValueChange={(value) =>
                handleFilterChange('make', value === 'all-makes' ? undefined : value)
              }
            >
              <SelectTrigger id="vehicle-make">
                <SelectValue placeholder="All Makes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-makes">All Makes</SelectItem>
                {sortedMakes.map((make) => (
                  <SelectItem key={make} value={make}>
                    {make}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select
              value={filters.category || 'all-categories'}
              onValueChange={(value) =>
                handleFilterChange('category', value === 'all-categories' ? undefined : value)
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {sortedCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand */}
          {sortedBrands.length > 0 && (
            <div>
              <Label htmlFor="brand" className="text-sm font-medium">
                Brand
              </Label>
              <Select
                value={filters.brand || 'all-brands'}
                onValueChange={(value) =>
                  handleFilterChange('brand', value === 'all-brands' ? undefined : value)
                }
              >
                <SelectTrigger id="brand">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-brands">All Brands</SelectItem>
                  {sortedBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Condition */}
          <div>
            <Label htmlFor="condition" className="text-sm font-medium">
              Condition
            </Label>
            <Select
              value={filters.condition || 'all-conditions'}
              onValueChange={(value) =>
                handleFilterChange('condition', value === 'all-conditions' ? undefined : value)
              }
            >
              <SelectTrigger id="condition">
                <SelectValue placeholder="All Conditions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-conditions">All Conditions</SelectItem>
                {sortedConditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-2 md:col-span-2 lg:col-span-1">
            <Label className="text-sm font-medium">Price Range (MUR)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* In Stock Only */}
          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="in-stock"
              checked={filters.inStock || false}
              onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
            />
            <Label
              htmlFor="in-stock"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              In stock only
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Only re-render if filters or brands change
  return (
    JSON.stringify(prevProps.filters) === JSON.stringify(nextProps.filters) &&
    JSON.stringify(prevProps.availableBrands) === JSON.stringify(nextProps.availableBrands)
  );
});

