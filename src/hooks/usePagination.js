import { useState, useMemo, useCallback } from 'react';

export function usePagination(items = [], pageSize = 12) {
  const [page, setPage] = useState(1);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const currentPage = Math.min(page, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const goToPage = useCallback(
    (next) => {
      setPage(Math.min(Math.max(1, next), totalPages));
    },
    [totalPages]
  );

  const nextPage = useCallback(() => goToPage(currentPage + 1), [goToPage, currentPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [goToPage, currentPage]);
  const resetPage = useCallback(() => setPage(1), []);

  return {
    page: currentPage,
    pageSize,
    total,
    totalPages,
    items: paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    resetPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

export default usePagination;
