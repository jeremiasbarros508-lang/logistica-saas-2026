"use client";

import { useState, useCallback } from "react";

interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
}

export function usePagination(options: PaginationOptions = {}) {
  const [page, setPage] = useState(options.initialPage ?? 1);
  const [pageSize, setPageSize] = useState(options.initialPageSize ?? 20);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const nextPage = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const changePageSize = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setPage(options.initialPage ?? 1);
    setPageSize(options.initialPageSize ?? 20);
  }, [options.initialPage, options.initialPageSize]);

  return {
    page,
    pageSize,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    reset,
    offset: (page - 1) * pageSize,
  };
}
