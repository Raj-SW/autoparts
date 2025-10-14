import { useState, useMemo } from 'react';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  pageNumbers: number[];
}

/**
 * Custom hook for pagination logic
 */
export function usePagination({
  totalItems,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const canGoNext = currentPage < totalPages;
  const canGoPrevious = currentPage > 1;

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (canGoNext) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const previousPage = () => {
    if (canGoPrevious) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Generate array of page numbers to display
  const pageNumbers = useMemo(() => {
    const maxPagesToShow = 5;
    const pages: number[] = [];

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show a range of pages around current page
      const halfRange = Math.floor(maxPagesToShow / 2);
      let startPage = Math.max(1, currentPage - halfRange);
      let endPage = Math.min(totalPages, currentPage + halfRange);

      // Adjust if we're at the start or end
      if (currentPage <= halfRange) {
        endPage = maxPagesToShow;
      } else if (currentPage >= totalPages - halfRange) {
        startPage = totalPages - maxPagesToShow + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,
    canGoNext,
    canGoPrevious,
    pageNumbers,
  };
}

