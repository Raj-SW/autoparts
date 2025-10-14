'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  initialValue?: string;
  debounceMs?: number;
  className?: string;
}

/**
 * Reusable search bar with debounce
 */
export function SearchBar({
  placeholder = 'Search...',
  onSearch,
  initialValue = '',
  debounceMs = 500,
  className,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const debouncedQuery = useDebounce(searchQuery, debounceMs);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 pr-10"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 h-8 w-8"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

