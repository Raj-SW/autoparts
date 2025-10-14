'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { apiClient } from '@/lib/api-client-optimized';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { BreadcrumbWrapper } from '@/components/BreadcrumbWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchBar } from '@/components/shared/SearchBar';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Pagination } from '@/components/shared/Pagination';
import { PartCard } from './components/PartCard';
import { FilterPanel } from './components/FilterPanel';
import { SORT_OPTIONS } from '@/lib/constants';
import type { Part, SearchFilters } from '@/types';

/**
 * Optimized catalog page with better performance and UX
 */
export default function CatalogPage() {
  const searchParams = useSearchParams();
  const { addItem, isInCart } = useCart();

  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  const [filters, setFilters] = useState<SearchFilters>({
    search: searchParams.get('search') || '',
    category: undefined,
    brand: undefined,
    make: undefined,
    model: undefined,
    year: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    condition: undefined,
    inStock: false,
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch parts with memoized parameters
  const fetchParts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: '20',
        sortBy,
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (filters.make) params.make = filters.make;
      if (filters.category) params.category = filters.category;
      if (filters.brand) params.brand = filters.brand;
      if (filters.condition) params.condition = filters.condition;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.inStock) params.inStock = 'true';

      const data = await apiClient.getParts(params);

      setParts(data.parts || []);
      setTotalCount(data.total || data.pagination?.totalCount || 0);
      
      // Update available brands from filter data
      if (data.filters?.brands) {
        setAvailableBrands(data.filters.brands);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search parts. Please try again.');
      setParts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, debouncedSearch, filters]);

  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  const handleAddToCart = useCallback((part: Part) => {
    addItem({
      id: part._id as string,
      partNumber: part.partNumber,
      name: part.name,
      price: part.price,
      stock: part.stock,
      image: part.images[0]?.url,
    });
  }, [addItem]);

  const handleSearchChange = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
    setCurrentPage(1);
  }, []);

  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      search: '',
      category: undefined,
      brand: undefined,
      make: undefined,
      model: undefined,
      year: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      condition: undefined,
      inStock: false,
    });
    setCurrentPage(1);
  }, []);

  const totalPages = useMemo(() => Math.ceil(totalCount / 20), [totalCount]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <PageHeader
        title="Parts Catalog"
        description="Genuine spare parts for premium vehicles"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <div className="container mx-auto px-4 py-8">
        <BreadcrumbWrapper />

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <SearchBar
                placeholder="Search by part number, name, or description..."
                onSearch={handleSearchChange}
                initialValue={filters.search}
                className="w-full"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>

          {showFilters && (
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleResetFilters}
              availableBrands={availableBrands}
            />
          )}
        </div>

        {/* Results Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            {loading ? 'Searching...' : `${totalCount} parts found`}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Parts Display */}
        {loading ? (
          <LoadingSpinner className="py-16" text="Loading parts..." />
        ) : parts.length > 0 ? (
          <>
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4'
                  : 'space-y-4'
              }
            >
              {parts.map((part) => (
                <PartCard
                  key={part._id as string}
                  part={part}
                  viewMode={viewMode}
                  onAddToCart={handleAddToCart}
                  isInCart={isInCart(part._id as string)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                className="mt-8"
              />
            )}
          </>
        ) : (
          <EmptyState
            title="No parts found"
            description="Try adjusting your search criteria or browse by category"
            action={{
              label: 'Clear Filters',
              onClick: handleResetFilters,
            }}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}

