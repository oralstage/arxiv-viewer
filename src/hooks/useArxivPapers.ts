import { useState, useEffect, useCallback, useRef } from 'react';
import type { ArxivPaper } from '../types';
import { fetchArxivPapers } from '../services/arxivApi';

const PAGE_SIZE = 50;

export function useArxivPapers(categories: string[]) {
  const [papers, setPapers] = useState<ArxivPaper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const categoriesKey = categories.sort().join(',');
  const abortRef = useRef<AbortController | null>(null);

  const fetchPapers = useCallback(async () => {
    if (categories.length === 0) {
      setPapers([]);
      setError(null);
      setHasMore(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchArxivPapers(categories, PAGE_SIZE, 0);
      if (!controller.signal.aborted) {
        setPapers(result);
        setHasMore(result.length >= PAGE_SIZE);
      }
    } catch (e) {
      if (!controller.signal.aborted) {
        setError(e instanceof Error ? e.message : 'Failed to fetch papers');
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [categoriesKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(async () => {
    if (categories.length === 0 || isLoadingMore || !hasMore) return;

    const controller = new AbortController();
    setIsLoadingMore(true);

    try {
      const result = await fetchArxivPapers(categories, PAGE_SIZE, papers.length);
      if (!controller.signal.aborted) {
        // Deduplicate against existing papers
        const existingIds = new Set(papers.map((p) => p.id));
        const newPapers = result.filter((p) => !existingIds.has(p.id));
        setPapers((prev) => [...prev, ...newPapers]);
        setHasMore(result.length >= PAGE_SIZE);
      }
    } catch (e) {
      if (!controller.signal.aborted) {
        setError(e instanceof Error ? e.message : 'Failed to load more papers');
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoadingMore(false);
      }
    }
  }, [categories, papers, isLoadingMore, hasMore]);

  useEffect(() => {
    fetchPapers();
    return () => {
      abortRef.current?.abort();
    };
  }, [fetchPapers]);

  return { papers, isLoading, isLoadingMore, error, hasMore, refetch: fetchPapers, loadMore };
}
